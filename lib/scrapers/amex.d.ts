import IsracardAmexBaseScraper from './base-isracard-amex';
import { ScraperOptions } from './base-scraper';
declare class AmexScraper extends IsracardAmexBaseScraper {
    constructor(options: ScraperOptions);
}
export default AmexScraper;
