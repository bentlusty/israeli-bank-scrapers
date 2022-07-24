import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
import { TransactionsAccount } from '../transactions';
import { ScraperCredentials } from './base-scraper';
declare class HapoalimScraper extends BaseScraperWithBrowser {
    get baseUrl(): string;
    getLoginOptions(credentials: ScraperCredentials): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        postAction: () => Promise<void>;
        possibleResults: PossibleLoginResults;
    };
    fetchData(): Promise<{
        success: boolean;
        accounts: TransactionsAccount[];
    }>;
}
export default HapoalimScraper;
