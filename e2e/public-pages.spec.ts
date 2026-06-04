import { test, expect } from '@playwright/test';

const publicPages = ['/en/about', '/en/achievements', '/en/grievances', '/en/teachers', '/en/events', '/en/news', '/en/volunteer', '/en/contact', '/en/auth/login'];

for (const path of publicPages) {
  test(`public page renders: ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}
