import { BaseScraperWithBrowser } from './base-scraper-with-browser';
import { Transaction } from '../transactions';
import { ScraperOptions, ScaperScrapingResult, ScraperCredentials } from './base-scraper';
declare class IsracardAmexBaseScraper extends BaseScraperWithBrowser {
    private baseUrl;
    private companyCode;
    private servicesUrl;
    constructor(options: ScraperOptions, baseUrl: string, companyCode: string);
    login(credentials: ScraperCredentials): Promise<ScaperScrapingResult>;
    fetchData(): Promise<{
        success: boolean;
        accounts: {
            accountNumber: string;
            txns: Transaction[];
        }[];
    }>;
}
export default IsracardAmexBaseScraper;
