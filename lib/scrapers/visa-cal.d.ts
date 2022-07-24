import { BaseScraperWithBrowser } from './base-scraper-with-browser';
import { ScaperScrapingResult } from './base-scraper';
declare class VisaCalScraper extends BaseScraperWithBrowser {
    openLoginPopup: () => Promise<never>;
    getLoginOptions(credentials: Record<string, string>): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        possibleResults: import("./base-scraper-with-browser").PossibleLoginResults;
        checkReadiness: () => Promise<void>;
        preAction: () => Promise<never>;
        userAgent: string;
    };
    fetchData(): Promise<ScaperScrapingResult>;
}
export default VisaCalScraper;
