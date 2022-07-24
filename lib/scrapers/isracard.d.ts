import IsracardAmexBaseScraper from './base-isracard-amex';
import { ScraperOptions } from './base-scraper';
declare class IsracardScraper extends IsracardAmexBaseScraper {
    constructor(options: ScraperOptions);
}
export default IsracardScraper;
