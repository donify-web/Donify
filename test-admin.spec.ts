import { test, expect } from '@playwright/test';

test('capture admin panel error', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      logs.push(`[ERROR] ${msg.text()}`);
    } else {
      logs.push(`[LOG] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    logs.push(`[PAGE ERROR] ${error.message}`);
  });

  await page.goto('http://localhost:5173/#/admin');
  
  // Wait to see if error occurs
  await page.waitForTimeout(3000);
  
  console.log('--- CAPTURED LOGS ---');
  console.log(logs.join('\n'));
});
