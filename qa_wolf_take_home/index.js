// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const startTime = performance.now();
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  let articlesArray = [];

  // Extract Articles
  while (articlesArray.length < 100 ){
    const newArticlesArray = await page.$$eval('.athing', nodes => nodes.map(node => ({
      title: node.querySelector('.titleline a')?.innerText.trim(),
      age: node.nextElementSibling.querySelector('.age')?.innerText.trim()
    })));

    articlesArray = articlesArray.concat(newArticlesArray);

    if (articlesArray.length < 100){
      console.log(`Loaded ${articlesArray.length} articles, clicking more button.`);
      const moreButton = await page.$('a.morelink');
      await moreButton.click();
    }

    else {
      console.log('Extracted 100 articles.');
      break;
    }
  }
  
  articlesArray = articlesArray.slice(0,100);
  
  //Validate articles in order from newest -> oldest
  const sortedArray = [...articlesArray].sort((a, b) => new Date(b.time) - new Date(a.time));
  const isSorted = JSON.stringify(articlesArray) === JSON.stringify(sortedArray);
  console.log(isSorted ? 'Articles are sorted newest to oldest!' : 'Articles are NOT sorted.');
  articlesArray.forEach((article, index) => {console.log(`${index + 1}. ${article.title} - ${article.age}`);});

  //Print Performance time for reference
  const endTime = performance.now();
  console.log(`Total runtime: ${(endTime - startTime).toFixed(2)} milliseconds`);
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();

