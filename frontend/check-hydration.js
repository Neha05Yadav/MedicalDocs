const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  // Set auth cookies/localStorage if needed, but we can just visit the page. Wait, it redirects to / if no token.
  await page.goto('http://localhost:3000/laboratory/overview');
  
  // Need to set localstorage to authenticate
  await page.evaluate(() => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Lab Admin' }));
  });
  await page.goto('http://localhost:3000/laboratory/overview', { waitUntil: 'networkidle2' });
  
  console.log('Errors:', errors);
  await browser.close();
})();
