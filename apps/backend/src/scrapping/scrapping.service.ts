import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

export interface ScrapedData {
  title: string;
  code: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  totalPrice: string;
}

export interface ScrapedResponse {
  supermarketName: string;
  total: string;
  key: string;
  date: string;

  products: ScrapedData[];
}

@Injectable()
export class ScrappingService {
  async scrapeNFC(url: string): Promise<ScrapedResponse> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.setViewport({ width: 1080, height: 1024 });

    const data = await page.evaluate(() => {
      const tbody = document.querySelector('tbody');

      if (!tbody) return [];

      const rows = tbody.querySelectorAll('tr');

      return Array.from(rows)
        .map((row) => {
          const columns = row.querySelectorAll('td');

          const firstColumn = columns[0];
          const secondColumn = columns[1];

          if (!firstColumn || !secondColumn) return null;

          const getCleanText = (
            element: HTMLTableCellElement,
            selector: string,
            remove: string[] = [],
          ) => {
            const el = element.querySelector(selector);

            if (!el) return null;

            let text = el.textContent;
            remove.forEach((str) => {
              text = text.replace(str, '');
            });
            return text.trim();
          };

          const title = getCleanText(firstColumn, '.txtTit');
          const code = getCleanText(firstColumn, '.RCod', ['(Código:', ')']);
          const quantity = getCleanText(firstColumn, '.Rqtd', ['Qtde.:']);
          const unit = getCleanText(firstColumn, '.RUN', ['UN:']);
          const unitPrice = getCleanText(firstColumn, '.RvlUnit', [
            'Vl. Unit.:',
          ]);
          const totalPrice = getCleanText(secondColumn, '.valor');

          return title
            ? { title, code, quantity, unit, unitPrice, totalPrice }
            : null;
        })
        .filter((item) => item !== null);
    });

    const info = await page.evaluate(() => {
      const total = document.querySelector('.txtMax')?.textContent;
      const key = document.querySelector('.chave')?.textContent;
      const supermarketName = document.querySelector('.txtTopo')?.textContent;

      const dateText = document.querySelector(
        'ul[data-role="listview"] li',
      )?.textContent;
      const dateMatch = dateText?.match(
        /Emissão:\s(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/,
      );
      const date = dateMatch ? dateMatch[1] : null;

      return { supermarketName, total, key, date };
    });

    await browser.close();

    return { ...info, products: data };
  }
}
