const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const { title } = require("process");

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser("chrome").build();
});

afterAll(async () => {
  await driver.quit();
});

test('sollte die neusten News von "Books to Scrape" scrapen', async () => {
  await driver.get("https://books.toscrape.com/");

  await driver.wait(until.elementsLocated(By.css(".product_pod")), 10000);

  const articles = await driver.findElements(By.css(".product_pod"));

  const firstArticle = articles[0];
  await firstArticle.click();

  //   let titleElement = await driver.wait(
  //     until.elementLocated(
  //       By.xpath(
  //         "/html/body/div/div/div/div/section/div[2]/ol/li[1]/article/h3/a"
  //       )
  //     ),
  //     5000
  //);
  let allTitles = [];
  for (let article of articles) {
    let titleElement = await article.findElement(By.css("h3 a"));
    let title = await titleElement.getAttribute("title");
    let priceElement = await article.findElement(By.css(".price_color"));
    let price = await priceElement.getText();
    let availabilityElement = await article.findElement(
      By.css(".instock")
    );
    let availability = await availabilityElement.getText();
    allTitles.push({ title, price, availability });
    fs.writeFileSync("news.json", JSON.stringify(allTitles, null, 2));
  }

  //   let title = await titleElement.getText();

  //   let link = await driver.getCurrentUrl();

  //   const bookData = { title, link };
  //   fs.writeFileSync("booktoscrape.json", JSON.stringify([bookData], null, 2));
});
