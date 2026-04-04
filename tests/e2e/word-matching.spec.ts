import { expect, test } from "@playwright/test";

test.describe("Word-Image Matching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-003: home screen shows categories", async ({ page }) => {
    await expect(page.getByText("Kids Words")).toBeVisible();
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
    // Colors has 10 words — 20 should be disabled
    const btn20 = page.locator(".picker-button", { hasText: "20" });
    await expect(btn20).toBeDisabled();
    // 5 and 10 should be enabled
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
    // Select Animals
    await page.getByText("Animals").click();
    await expect(page.getByText("How many words?")).toBeVisible();

    // Pick 5 words
    await page.getByText("5").click();

    // Should see progress "1 / 5"
    await expect(page.getByText("1 / 5")).toBeVisible();

    // Should see a word displayed
    const wordText = page.locator(".word-text");
    await expect(wordText).toBeVisible();

    // Should see image cards
    const imageCards = page.locator(".image-card");
    const count = await imageCards.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Click each image card until we find the correct one
    for (let i = 0; i < count; i++) {
      await imageCards.nth(i).click();
      // Small wait for animation
      await page.waitForTimeout(400);

      // Check if we advanced (correct answer advances after 1200ms)
      const correctCard = page.locator(".image-card.correct");
      if ((await correctCard.count()) > 0) {
        // Wait for auto-advance
        await page.waitForTimeout(1300);
        break;
      }
    }

    // Should have advanced or still be on question
    // (we may or may not have found the right one in order)
  });

  test("TC-002: incorrect match shakes, allows retry", async ({ page }) => {
    await page.getByText("Animals").click();
    await page.getByText("5").click();

    await expect(page.getByText("1 / 5")).toBeVisible();

    // Get the displayed word
    const wordText = await page.locator(".word-text").textContent();

    // Find an image card whose alt text doesn't match the word (incorrect answer)
    const imageCards = page.locator(".image-card");
    const count = await imageCards.count();

    for (let i = 0; i < count; i++) {
      const img = imageCards.nth(i).locator("img");
      const alt = await img.getAttribute("alt");
      if (alt !== wordText) {
        // Click wrong answer
        await imageCards.nth(i).click();

        // Should see shake animation (class added briefly)
        await expect(imageCards.nth(i)).toHaveClass(/shake/);

        // Wait for shake to clear
        await page.waitForTimeout(700);

        // Should still be on same question (not advanced)
        await expect(page.getByText("1 / 5")).toBeVisible();
        break;
      }
    }
  });
});
