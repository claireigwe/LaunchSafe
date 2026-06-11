const { chromium } = require('playwright');

(async () => {
  console.log('Starting browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Try to bypass business check by setting local storage
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    localStorage.setItem('launchsafe-active-business', 'test-business');
    localStorage.setItem('launchsafe-business-data', JSON.stringify({ name: 'Test Business', industryId: 'tech' }));
    localStorage.setItem('launchsafe-tasks-test-business', JSON.stringify([
      { id: '1', title: 'Register Company', status: 'completed', priority: 'high', dueDate: new Date(Date.now() - 86400000).toISOString() },
      { id: '2', title: 'File Taxes', status: 'pending', priority: 'medium', dueDate: new Date(Date.now() + 86400000 * 5).toISOString() }
    ]));
  });

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  
  // Wait a bit extra for client-side rendering/animations
  await page.waitForTimeout(3000);

  console.log('Taking first screenshot...');
  await page.screenshot({ path: 'public/images/landing/dashboard-1.png' });

  console.log('Taking second screenshot (cropped)...');
  await page.screenshot({ path: 'public/images/landing/dashboard-3.png', clip: { x: 0, y: 0, width: 800, height: 600 } });

  await browser.close();
  console.log('Done!');
})();
