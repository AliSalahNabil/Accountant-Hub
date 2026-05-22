const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => console.log("CONSOLE:", m.type(), m.text()));
  page.on("pageerror", (e) => console.log("ERROR:", e.message));

  await page.goto("https://accountant-hub.vercel.app/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "c:/Ali/Task/screenshots/live-home.png", fullPage: true });
  console.log("home captured");

  await page.goto("https://accountant-hub.vercel.app/jobs", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "c:/Ali/Task/screenshots/live-jobs.png", fullPage: true });
  console.log("jobs captured");

  // Check if Tailwind CSS loaded
  const cssLinks = await page.evaluate(() => {
    return Array.from(document.styleSheets).map((s) => s.href).filter(Boolean);
  });
  console.log("CSS sheets:", JSON.stringify(cssLinks, null, 2));

  await b.close();
})();
