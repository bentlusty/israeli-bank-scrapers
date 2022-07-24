import { Page } from 'puppeteer';
export declare function fetchGet<TResult>(url: string, extraHeaders: Record<string, any>): Promise<TResult>;
export declare function fetchPost(url: string, data: Record<string, any>, extraHeaders: Record<string, any>): Promise<any>;
export declare function fetchGetWithinPage<TResult>(page: Page, url: string): Promise<TResult | null>;
export declare function fetchPostWithinPage<TResult>(page: Page, url: string, data: Record<string, any>, extraHeaders?: Record<string, any>): Promise<TResult | null>;
