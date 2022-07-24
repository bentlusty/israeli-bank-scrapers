import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
import { Transaction } from '../transactions';
import { ScraperCredentials } from './base-scraper';
declare class OtsarHahayalScraper extends BaseScraperWithBrowser {
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
        accounts: {
            accountNumber: string;
            summary: {
                balance: number;
                creditLimit: number;
                creditUtilization: number;
                balanceCurrency: string;
            };
            txns: Transaction[];
        }[];
    }>;
}
export default OtsarHahayalScraper;
