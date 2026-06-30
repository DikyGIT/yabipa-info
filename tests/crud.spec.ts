import { test, expect } from "@playwright/test";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill("#username", "admin");
  await page.fill("#password", "admin123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  await page.waitForLoadState("networkidle");
}

// ========================
// CRUD BERITA
// ========================

test.describe("CRUD Berita", () => {
  test("admin can create berita", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/berita");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#judul")).toBeVisible({ timeout: 10000 });

    await page.fill("#judul", "Test Berita Playwright");
    await page.fill("#kategori", "Testing");
    await page.fill("#pj", "Admin");
    await page.fill("#tanggal", "2026-06-30");
    await page.click('button[type="submit"]:has-text("Simpan")');

    // Cek langsung di tabel (success message mungkin sudah hilang)
    await expect(page.locator("td:has-text('Test Berita Playwright')").first()).toBeVisible({ timeout: 10000 });
  });

  test("admin can delete berita", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/berita");
    await page.waitForLoadState("networkidle");

    const row = page.locator("tr", { hasText: "Test Berita Playwright" });
    if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
      page.on("dialog", (dialog) => dialog.accept());
      await row.locator("button:has-text('Hapus')").click();
      await page.waitForTimeout(1500);
      await expect(row).not.toBeVisible({ timeout: 5000 });
    }
  });
});

// ========================
// CRUD DOKUMEN
// ========================

test.describe("CRUD Dokumen", () => {
  test("admin can create dokumen", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/dokumen");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#nama")).toBeVisible({ timeout: 10000 });

    await page.fill("#nama", "Test Dokumen Playwright");
    await page.fill("#link", "https://drive.google.com/test-link");
    await page.click('button[type="submit"]:has-text("Simpan")');

    await expect(page.locator("td:has-text('Test Dokumen Playwright')").first()).toBeVisible({ timeout: 10000 });
  });

  test("admin can delete dokumen", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/dokumen");
    await page.waitForLoadState("networkidle");

    const row = page.locator("tr", { hasText: "Test Dokumen Playwright" });
    if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
      page.on("dialog", (dialog) => dialog.accept());
      await row.locator("button:has-text('Hapus')").click();
      await page.waitForTimeout(1500);
      await expect(row).not.toBeVisible({ timeout: 5000 });
    }
  });
});

// ========================
// KELOLA USER
// ========================

test.describe("Kelola User", () => {
  test("admin can create user", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/users");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#name")).toBeVisible({ timeout: 10000 });

    await page.fill("#name", "Test User Playwright");
    await page.fill("#username", "testplaywright");
    await page.fill("#password", "test123");
    await page.selectOption("#role", "GURU");
    await page.click('button[type="submit"]:has-text("Simpan")');

    await expect(page.locator("td:has-text('Test User Playwright')")).toBeVisible({ timeout: 10000 });
  });

  test("admin can delete user", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/users");
    await page.waitForLoadState("networkidle");

    const row = page.locator("tr", { hasText: "testplaywright" });
    if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
      page.on("dialog", (dialog) => dialog.accept());
      await row.locator("button:has-text('Hapus')").click();
      await page.waitForTimeout(1500);
      await expect(row).not.toBeVisible({ timeout: 5000 });
    }
  });
});
