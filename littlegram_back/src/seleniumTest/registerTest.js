/* eslint-disable @typescript-eslint/no-var-requires */
const { Builder, By } = require('selenium-webdriver');
const path = require('path');

(async () => {
  const dirname = __dirname;

  const username = 'nome-de-usuario-teste';
  const email = 'teste@email.com';

  const imageName = 'image.jpeg';

  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000/register');

    await driver
      .findElement(By.id('imageInput'))
      .sendKeys(path.join(dirname, 'images', imageName));
    await driver.findElement(By.id('name')).sendKeys('Nome Teste');
    await driver.findElement(By.id('lastName')).sendKeys('Sobrenome Teste');
    await driver.findElement(By.id('email')).sendKeys(email);
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys('Marcus1302@');
    await driver.findElement(By.id('confirmPassword')).sendKeys('Marcus1302@');

    const element = driver.findElement(By.id('advance'));
    driver.executeScript('arguments[0].scrollIntoView(true);', element);
    driver.sleep(500);
    driver.executeScript('arguments[0].click();', element);

    await driver.sleep(2000);

    console.log('Teste de registro bem-sucedido!');
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
})();
