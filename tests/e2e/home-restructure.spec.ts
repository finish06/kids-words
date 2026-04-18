import { expect, test } from "@playwright/test";

/**
 * Regression smoke for the cycle-16 Home Games/Practice restructure.
 *
 * Confirms:
 * - Home shows Games + Practice sections (no inline categories)
 * - Word Builder card still works (cycle-15 state preserved)
 * - Word Matching card → /matching → category → Length Picker (new 4-tap flow)
 * - Back navigation is hierarchical
 * - Listening Practice + ghost placeholder render in Practice section
 */

test.describe("Home Games/Practice restructure regression (cycle-16)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const guestButton = page.locator(".profile-card", { hasText: "Guest" });
    await Promise.race([
      guestButton.waitFor({ timeout: 3000 }).then(() => guestButton.click()),
      page.getByText("Kids Words").waitFor({ timeout: 3000 }),
    ]).catch(() => {});

    await expect(page.getByText("Kids Words")).toBeVisible({ timeout: 5000 });
  });

  test("HR-001: Home shows Games + Practice sections and game cards", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { name: "Games" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Practice" })).toBeVisible();
    await expect(page.getByText("Word Builder")).toBeVisible();
    await expect(page.getByText("Word Matching")).toBeVisible();
    await expect(page.getByText("Listening Practice")).toBeVisible();
    await expect(page.getByText("More coming soon")).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/home-games-practice/step-01-home-layout.png",
      fullPage: true,
    });
  });

  test("HR-002: Home no longer shows category cards directly", async ({ page }) => {
    await expect(page.getByText("Animals")).not.toBeVisible();
    await expect(page.getByText("Colors")).not.toBeVisible();
  });

  test("HR-003: Word Builder card is live and clickable", async ({ page }) => {
    const wbCard = page.locator(".game-card--word-builder");
    await expect(wbCard).toBeVisible();
    await expect(wbCard).not.toHaveClass(/game-card--disabled/);
  });

  test("HR-004: Listening Practice card is disabled placeholder", async ({
    page,
  }) => {
    await expect(page.getByText("Listening Practice")).toBeVisible();
    await expect(page.getByText("Coming soon")).toBeVisible();
  });

  test("HR-005: Word Matching card navigates to /matching category grid", async ({
    page,
  }) => {
    await page.locator(".game-card--word-matching").click();
    await expect(
      page.getByRole("heading", { name: "Word Matching" }),
    ).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Pick a category!")).toBeVisible();
    await expect(page.getByText("Animals")).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/home-games-practice/step-05-matching-screen.png",
      fullPage: true,
    });
  });

  test("HR-006: /matching → category → Length Picker (new 4-tap flow)", async ({
    page,
  }) => {
    await page.locator(".game-card--word-matching").click();
    await expect(page.getByText("Animals")).toBeVisible({ timeout: 5000 });
    await page.getByText("Animals").click();
    await expect(page.getByText("How many words?")).toBeVisible({
      timeout: 5000,
    });
    await page.screenshot({
      path: "tests/screenshots/home-games-practice/step-06-length-picker.png",
      fullPage: true,
    });
  });

  test("HR-007: Word Builder card navigates to Length Picker directly", async ({
    page,
  }) => {
    await page.locator(".game-card--word-builder").click();
    await expect(page.getByText("How many words?")).toBeVisible({
      timeout: 5000,
    });
  });

  test("HR-008: back from Length Picker returns up one level", async ({
    page,
  }) => {
    await page.locator(".game-card--word-matching").click();
    await page.getByText("Animals").click();
    await expect(page.getByText("How many words?")).toBeVisible({
      timeout: 5000,
    });

    await page.getByRole("button", { name: /back/i }).click();
    await expect(page.getByText("Pick a category!")).toBeVisible({
      timeout: 5000,
    });
  });

  test("HR-009: back from /matching returns to Home", async ({ page }) => {
    await page.locator(".game-card--word-matching").click();
    await expect(page.getByText("Pick a category!")).toBeVisible({
      timeout: 5000,
    });

    await page.getByRole("button", { name: /back/i }).click();
    await expect(page.getByRole("heading", { name: "Games" })).toBeVisible({
      timeout: 5000,
    });
  });
});
