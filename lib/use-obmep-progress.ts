"use client";
import {registerPendingSave} from './pending-saves';
import { useEffect, useState } from "react";
import {getStudyMode,studyStorage} from "./study-storage";
import { ensureDevice } from "./device-client";
import { mergeProgress, type ProgressRecord } from "./obmep-progress";

export function useObmepProgress() {
  const [progress, setProgress] = useState<ProgressRecord>({});
  const [ready, setReady] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [syncMessage, setSyncMessage] = useState("Carregando progresso…");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let local: ProgressRecord = {};
    try { local = JSON.parse(studyStorage.getItem("bela-obmep-progress-v1") || "{}"); } catch {}
    setProgress(local);
    void ensureDevice().then(async (token) => {
      if (cancelled) return;
      if(!token){setSyncMessage("Convidado • progresso apenas nesta sessão");return;}
      setDeviceToken(token);
      const response = await fetch("/api/obmep", { headers: { "x-bela-device-token": token } });
      if (!response.ok) throw new Error("sync");
      const result = await response.json();
      if (!cancelled) { setProgress(mergeProgress(local, result.progress || {})); setSyncMessage("Progresso sincronizado"); }
    }).catch(() => { if (!cancelled) setSyncMessage("Salvo neste aparelho. Tentaremos sincronizar ao reconectar."); })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const online = () => { void ensureDevice().then(setDeviceToken).catch(() => {}); setRetry((n) => n + 1); };
    window.addEventListener("online", online);
    return () => window.removeEventListener("online", online);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { studyStorage.setItem("bela-obmep-progress-v1", JSON.stringify(progress)); } catch {}
    if (!deviceToken) return;
    const save=async () => {
      setSyncMessage("Salvando progresso…");
      await fetch("/api/obmep", {
        method: "POST", headers: { "content-type": "application/json", "x-bela-device-token": deviceToken },
        body: JSON.stringify({ progress }),
      }).then((r) => { if (!r.ok) throw new Error("sync"); setSyncMessage("Progresso sincronizado"); })
        .catch(() => {setSyncMessage("Salvo neste aparelho. Tentaremos sincronizar ao reconectar.");throw new Error("O progresso OBMEP aguarda sincronização.");});
    };
    registerPendingSave("obmep",save);
    const timer=setTimeout(()=>{void save().catch(()=>{});},350);
    return () => clearTimeout(timer);
  }, [progress, ready, deviceToken, retry]);
  return { progress, setProgress, syncMessage, deviceToken };
}
