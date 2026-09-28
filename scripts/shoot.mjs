// Full-page screenshots of the local dev server via headless Chromium + CDP (no npm deps).
// Usage: node scripts/shoot.mjs [baseURL] [outDir]
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://127.0.0.1:1313";
const out = process.argv[3] ?? ".preview";
const pages = { home: "/", experience: "/experience/", projects: "/projects/", homelab: "/projects/homelab/", contact: "/contact/" };
const viewports = { desktop: { width: 1280, height: 800, mobile: false, dpr: 1 }, mobile: { width: 390, height: 844, mobile: true, dpr: 2 } };
const schemes = ["light", "dark"];

mkdirSync(out, { recursive: true });
const port = 9333;
const chrome = spawn("chromium", ["--headless", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
  `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "shoot-"))}`, "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { await sleep(200); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map(); const waiters = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Page.loadEventFired") waiters.splice(0).forEach((f) => f());
});
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result)));
  ws.send(JSON.stringify({ id: i, method, params }));
});

await send("Page.enable");
for (const scheme of schemes) {
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] });
  for (const [vname, v] of Object.entries(viewports)) {
    await send("Emulation.setDeviceMetricsOverride", { width: v.width, height: v.height, deviceScaleFactor: v.dpr, mobile: v.mobile });
    for (const [pname, path] of Object.entries(pages)) {
      const loaded = new Promise((r) => waiters.push(r));
      await send("Page.navigate", { url: base + path });
      await loaded; await sleep(150);
      const { cssContentSize: s } = await send("Page.getLayoutMetrics");
      const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: v.width, height: Math.ceil(s.height), scale: 1 } });
      const file = join(out, `${pname}-${vname}${scheme === "dark" ? "-dark" : ""}.png`);
      writeFileSync(file, Buffer.from(data, "base64"));
      console.log(file);
    }
  }
}
ws.close(); chrome.kill();
