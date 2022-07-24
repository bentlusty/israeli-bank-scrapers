import { Page } from 'puppeteer';
import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
import { TransactionsAccount } from '../transactions';
import { ScraperCredentials } from './base-scraper';
export declare function getPossibleLoginResults(): PossibleLoginResults;
export declare function createLoginFields(credentials: ScraperCredentials): {
    selector: string;
    value: string;
}[];
export declare function waitForPostLogin(page: Page): Promise<void>;
declare class BeinleumiGroupBaseScraper extends BaseScraperWithBrowser {
    BASE_URL: string;
    LOGIN_URL: string;
    TRANSACTIONS_URL: string;
    getLoginOptions(credentials: ScraperCredentials): {
        loginUrl: string;
        fields: {
            selector: string;
            value: string;
        }[];
        submitButtonSelector: string;
        postAction: () => Promise<void>;
        possibleResults: PossibleLoginResults;
        preAction: () => Promise<void>;
    };
    fetchData(): Promise<{
        success: boolean;
        accounts: TransactionsAccount[];
    }>;
}
export default BeinleumiGroupBaseScraper;
