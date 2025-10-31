
import { test, expect } from '@playwright/test';

test('load app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Fraction Practice')).toBeVisible();
});
