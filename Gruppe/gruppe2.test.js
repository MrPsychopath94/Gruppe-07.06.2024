const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser("chrome").build();
}, 30000); // Timeout für beforeAll auf 30 Sekunden erhöhen

afterAll(async () => {
  await driver.quit();
}, 30000); // Timeout für afterAll auf 30 Sekunden erhöhen

async function scrapeCategory(categoryUrl, categoryName) {
  await driver.get(categoryUrl);

  await driver.wait(until.elementsLocated(By.css(".product_pod")), 10000);

  const books = await driver.findElements(By.css(".product_pod"));
  let allBooks = [];
  
  for (let book of books) {
    let titleElement = await book.findElement(By.css("h3 a"));
    let title = await titleElement.getAttribute("title");
    let priceElement = await book.findElement(By.css(".price_color"));
    let price = await priceElement.getText();
    let availabilityElement = await book.findElement(By.css(".instock"));
    let availability = await availabilityElement.getText();
    allBooks.push({ title, price, availability });
  }

  fs.writeFileSync(`${categoryName}.json`, JSON.stringify(allBooks, null, 2));
}

test('sollte Bücher aus drei Kategorien von "Books to Scrape" scrapen', async () => {
    
  const baseUrl = "https://books.toscrape.com/catalogue/category/books/";

  
  const categories = {
    travel: "travel_2/index.html",
    mystery: "mystery_3/index.html",
    historicalFiction: "historical-fiction_4/index.html",
  };

  for (const [categoryName, categoryUrl] of Object.entries(categories)) {
    await scrapeCategory(baseUrl + categoryUrl, categoryName);
  }
}, 30000); 
