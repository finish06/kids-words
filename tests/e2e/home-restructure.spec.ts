import { expect, test } from "@playwright/test";

/**
 * Regression smoke for the cycle-13 home-screen restructure.
 *
 * Confirms the existing Word Matching flow still works after CategoryList
 * was split into HomeScreen + GamesSection + WordMatchingSection.
 *
 * Full Word Builder E2E (happy path, wrong-tap, level-up) is deferred to
 * a post-PAT cycle per specs/ux/word-builder-ux.md + cycle-13 Q6.
 */

test.describe("Home restructure regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Handle profile picker if present (pick Guest)
    const guestButton = page.locator(".profile-card", { hasText: "Guest" });
    await Promise.race([
      guestButton.waitFor({ timeout: 3000 }).then(() => guestButton.click()),
      page.getByText("Kids Words").waitFor({ timeout: 3000 }),
    ]).catch(() => {});

    await expect(page.getByText("Kids Words")).toBeVisible({ timeout: 5000 });
  });

  test("HR-001: home shows both Games and Word Matching sections", async ({
    page,
  }) => {
    await expect(page.getByText("Games")).toBeVisible();
    await expect(page.getByText("Word Matching")).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/home-restructure/step-01-both-sections.png",
      fullPage: true,
    });
  });

  test("HR-002: Word Builder card is live and clickable (cycle-15 un-gate)", async ({
    page,
  }) => {
    await expect(page.getByText("Word Builder")).toBeVisible();
    // No longer disabled — un-gated after cycle-15's clue redesign
    await expect(
      page.locator(".game-card--word-builder:not(.game-card--disabled)"),
    ).toBeVisible();
  });

  test("HR-003: Listening Practice card is present and disabled (placeholder)", async ({
    page,
  }) => {
    // Renamed from Word Phonetics in cycle-15; actual game deferred to cycle-16
    await expect(page.getByText("Listening Practice")).toBeVisible();
    await expect(page.getByText("Coming soon")).toBeVisible();
  });

  test("HR-004: existing Animals category still navigates (regression)", async ({
    page,
  }) => {
    await page.getByText("Animals").click();
    // Length picker should appear (same behavior as before)
    await expect(page.getByText("How many words?")).toBeVisible({
      timeout: 5000,
    });
    await page.screenshot({
      path: "tests/screenshots/home-restructure/step-04-animals-length-picker.png",
      fullPage: true,
    });
  });

  test("HR-005: Word Builder card navigates to length picker (cycle-15 re-enable)", async ({
    page,
  }) => {
    await page.locator(".game-card--word-builder").click();
    await expect(page.getByText("How many words?")).toBeVisible({
      timeout: 5000,
    });
    await page.screenshot({
      path: "tests/screenshots/home-restructure/step-05-word-builder-picker.png",
      fullPage: true,
    });
  });
});
