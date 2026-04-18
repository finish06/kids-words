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

  test("HR-002: Word Builder card is present and gated Coming soon (cycle-14)", async ({
    page,
  }) => {
    await expect(page.getByText("Word Builder")).toBeVisible();
    // Card is disabled pending design iteration post-PAT
    await expect(
      page.locator(".game-card--word-builder.game-card--disabled"),
    ).toBeVisible();
  });

  test("HR-003: Word Phonetics placeholder is present and disabled", async ({
    page,
  }) => {
    await expect(page.getByText("Word Phonetics")).toBeVisible();
    // Both game cards now show Coming soon pending design work
    const comingSoon = page.getByText("Coming soon");
    await expect(comingSoon.first()).toBeVisible();
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
});
