import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer-core';

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
export class ScrappingService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser | null = null;

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrapeNFC(url: string): Promise<ScrapedResponse> {
    if (!this.browser) {
      throw new Error('Puppeteer não inicializado');
    }

    const page = await this.browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.setViewport({ width: 1080, height: 1024 });

      const data = await page.evaluate(() => {
        const tbody = document.querySelector('tbody');
        if (!tbody) return [];

        const rows = tbody.querySelectorAll('tr');

        return Array.from(rows)
          .map((row) => {
            const columns = row.querySelectorAll('td');
            if (columns.length < 2) return null;

            const firstColumn = columns[0];
            const secondColumn = columns[1];

            const getCleanText = (element: HTMLTableCellElement, selector: string, remove: string[] = []) => {
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
            const unitPrice = getCleanText(firstColumn, '.RvlUnit', ['Vl. Unit.:']);
            const totalPrice = getCleanText(secondColumn, '.valor');

            return title ? { title, code, quantity, unit, unitPrice, totalPrice } : null;
          })
          .filter((item) => item !== null);
      });

      const info = await page.evaluate(() => {
        const total = document.querySelector('.txtMax')?.textContent;
        const key = document.querySelector('.chave')?.textContent;
        const supermarketName = document.querySelector('.txtTopo')?.textContent;

        const dateText = document.querySelector('ul[data-role="listview"] li')?.textContent;
        const dateMatch = dateText?.match(/Emissão:\s(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/);
        const date = dateMatch ? dateMatch[1] : null;

        return { supermarketName, total, key, date };
      });

      return { ...info, products: data };
    } catch (error) {
      console.error('Erro ao processar scraping:', error);
      throw new Error('Erro no scraping da página');
    } finally {
      await page.close();
    }
  }
}
