/** Framework-independent voice lifecycle. Audio and transport stay injected. */
export type VoicePhase = 'idle' | 'permission' | 'listening' | 'thinking' | 'audio' | 'speaking' | 'error';
export type TutorVoicePhase = VoicePhase;

export interface TutorVoiceCapture {
  stop(): void;
  finish(): void;
  setPlayback(playing: boolean): void;
}

export interface TutorVoiceClock {
  now(): number;
  setTimeout(callback: () => void, milliseconds: number): unknown;
  clearTimeout(handle: unknown): void;
}

export interface TutorVoiceSessionDependencies<Turn> {
  openCapture(options: {
    signal: AbortSignal;
    onSpeechStart(): void;
    onUtterance(audioBase64: string, mime: string): void;
    onError(error: unknown): void;
  }): Promise<TutorVoiceCapture>;
  submit(audioBase64: string, mime: string, signal: AbortSignal): Promise<Turn>;
  play(turn: Turn, signal: AbortSignal, onSpeaking: () => void): Promise<void>;
  onTurn(turn: Turn): void;
  onState(phase: TutorVoicePhase): void;
  onError(message: string): void;
  clock?: TutorVoiceClock;
  idleTimeoutMs?: number;
  maxDurationMs?: number;
}

type Session = {
  lifetime: AbortController;
  work: AbortController | null;
  capture: TutorVoiceCapture | null;
  start: Promise<void>;
  phase: TutorVoicePhase;
  capturing: boolean;
  expiresAt: number;
  idleTimer?: unknown;
  maxTimer?: unknown;
};

const defaultClock: TutorVoiceClock = {
  now: () => Date.now(),
  setTimeout: (callback, milliseconds) => setTimeout(callback, milliseconds),
  clearTimeout: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

export class TutorVoiceSession<Turn> {
  private readonly dependencies: TutorVoiceSessionDependencies<Turn>;
  private readonly clock: TutorVoiceClock;
  private session: Session | null = null;

  constructor(dependencies: TutorVoiceSessionDependencies<Turn>) {
    this.dependencies = dependencies;
    this.clock = dependencies.clock ?? defaultClock;
  }

  get active(): boolean { return this.session !== null; }

  start(): Promise<void> {
    if (this.session) return this.session.start;
    const session: Session = {
      lifetime: new AbortController(), work: null, capture: null,
      start: Promise.resolve(), phase: 'permission', capturing: false,
      expiresAt: Infinity,
    };
    this.session = session;
    this.state(session, 'permission');
    // Defer opening so concurrent starts share the assigned promise, even when
    // a capture implementation invokes its callbacks synchronously.
    session.start = Promise.resolve().then(() => this.open(session));
    return session.start;
  }

  stop(): void {
    const session = this.session;
    if (!session) return;
    this.dispose(session);
    this.dependencies.onState('idle');
  }

  /** Cancel the current answer, keeping the microphone and session alive. */
  interrupt(): void {
    const session = this.session;
    if (!session) return;
    this.cancelWork(session);
    if (session.capture) this.listen(session);
  }

  /** Ask the capture implementation to emit the current utterance, if any. */
  finish(): void {
    const session = this.session;
    if (!session?.capture) return;
    try { session.capture.finish(); }
    catch (error) { this.fail(session, error); }
  }

  private current(session: Session): boolean {
    return this.session === session && !session.lifetime.signal.aborted;
  }

  private state(session: Session, phase: TutorVoicePhase): void {
    if (!this.current(session)) return;
    session.phase = phase;
    this.dependencies.onState(phase);
  }

  private clearIdle(session: Session): void {
    this.clock.clearTimeout(session.idleTimer);
    session.idleTimer = undefined;
  }

  private cancelWork(session: Session): void {
    const work = session.work;
    session.work = null; // Invalidate callbacks before abort listeners run.
    work?.abort();
    try { session.capture?.setPlayback(false); }
    catch (error) { this.fail(session, error); }
  }

  private dispose(session: Session): void {
    if (!this.current(session)) return;
    this.session = null; // All callbacks become stale before resource cleanup.
    this.clearIdle(session);
    this.clock.clearTimeout(session.maxTimer);
    session.lifetime.abort();
    session.work?.abort();
    session.work = null;
    const capture = session.capture;
    session.capture = null;
    try { capture?.setPlayback(false); } catch { /* Still close the device. */ }
    try { capture?.stop(); } catch { /* Already invalidated; cleanup is best effort. */ }
  }

  private fail(session: Session, error: unknown): void {
    if (!this.current(session)) return;
    this.dispose(session);
    this.dependencies.onState('error');
    const microphoneMessages: Record<string, string> = {
      NotAllowedError: 'Permita o acesso ao microfone para conversar por voz.',
      NotFoundError: 'Nenhum microfone foi encontrado. Conecte um e tente novamente.',
      NotReadableError: 'Não foi possível acessar o microfone. Verifique se outro aplicativo está usando o dispositivo.',
      SecurityError: 'O navegador bloqueou o acesso ao microfone. Confira as permissões deste site.',
      TimeoutError: 'A conexão demorou demais. Tente iniciar novamente ou escreva sua pergunta.',
    };
    const message = error instanceof Error
      ? microphoneMessages[error.name] ?? error.message
      : typeof error === 'string' ? error : '';
    const readable = /^(Failed to fetch|Load failed|NetworkError)/i.test(message) ? 'A conexão falhou. Confira a internet e tente iniciar novamente.' : message;
    this.dependencies.onError(readable.trim() || 'Não foi possível continuar a conversa por voz. Tente novamente.');
  }

  private listen(session: Session): void {
    if (!this.current(session)) return;
    this.clearIdle(session);
    this.state(session, 'listening');
    if (!this.current(session) || session.capturing) return;
    if (this.clock.now() >= session.expiresAt) {
      this.fail(session, 'A conversa por voz chegou a 10 minutos. Você pode iniciar outra.');
      return;
    }
    session.idleTimer = this.clock.setTimeout(() => {
      if (this.current(session) && session.phase === 'listening' && !session.capturing) {
        this.fail(session, 'A conversa por voz foi encerrada por inatividade. Você pode iniciar outra.');
      }
    }, this.dependencies.idleTimeoutMs ?? 60_000);
  }

  private async open(session: Session): Promise<void> {
    if (!this.current(session)) return;
    try {
      const capture = await this.dependencies.openCapture({
        signal: session.lifetime.signal,
        onSpeechStart: () => {
          if (!this.current(session)) return;
          session.capturing = true;
          this.clearIdle(session);
          this.cancelWork(session);
          this.state(session, 'listening');
        },
        onUtterance: (audioBase64, mime) => {
          if (!this.current(session)) return;
          session.capturing = false;
          if (!audioBase64) { this.listen(session); return; }
          void this.respond(session, audioBase64, mime);
        },
        onError: (error) => this.fail(session, error),
      });
      if (!this.current(session)) {
        capture.stop();
        return;
      }
      session.capture = capture;
      const maximum = this.dependencies.maxDurationMs ?? 600_000;
      session.expiresAt = this.clock.now() + maximum;
      session.maxTimer = this.clock.setTimeout(() => {
        if (this.current(session) && session.phase === 'listening' && !session.capturing) {
          this.listen(session);
        }
      }, maximum);
      if (!session.work) this.listen(session);
    } catch (error) {
      this.fail(session, error);
    }
  }

  private async respond(session: Session, audioBase64: string, mime: string): Promise<void> {
    this.clearIdle(session);
    this.cancelWork(session);
    if (!this.current(session)) return;
    const work = new AbortController();
    session.work = work;
    const current = () => this.current(session) && session.work === work && !work.signal.aborted;
    try {
      this.state(session, 'thinking');
      if (!current()) return;
      const turn = await this.dependencies.submit(audioBase64, mime, work.signal);
      if (!current()) return;
      this.dependencies.onTurn(turn);
      if (!current()) return;
      this.state(session, 'audio');
      if (!current()) return;
      await this.dependencies.play(turn, work.signal, () => {
        if (!current()) return;
        try {
          session.capture?.setPlayback(true);
          this.state(session, 'speaking');
        } catch (error) { this.fail(session, error); }
      });
      if (!current()) return;
      session.capture?.setPlayback(false);
      session.work = null;
      this.listen(session);
    } catch (error) {
      if (current()) this.fail(session, error);
    }
  }
}
