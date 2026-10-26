/**
 * Runtime polyfills for browser compatibility
 */

// Polyfill Promise.withResolvers for Safari < 17.4, Chrome < 119, Firefox < 121, and in-app webviews
if (typeof Promise.withResolvers === 'undefined') {
    Promise.withResolvers = function () {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}
