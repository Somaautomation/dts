import { test, expect } from '@playwright/test';

test('chat widget opens and sends a message', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /open chat/i }).click();
  await expect(page.getByPlaceholder(/help you/i)).toBeVisible();
  await page.getByPlaceholder(/help you/i).fill('Hello');
  await page.keyboard.press('Enter');
  // Bot reply (fallback if no API key) should appear
  await expect(page.locator('text=Hello')).toBeVisible();
});
