const puppeteer = require("puppeteer");
const fs = require("fs");
const { generatehtml } = require("./generateHtml");
const { generateLedgerHtml } = require("./generateLedgerHtml");
const generateStatementPdfHtml = require("./generateStatementPdfHtml");

const generateStatementPdfUrl = async (bills, user, startDate, endDate) => {
  console.log("Create a browser instance");
  const browser = await puppeteer.launch();

  // Create a new page
  console.log("Create a new page");
  const page = await browser.newPage();
  console.log("creating path");
  //Get HTML content from HTML file
  const path = require("path");
  //   console.log(__dirname)
  // const htmlPath = path.join(__dirname, 'sample.html');
  // console.log(htmlPath)

  //   const html = fs.readFileSync(htmlPath, 'utf-8');
  const html = generateStatementPdfHtml(user, bills, startDate, endDate);
  console.log("final Call to done");
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  console.log("A");
  // To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");
  console.log("about to done");
  const pdf = await page.pdf({
    margin: { top: "50px", right: "50px", bottom: "50px", left: "50px" },
    printBackground: true,
    format: "A4",
  });
  console.log("pdf created success");
  // Close the browser instance
  await browser.close();
  const pdfBlob = new Blob([pdf], { type: "application/pdf" });
  console.log("pdfBlod", pdfBlob);
  // Create a URL for the Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);
  console.log("create url", pdfUrl);
  return pdf;
};

module.exports = generateStatementPdfUrl;
