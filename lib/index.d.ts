export { default as createScraper } from './scrapers/factory';
export { SCRAPERS, CompanyTypes } from './definitions';
export { ScraperOptions } from './scrapers/base-scraper';
export declare function getPuppeteerConfig(): {
    __comment: string;
    chromiumRevision: string;
};
