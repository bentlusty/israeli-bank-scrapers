import { Browser, Frame, Page } from 'puppeteer';
import { ScraperErrorTypes, BaseScraper, ScaperScrapingResult, ScraperCredentials } from './base-scraper';
declare enum LoginBaseResults {
    Success = "SUCCESS",
    UnknownError = "UNKNOWN_ERROR"
}
export declare const LoginResults: {
    Success: LoginBaseResults.Success;
    UnknownError: LoginBaseResults.UnknownError;
    InvalidPassword: ScraperErrorTypes.InvalidPassword;
    ChangePassword: ScraperErrorTypes.ChangePassword;
    AccountBlocked: ScraperErrorTypes.AccountBlocked;
};
export declare type LoginResults = Exclude<ScraperErrorTypes, ScraperErrorTypes.Timeout | ScraperErrorTypes.Generic | ScraperErrorTypes.General> | LoginBaseResults;
export declare type PossibleLoginResults = {
    [key in LoginResults]?: (string | RegExp | ((options?: {
        page?: Page;
    }) => Promise<boolean>))[];
};
export interface LoginOptions {
    loginUrl: string;
    checkReadiness?: () => Promise<void>;
    fields: {
        selector: string;
        value: string;
    }[];
    submitButtonSelector: string | (() => Promise<void>);
    preAction?: () => Promise<Frame | void>;
    postAction?: () => Promise<void>;
    possibleResults: PossibleLoginResults;
    userAgent?: string;
}
declare class BaseScraperWithBrowser extends BaseScraper {
    protected browser: Browser;
    protected page: Page;
    protected getViewPort(): {
        width: number;
        height: number;
    };
    initialize(): Promise<void>;
    navigateTo(url: string, page?: Page, timeout?: number): Promise<void>;
    getLoginOptions(_credentials: ScraperCredentials): LoginOptions;
    fillInputs(pageOrFrame: Page | Frame, fields: {
        selector: string;
        value: string;
    }[]): Promise<void>;
    login(credentials: Record<string, string>): Promise<ScaperScrapingResult>;
    terminate(_success: boolean): Promise<void>;
}
export { BaseScraperWithBrowser };
