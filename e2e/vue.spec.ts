import { test, expect } from '@playwright/test';

test.describe('Multiplication Table Teacher', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all storage and cookies before each test
    await context.clearCookies();
    await context.clearPermissions();

    // Navigate to page and clear localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload to ensure clean state
    await page.reload();
  });

  test('displays the main board with title and grid', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toHaveText('Multiplication Table Teacher');

    // Check lesson button is present
    await expect(page.getByRole('button', { name: 'Start Lesson (10 Questions)' })).toBeVisible();

    // Check grid headers are present (2-12) - just check a few key ones
    await expect(page.locator('.grid-header').filter({ hasText: /^2$/ }).first()).toBeVisible();
    await expect(page.locator('.grid-header').filter({ hasText: /^12$/ }).first()).toBeVisible();

    // Check legend is present
    await expect(page.locator('h3').filter({ hasText: 'Performance Legend' })).toBeVisible();
  });

  test('can practice a single question', async ({ page }) => {
    // Verify we start with clean state - all circles should show "Not attempted"
    await expect(page.getByTitle('2×2\nNot attempted', { exact: true })).toBeVisible();

    // Click on 2×2 circle
    await page.getByTitle('2×2\nNot attempted', { exact: true }).click();

    // Should navigate to question view
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
    await expect(page.locator('text=2 × 2')).toBeVisible();
    await expect(page.locator('text== 4')).toBeVisible();

    // Check timer is running
    await expect(page.locator('text=/\\d+\\.\\ds/')).toBeVisible();

    // Click correct answer
    await page.getByRole('button', { name: 'Mark answer as correct' }).click();

    // Should return to main board
    await expect(page.locator('h1')).toHaveText('Multiplication Table Teacher');

    // The 2×2 circle should no longer show "Not attempted"
    await expect(page.getByTitle('2×2\nNot attempted', { exact: true })).not.toBeVisible();

    // Should show some performance data instead (just check that it's not "Not attempted")
    const circle2x2 = page.locator('[title*="2×2"]').first();
    await expect(circle2x2).toBeVisible();
    await expect(circle2x2).not.toHaveAttribute('title', '2×2\nNot attempted');
  });

  test('can start and navigate through a lesson', async ({ page }) => {
    // Start a lesson
    await page.getByRole('button', { name: 'Start Lesson (10 Questions)' }).click();

    // Should show question view with progress indicator
    await expect(page.locator('text=1/10')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();

    // Should show a multiplication question
    await expect(page.locator('text=/\\d+ × \\d+/')).toBeVisible();
    await expect(page.locator('text=/= \\d+/')).toBeVisible();

    // Answer correctly
    await page.getByRole('button', { name: 'Mark answer as correct' }).click();

    // Should advance to question 2
    await expect(page.locator('text=2/10')).toBeVisible();

    // Cancel lesson by going back
    await page.getByRole('button', { name: 'Go back' }).click();

    // Should return to main board
    await expect(page.locator('h1')).toHaveText('Multiplication Table Teacher');
  });

  test('can answer questions incorrectly', async ({ page }) => {
    // Verify clean state
    await expect(page.getByTitle('3×3\nNot attempted', { exact: true })).toBeVisible();

    // Click on 3×3 circle
    await page.getByTitle('3×3\nNot attempted', { exact: true }).click();

    // Should show question view
    await expect(page.locator('text=3 × 3')).toBeVisible();
    await expect(page.locator('text== 9')).toBeVisible();

    // Click wrong answer
    await page.getByRole('button', { name: 'Mark answer as wrong' }).click();

    // Should return to main board
    await expect(page.locator('h1')).toHaveText('Multiplication Table Teacher');

    // The 3×3 circle should show it was attempted (no longer "Not attempted")
    await expect(page.getByTitle('3×3\nNot attempted', { exact: true })).not.toBeVisible();

    // Should show some performance data (wrong answers still get tracked)
    const circle3x3 = page.locator('[title*="3×3"]').first();
    await expect(circle3x3).toBeVisible();
    await expect(circle3x3).not.toHaveAttribute('title', '3×3\nNot attempted');
  });
});
