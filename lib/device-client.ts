let connecting: Promise<string> | undefined;
export function ensureDevice(): Promise<string> {
  if (connecting) return connecting;
  connecting = (async () => {
    const code = new URLSearchParams(location.search).get("pair");
    const existing = localStorage.getItem("bela-device-token");
    if (existing && !code) return existing;
    const response = await fetch("/api/device", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(code ? { action: "pair", code } : { action: "bootstrap" }),
    });
    const result = await response.json();
    if (!response.ok || !result.token) throw new Error(result.error || "Não foi possível conectar");
    localStorage.setItem("bela-device-token", result.token);
    if (code) history.replaceState({}, "", location.pathname);
    return result.token as string;
  })().finally(() => { connecting = undefined; });
  return connecting;
}
