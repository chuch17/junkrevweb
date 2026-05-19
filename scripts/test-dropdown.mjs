import { chromium } from "playwright";

const urls = [
  "http://127.0.0.1:3000/",
  "https://cleanraccoon.com/",
];

for (const url of urls) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  const errors = [];
  page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => errors.push(String(err)));

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    console.log("\n===", url, "LOAD FAILED:", e.message);
    await browser.close();
    continue;
  }

  const hasFn = await page.evaluate(() => typeof window.toggleLocationsNav === "function");
  const desktopVisible = await page.locator(".navigation-desktop-menu").isVisible();

  let trigger = page.locator(".navigation-desktop-menu [data-locations-trigger]");
  if (!(await trigger.count())) {
    trigger = page.locator("[data-locations-trigger]").first();
  }

  await trigger.click({ force: true });
  await page.waitForTimeout(200);

  const state = await page.evaluate(() => {
    const menu = document.querySelector(".navigation-desktop-menu [data-locations-menu]") ||
      document.querySelector("[data-locations-menu]");
    if (!menu) return { found: false };
    const rect = menu.getBoundingClientRect();
    const cs = getComputedStyle(menu);
    return {
      found: true,
      className: menu.className,
      isOpen: menu.classList.contains("is-open"),
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      pointerEvents: cs.pointerEvents,
      zIndex: cs.zIndex,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    };
  });

  console.log("\n===", url);
  console.log("toggleLocationsNav defined:", hasFn);
  console.log("desktop menu visible:", desktopVisible);
  console.log("menu state after click:", JSON.stringify(state, null, 2));
  if (errors.length) console.log("PAGE ERRORS:", errors);
  if (logs.filter((l) => l.includes("[error]")).length) {
    console.log("CONSOLE ERRORS:", logs.filter((l) => l.includes("[error]")));
  }

  await browser.close();
}
