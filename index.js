// Import the Chromium browser into our scraper.
import { chromium } from "playwright";
import fs from "fs";

const config = {
  url: "https://www.printi.com.br/configuracao-revista",
  format: [
    "20 x 20 cm",
    "21 x 15 cm",
    "28 x 21 cm",
    "29,7 x 21 cm",
    "21 x 28 cm",
    "A4 (21,0 x 29,7 cm)",
    "A5 (14,8 x 21,0 cm)",
  ],
  pageNumber: [
    "4 Páginas",
    "8 Páginas",
    "16 Páginas",
    "20 Páginas",
    "24 Páginas",
    "32 Páginas",
    "36 Páginas",
    "40 Páginas",
  ],
  color: ["1x1 (p/b)", "4x4 (colorido)"],
  paperType: ["Offset 90g", "Reciclato 90g", "Couché Fosco 90g"],
  coverType: ["Couché Fosco 115g", "Couché Fosco 150g"],
};

let csv = "Páginas;Formato;Cor;Papel Miolo;Papel Capa;50;100;150\n";

const loop = async () => {
  for (const pageNumber of config.pageNumber) {
    for (const format of config.format) {
      for (const color of config.color) {
        for (const paperType of config.paperType) {
          for (const coverType of config.coverType) {
            await directions({
              format,
              pageNumber,
              color,
              paperType,
              coverType,
              url: config.url,
            });
          }
        }
      }
    }
  }
};

const directions = async ({
  url,
  format,
  pageNumber,
  color,
  paperType,
  coverType,
}) => {
  console.log(
    `Starting: ${pageNumber}, ${format}, ${color}, ${paperType}, ${coverType}`
  );

  await page.goto(url);

  await page.click("[for='config-upload']");
  await page.click('[for="custom_combination"]');
  await page.getByRole("button", { name: "Lista" }).click();
  await page.getByRole("button", { name: "Miolo" }).click();
  await page.getByText(format, { exact: true }).click();
  await page.getByText(pageNumber, { exact: true }).click();
  await page.getByText(color, { exact: true }).click();
  await page.getByText(paperType, { exact: true }).click();
  await page.getByText("Sem Extras").nth(3).click();
  await page.getByRole("button", { name: "Capa" }).click();
  await page.getByText(coverType, { exact: true }).click();

  await page.getByText("unidades").first().focus();

  const finalValues = await page.$$eval(".funnel-ccard-input", (elements) => {
    const values = {
      50: "0",
      100: "0",
      150: "0",
    };

    elements.forEach((element) => {
      const value = element.value;
      const price = element.parentElement.innerText
        .split("\n")
        .filter(Boolean)
        .find((item) => item.includes("R$"))
        ?.replace("R$ ", "");

      values[value] = price;
    });

    return values;
  });

  const line = `${pageNumber};${format};${color};${paperType};${coverType};${finalValues[50]};${finalValues[100]};${finalValues[150]}\n`;
  console.log(line);

  csv += line;
  fs.writeFileSync("output.csv", csv);
};

//////
// START
//////

console.log("Launching Playwright");

const browser = await chromium.launch({
  headless: true,
  timeout: 2000,
});

const page = await browser.newPage();

console.log("Starting loop");

await loop();

console.log("Loop finished");

await page.waitForTimeout(5000);

await browser.close();

console.log("Printing file");

fs.writeFileSync("output.csv", csv);

console.log("Script finished");
