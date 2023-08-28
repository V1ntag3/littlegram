/* eslint-disable @typescript-eslint/no-var-requires */
const { Builder, By } = require('selenium-webdriver');

(async function loginTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    const email = 'teste@email.com';
    const password = 'Marcus1302@';

    await driver.get('http://localhost:3000');

    const emailField = await driver.findElement(By.id('email'));
    const passwordField = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.className('Button'));

    await emailField.sendKeys(email);
    await passwordField.sendKeys(password);

    await loginButton.click();

    await driver.wait(
      () => driver.getCurrentUrl().then(url => url === 'http://localhost:3000'),
      5000,
    );

    console.log('Teste de login bem-sucedido!');
  } catch (error) {
    console.error('Ocorreu um erro durante o teste:', error);
  }
})();
