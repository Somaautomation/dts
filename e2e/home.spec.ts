import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero and primary CTAs (English)', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /join movement/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /volunteer/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /grievance|public issue/i })).toBeVisible();
  });

  test('switches to Kannada', async ({ page }) => {
    await page.goto('/kn');
    await expect(page).toHaveURL(/\/kn/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'kn');
  });

  test('navigation links are visible', async ({ page, isMobile }) => {
    await page.goto('/en');
    if (!isMobile) {
      await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Achievements' })).toBeVisible();
    }
  });
});
