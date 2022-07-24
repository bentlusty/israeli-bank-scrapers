import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
import { Transaction } from '../transactions';
import { ScraperCredentials } from './base-scraper';
declare class MaxScraper extends BaseScraperWithBrowser {
    getLoginOptions(credentials: ScraperCredentials): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        preAction: () => Promise<void>;
        checkReadiness: () => Promise<void>;
        postAction: () => Promise<void>;
        possibleResults: PossibleLoginResults;
    };
    fetchData(): Promise<{
        success: boolean;
        accounts: {
            accountNumber: string;
            txns: Transaction[];
        }[];
    }>;
}
export default MaxScraper;
