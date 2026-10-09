import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const bad = [];
page.on("response", async (res) => {
  const status = res.status();
  const url = res.url();
  if (status >= 400 || url.includes("_serverFn") || url.includes("serverFn")) {
    let body = "";
    try { body = (await res.text()).slice(0, 400); } catch {}
    bad.push({ status, url: url.slice(0, 180), ct: res.headers()["content-type"], body });
  }
});
page.on("pageerror", (err) => bad.push({ pageerror: String(err).slice(0, 300) }));
page.on("console", (msg) => {
  if (msg.type() === "error") bad.push({ console: msg.text().slice(0, 300) });
});

await page.goto("https://estaca-e-apontamento-l449.vercel.app/", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(2500);
console.log("TITLE", await page.title());
console.log("BODY", (await page.locator("body").innerText()).slice(0, 500));

const click = async (name) => {
  const loc = page.getByRole("button", { name }).or(page.getByRole("link", { name }));
  if (await loc.count()) {
    await loc.first().click({ timeout: 5000 }).catch((e) => console.log("click fail", name, e.message));
    await page.waitForTimeout(1500);
    console.log("AFTER", name, page.url(), (await page.locator("body").innerText()).slice(0, 250).replaceAll("\n"," | "));
  } else console.log("missing", name);
};

await click("Simular no bairro");
await click("Apontar");
await page.goto("https://estaca-e-apontamento-l449.vercel.app/apontamento", { waitUntil: "networkidle", timeout: 30000 }).catch((e)=>console.log("goto apont", e.message));
await page.waitForTimeout(2000);
console.log("APONT", (await page.locator("body").innerText()).slice(0, 400).replaceAll("\n"," | "));

console.log("\n=== BAD ===");
for (const b of bad) console.log(JSON.stringify(b).slice(0, 500));
await browser.close();
