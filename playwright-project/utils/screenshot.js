const fs = require('fs');
const path = require('path');

async function attachScreenshot(page, testInfo, prefix) {
  const screenshotPath = path.join('test-results', `${prefix}-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const buffer = await fs.promises.readFile(screenshotPath);
  await testInfo.attach(prefix, { body: buffer, contentType: 'image/png' });
  return screenshotPath;
}

module.exports = { attachScreenshot };