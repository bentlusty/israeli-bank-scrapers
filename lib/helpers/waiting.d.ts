export declare class TimeoutError extends Error {
}
export declare function waitUntil(asyncTest: () => Promise<any>, description?: string, timeout?: number, interval?: number): Promise<any>;
