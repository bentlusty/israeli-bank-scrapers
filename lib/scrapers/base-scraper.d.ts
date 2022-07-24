import { Browser, Page } from 'puppeteer';
import { TransactionsAccount } from '../transactions';
import { CompanyTypes } from '../definitions';
export declare enum ScraperErrorTypes {
    InvalidPassword = "INVALID_PASSWORD",
    ChangePassword = "CHANGE_PASSWORD",
    Timeout = "TIMEOUT",
    AccountBlocked = "ACCOUNT_BLOCKED",
    Generic = "GENERIC",
    General = "GENERAL_ERROR"
}
export interface ScaperLoginResult {
    success: boolean;
    errorType?: ScraperErrorTypes;
    errorMessage?: string;
}
export interface FutureDebit {
    amount: number;
    amountCurrency: string;
    chargeDate?: string;
    bankAccountNumber?: string;
}
export interface ScaperScrapingResult {
    success: boolean;
    accounts?: TransactionsAccount[];
    futureDebits?: FutureDebit[];
    errorType?: ScraperErrorTypes;
    errorMessage?: string;
}
export declare type ScraperCredentials = Record<string, string>;
export interface ScraperOptions {
    /**
     * The company you want to scrape
     */
    companyId: CompanyTypes;
    /**
     * include more debug info about in the output
     */
    verbose?: boolean;
    startDate: Date;
    endDate?: Date;
    /**
     * shows the browser while scraping, good for debugging (default false)
     */
    showBrowser?: boolean;
    /**
     * scrape transactions to be processed X months in the future
     */
    futureMonthsToScrape?: number;
    /**
     * option from init puppeteer browser instance outside the libary scope. you can get
     * browser diretly from puppeteer via `puppeteer.launch()`
     */
    browser?: any;
    /**
     * provide a patch to local chromium to be used by puppeteer. Relevant when using
     * `israeli-bank-scrapers-core` library
     */
    executablePath?: string;
    /**
     * if set to true, all installment transactions will be combine into the first one
     */
    combineInstallments?: boolean;
    /**
     * additional arguments to pass to the browser instance. The list of flags can be found in
     *
     * https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options
     * https://peter.sh/experiments/chromium-command-line-switches/
     */
    args?: string[];
    /**
     * adjust the browser instance before it is being used
     *
     * @param browser
     */
    prepareBrowser?: (browser: Browser) => Promise<void>;
    /**
     * adjust the page instance before it is being used.
     *
     * @param page
     */
    preparePage?: (page: Page) => Promise<void>;
    /**
     * if set, store a screenshot if failed to scrape. Used for debug purposes
     */
    storeFailureScreenShotPath?: string;
}
export declare enum ScaperProgressTypes {
    Initializing = "INITIALIZING",
    StartScraping = "START_SCRAPING",
    LoggingIn = "LOGGING_IN",
    LoginSuccess = "LOGIN_SUCCESS",
    LoginFailed = "LOGIN_FAILED",
    ChangePassword = "CHANGE_PASSWORD",
    EndScraping = "END_SCRAPING",
    Terminating = "TERMINATING"
}
export declare class BaseScraper {
    options: ScraperOptions;
    private eventEmitter;
    constructor(options: ScraperOptions);
    initialize(): Promise<void>;
    scrape(credentials: ScraperCredentials): Promise<ScaperScrapingResult>;
    login(_credentials: Record<string, string>): Promise<ScaperLoginResult>;
    fetchData(): Promise<ScaperScrapingResult>;
    terminate(_success: boolean): Promise<void>;
    emitProgress(type: ScaperProgressTypes): void;
    emit(eventName: string, payload: Record<string, any>): void;
    onProgress(func: (...args: any[]) => void): void;
}
