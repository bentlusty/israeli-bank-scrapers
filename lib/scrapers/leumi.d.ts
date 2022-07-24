import { BaseScraperWithBrowser } from './base-scraper-with-browser';
import { ScaperScrapingResult } from './base-scraper';
declare class LeumiScraper extends BaseScraperWithBrowser {
    getLoginOptions(credentials: Record<string, string>): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        checkReadiness: () => Promise<void>;
        postAction: () => Promise<void>;
        possibleResults: import("./base-scraper-with-browser").PossibleLoginResults;
    };
    fetchData(): Promise<ScaperScrapingResult>;
}
export default LeumiScraper;
