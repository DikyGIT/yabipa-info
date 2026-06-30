import { test, expect } from "@playwright/test";

// ========================
// AUTH & ROLE ACCESS TESTS
// ========================

test.describe("Login Page", () => {
  test("root redirects to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("show login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Masuk");
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "admin");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Username atau password salah")).toBeVisible();
  });
});

test.describe("Admin Login", () => {
  test("admin redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "admin");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("admin can access dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "admin");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("text=Selamat Datang")).toBeVisible();
  });
});

test.describe("Guru Login & Access", () => {
  test("guru redirects to landing page", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "guru");
    await page.fill("#password", "guru123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/yabipa-home/);
  });

  test("guru cannot access dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "guru");
    await page.fill("#password", "guru123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/yabipa-home/);

    // Coba akses dashboard langsung
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/yabipa-home/);
  });

  test("guru sees name in navbar", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "guru");
    await page.fill("#password", "guru123");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Guru", { exact: true })).toBeVisible();
  });
});

test.describe("Kepala Login & Access", () => {
  test("kepala redirects to landing page", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "kepala");
    await page.fill("#password", "kepala123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/yabipa-home/);
  });

  test("kepala cannot access dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "kepala");
    await page.fill("#password", "kepala123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/yabipa-home/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/yabipa-home/);
  });

  test("kepala sees name in navbar", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#username", "kepala");
    await page.fill("#password", "kepala123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Kepala Sekolah")).toBeVisible();
  });
});

test.describe("Unauthenticated Access", () => {
  test("cannot access landing page without login", async ({ page }) => {
    await page.goto("/yabipa-home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("cannot access dashboard without login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Logout", () => {
  test("admin can logout", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill("#username", "admin");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await page.click("text=Logout");
    await expect(page).toHaveURL(/\/login/);
  });
});
