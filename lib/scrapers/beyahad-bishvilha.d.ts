import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
import { ScraperCredentials } from './base-scraper';
import { Transaction } from '../transactions';
declare class BeyahadBishvilhaScraper extends BaseScraperWithBrowser {
    protected getViewPort(): {
        width: number;
        height: number;
    };
    getLoginOptions(credentials: ScraperCredentials): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: () => Promise<void>;
        possibleResults: PossibleLoginResults;
    };
    fetchData(): Promise<{
        success: boolean;
        accounts: {
            accountNumber: any;
            balance: number;
            txns: Transaction[];
        }[];
    }>;
}
export default BeyahadBishvilhaScraper;
