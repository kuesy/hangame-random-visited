const webdriver = require('selenium-webdriver');
const fs = require('fs');
const { promisify } = require('util');
const { Builder, By, until } = webdriver;
const zalenium_hd = process.env.ZALENIUM_HD;

(async () => {
    // set webdriver
    const driver = await new webdriver.Builder().usingServer(`http://${zalenium_hd}/wd/hub`)
      .withCapabilities(webdriver.Capabilities.chrome()).build();
    
    // get url
    await driver.get('https://www.youtube.com/');
    
    // 検索ボックスが表示されるまで待つ
    await driver.wait(until.elementLocated(By.id('search')), 10000);

    let base64 = await driver.takeScreenshot();
    let buffer = Buffer.from(base64, 'base64');

    // bufferを保存
    await promisify(fs.writeFile)('screenshot.jpg', buffer);

    // exit
    driver.quit();
})();
