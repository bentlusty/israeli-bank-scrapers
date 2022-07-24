import { Frame, NavigationOptions, Page } from 'puppeteer';
export declare function waitForNavigation(pageOrFrame: Page | Frame, options?: NavigationOptions): Promise<void>;
export declare function waitForNavigationAndDomLoad(page: Page): Promise<void>;
export declare function getCurrentUrl(pageOrFrame: Page | Frame, clientSide?: boolean): Promise<string>;
export declare function waitForRedirect(pageOrFrame: Page | Frame, timeout?: number, clientSide?: boolean, ignoreList?: string[]): Promise<void>;
export declare function waitForUrl(pageOrFrame: Page | Frame, url: string | RegExp, timeout?: number, clientSide?: boolean): Promise<void>;
