import { TransactionsAccount } from '../transactions';
import { ScraperCredentials, ScraperErrorTypes } from './base-scraper';
import { BaseScraperWithBrowser, PossibleLoginResults } from './base-scraper-with-browser';
declare class MizrahiScraper extends BaseScraperWithBrowser {
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
        errorType?: undefined;
        errorMessage?: undefined;
    } | {
        success: boolean;
        errorType: ScraperErrorTypes;
        errorMessage: any;
        accounts?: undefined;
    }>;
    private fetchAccount;
}
export default MizrahiScraper;
