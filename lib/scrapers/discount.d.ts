import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
import { ScaperScrapingResult, ScraperCredentials } from './base-scraper';
declare class DiscountScraper extends BaseScraperWithBrowser {
    getLoginOptions(credentials: ScraperCredentials): {
        loginUrl: string;
        checkReadiness: () => Promise<void>;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        postAction: () => Promise<void>;
        possibleResults: PossibleLoginResults;
    };
    fetchData(): Promise<ScaperScrapingResult>;
}
export default DiscountScraper;
