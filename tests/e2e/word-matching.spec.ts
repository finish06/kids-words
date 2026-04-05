import { expect, test } from "@playwright/test";

test.describe("Word-Image Matching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for app to load — either profile picker or category list
    // If profile picker shows (multiple profiles), pick Guest
    const guestButton = page.locator(".profile-card", { hasText: "Guest" });
    const categoryTitle = page.getByText("Kids Words");

    // Wait for either profile picker or category list
    await Promise.race([
      guestButton.waitFor({ timeout: 3000 }).then(() => guestButton.click()),
      categoryTitle.waitFor({ timeout: 3000 }),
    ]).catch(() => {
      // If neither appears quickly, just wait for categories
    });

    await expect(page.getByText("Kids Words")).toBeVisible({ timeout: 5000 });
  });

  test("TC-003: home screen shows categories", async ({ page }) => {
    await expect(page.getByText("Animals")).toBeVisible();
    await expect(page.getByText("Colors")).toBeVisible();
    await expect(page.getByText("Food")).toBeVisible();
  });

  test("TC-004: quiz picker shows 5/10/20 options", async ({ page }) => {
    await page.getByText("Animals").click();

    await expect(page.getByText("How many words?")).toBeVisible();
    await expect(page.getByText("5")).toBeVisible();
    await expect(page.getByText("10")).toBeVisible();
    await expect(page.getByText("20")).toBeVisible();
  });

  test("TC-004b: quiz picker disables options for small categories", async ({
    page,
  }) => {
    await page.getByText("Colors").click();

    await expect(page.getByText("How many words?")).toBeVisible();
    const btn20 = page.locator(".picker-button", { hasText: "20" });
    await expect(btn20).toBeDisabled();
    const btn5 = page.locator(".picker-button", { hasText: "5" });
    await expect(btn5).not.toBeDisabled();
  });

  test("TC-005: back from quiz picker returns home", async ({ page }) => {
    await page.getByText("Animals").click();
    await expect(page.getByText("How many words?")).toBeVisible();

    await page.getByText("← Back").click();
    await expect(page.getByText("Kids Words")).toBeVisible();
  });

  test("TC-001: happy path — select, pick length, match word", async ({
    page,
  }) => {
    await page.getByText("Animals").click();
    await expect(page.getByText("How many words?")).toBeVisible();

    await page.getByText("5").click();
    await expect(page.getByText("1 / 5")).toBeVisible();

    const wordText = page.locator(".word-text");
    await expect(wordText).toBeVisible();

    const imageCards = page.locator(".image-card");
    const count = await imageCards.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      await imageCards.nth(i).click();
      await page.waitForTimeout(400);

      const correctCard = page.locator(".image-card.correct");
      if ((await correctCard.count()) > 0) {
        await page.waitForTimeout(1300);
        break;
      }
    }
  });

  test("TC-002: incorrect match shakes, allows retry", async ({ page }) => {
    await page.getByText("Animals").click();
    await page.getByText("5").click();

    await expect(page.getByText("1 / 5")).toBeVisible();

    const wordText = await page.locator(".word-text").textContent();
    const imageCards = page.locator(".image-card");
    const count = await imageCards.count();

    for (let i = 0; i < count; i++) {
      const img = imageCards.nth(i).locator("img");
      const alt = await img.getAttribute("alt");
      if (alt !== wordText) {
        await imageCards.nth(i).click();
        await expect(imageCards.nth(i)).toHaveClass(/shake/);
        await page.waitForTimeout(700);
        await expect(page.getByText("1 / 5")).toBeVisible();
        break;
      }
    }
  });
});
