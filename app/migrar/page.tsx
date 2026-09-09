"use client";
import { useState } from "react";
import { ensureDevice } from "../../lib/device-client";
export default function Migrate() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function importFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > 2_000_000) throw new Error("Arquivo muito grande.");
      const data = JSON.parse(await file.text());
      if (data.format !== "bela-progress" || data.version !== 1) throw new Error("Selecione um arquivo de progresso exportado pelo app antigo.");
      let token: string;
      if (data.deviceToken) {
        if (typeof data.deviceToken !== "string" || !/^[a-f0-9]{48}$/.test(data.deviceToken)) throw new Error("Chave inválida.");
        const response = await fetch("/api/sync", { headers: { "x-bela-device-token": data.deviceToken } });
        if (!response.ok) throw new Error("O progresso antigo ainda não foi transferido para o servidor. Seu arquivo foi preservado; tente após a migração.");
        const result = await response.json();
        if (result.state) localStorage.setItem("bela-study-progress", JSON.stringify(result.state));
        else if (data.study && typeof data.study === "object") {
          const saved = await fetch("/api/sync", { method: "POST", headers: { "content-type": "application/json", "x-bela-device-token": data.deviceToken }, body: JSON.stringify({state:data.study}) });
          if (!saved.ok) throw new Error("Não foi possível salvar as matérias. Tente novamente.");
          localStorage.setItem("bela-study-progress", JSON.stringify(data.study));
        }
        token = data.deviceToken;
        localStorage.setItem("bela-device-token", token);
        sessionStorage.removeItem("bela-parent-token");
      } else { token = await ensureDevice(); }
      // When switching profiles, bring any OBMEP backup already imported on this device.
      const obmep = data.obmep || JSON.parse(localStorage.getItem("bela-obmep-progress-v1") || "null");
      if (obmep) {
        const response = await fetch("/api/obmep", { method: "POST", headers: { "content-type": "application/json", "x-bela-device-token": token }, body: JSON.stringify({progress:obmep}) });
        if (!response.ok) throw new Error("Não foi possível importar o progresso OBMEP. Seu arquivo permanece disponível para tentar novamente.");
        const latest = await fetch("/api/obmep", {headers:{"x-bela-device-token":token}});
        if (!latest.ok) throw new Error("Progresso salvo; tente novamente para atualizar este aparelho.");
        localStorage.setItem("bela-obmep-progress-v1", JSON.stringify((await latest.json()).progress));
      }
      setMessage("Progresso importado! Você pode selecionar o arquivo do outro app ou voltar aos estudos.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível ler o arquivo."); }
    finally { setBusy(false); }
  }
  return <main className="page" style={{maxWidth:720,padding:"32px 20px",margin:"auto"}}>
    <h1>Trazer meu progresso</h1>
    <p>Selecione os arquivos exportados pelos aplicativos antigos. Comece pelo arquivo das matérias e depois importe o da OBMEP Mirim.</p>
    <label>Arquivo de progresso <input type="file" accept=".json,application/json" disabled={busy} onChange={(e) => { void importFile(e.target.files?.[0]); e.target.value = ""; }} /></label>
    <p role="status">{busy ? "Importando…" : message}</p>
    <p><a href="/">Voltar aos estudos</a></p>
  </main>;
}
