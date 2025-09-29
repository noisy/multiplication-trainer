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
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for the grid to load and find a question circle (2×2 position)
    await expect(page.locator('.status-circle').first()).toBeVisible();

    // Click on first available question circle (should be 2×2)
    await page.locator('.status-circle').first().click();

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

    // Should be back on the main board with the grid visible
    await expect(page.getByRole('button', { name: 'Start Lesson (10 Questions)' })).toBeVisible();
    await expect(page.locator('.status-circle').first()).toBeVisible();
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
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for the grid to load and find a question circle (3×3 position - should be around index 12)
    await expect(page.locator('.status-circle').first()).toBeVisible();

    // Click on a question circle (let's use nth(12) for 3×3 position)
    await page.locator('.status-circle').nth(12).click();

    // Should show question view (will show whatever question was clicked)
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
    await expect(page.locator('text=×')).toBeVisible(); // Should show multiplication symbol

    // Click wrong answer
    await page.getByRole('button', { name: 'Mark answer as wrong' }).click();

    // Should return to main board
    await expect(page.locator('h1')).toHaveText('Multiplication Table Teacher');

    // Should be back on the main board with the grid visible
    await expect(page.getByRole('button', { name: 'Start Lesson (10 Questions)' })).toBeVisible();
    await expect(page.locator('.status-circle').first()).toBeVisible();
  });
});
