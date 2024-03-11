const puppeteer = require("puppeteer");
const fs = require("fs");
const { generatehtml } = require("./generateHtml");

const generatePdf = async (bill, user) => {
  // Create a browser instance
  const browser = await puppeteer.launch({ headless: "new" });

  // Create a new page
  const page = await browser.newPage();

  //Get HTML content from HTML file
  const path = require("path");
  //   console.log(__dirname)
  // const htmlPath = path.join(__dirname, 'sample.html');
  // console.log(htmlPath)

  //   const html = fs.readFileSync(htmlPath, 'utf-8');
  const html = generatehtml(bill, user);

  await page.setContent(html, { waitUntil: "domcontentloaded" });
  console.log("A");
  // To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");

  const pdf = await page.pdf({
    margin: { top: "50px", right: "50px", bottom: "50px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  // Close the browser instance
  await browser.close();
  return pdf;
};

module.exports = generatePdf;
