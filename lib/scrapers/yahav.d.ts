import { TransactionsAccount } from '../transactions';
import { ScraperCredentials } from './base-scraper';
import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
declare class YahavScraper extends BaseScraperWithBrowser {
    getLoginOptions(credentials: ScraperCredentials): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        checkReadiness: () => Promise<void>;
        postAction: () => Promise<void>;
        possibleResults: PossibleLoginResults;
    };
    fetchData(): Promise<{
        success: boolean;
        accounts: TransactionsAccount[];
    }>;
}
export default YahavScraper;
