import { test, expect } from '@playwright/test';

test('membership join shows step 1', async ({ page }) => {
  await page.goto('/en/membership/join');
  await expect(page.getByRole('heading', { name: /Join the Supporters Network|Membership/i })).toBeVisible();
  await expect(page.getByLabel(/Mobile Number/i)).toBeVisible();
});

test('membership join validates phone format', async ({ page }) => {
  await page.goto('/en/membership/join');
  await page.getByLabel(/Mobile Number/i).fill('12345');
  await page.getByRole('button', { name: /Send OTP/i }).click();
  await expect(page.getByText(/valid 10-digit/i)).toBeVisible();
});
