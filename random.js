const webdriver = require('selenium-webdriver');
const fs = require('fs');
const { promisify } = require('util');
const { Builder, By, until } = webdriver;
const zalenium_hd = process.env.ZALENIUM_HD;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const scmip = process.env.SCMIP;
const login = process.env.LOGIN;

async function visitedRandom (driver) {
  try {
    while(true) {
      // random API
      await driver.get('http://mypage.hangame.co.jp/stamp/randomvisit.nhn');
      await driver.wait(until.elementLocated(By.id('_floatingArea')), 10000);

      // move profile page
      await driver.findElement(By.css('#menu01 > a:nth-child(1)')).click();
      await driver.wait(until.elementLocated(By.id('HGfooter')), 10000);

      /***** debug
      await driver.wait(until.elementLocated(By.id('srch-mypage')), 10000);
      await driver.executeScript("document.getElementById('srch-mypage').setAttribute('value', '<<user name>>')");
      await driver.findElement(By.className("srchBtn")).click();
      await driver.wait(until.elementLocated(By.id('HGfooter')), 10000);
      ******/

      // judge pure or cool
      const cool = await isElementPresent(driver, By.id("avatarPanel"));
      if (cool) {
        await driver.wait(until.elementLocated(By.css('#avatarPanel > ul > li.agd > a')), 10000);
        await driver.findElement(By.css('#avatarPanel > ul > li.agd > a')).click();
      } else {
        await driver.wait(until.elementLocated(By.css('#btn_ava_good > a')), 10000);
        await driver.findElement(By.css('#btn_ava_good > a')).click();
      }
    }
  } catch (e){
    console.log(e);
    // if alert open error occured, accept alert and execute
    if (e.name === "UnexpectedAlertOpenError") {
      await driver.switchTo().alert().accept();
      await visitedRandom(driver);
    } else if (e.name === "NoSuchElementError" || e.name === "TimeoutError") {
      await visitedRandom(driver);
    } else {
      driver.quit();
    }
  }
};

async function isElementPresent(driver, by){
    const elements = await driver.findElements(by);
    return elements.length !== 0;
}

(async () => {
  // set webdriver
  const driver = await new webdriver.Builder().usingServer(`http://${zalenium_hd}/wd/hub`)
    .withCapabilities(webdriver.Capabilities.chrome()).build();
  // get url
  await driver.get('http://www.hangame.co.jp');

  // login execution
  /****** id and password
  await driver.wait(until.elementLocated(By.id('strmemberid')), 10000);
  await driver.executeScript(`document.getElementById('strmemberid').setAttribute('value', '${username}')`);
  await driver.wait(until.elementLocated(By.id('strpassword')), 10000);
  await driver.executeScript(`document.getElementById('strpassword').setAttribute('value', '${password}')`);
  await driver.findElement(By.id("loginBtn")).click();
  *******/

  // issue cookie
  await driver.manage().addCookie({
   name: 'scmip',
   value: scmip,
   domain: '.hangame.co.jp',
   path: '/',
  });
  await driver.manage().addCookie({
   name: 'login',
   value: login,
   domain: '.hangame.co.jp',
   path: '/',
  });

  // execute app
  await visitedRandom(driver);
})();
