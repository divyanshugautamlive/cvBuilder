/**
 * Window Storage Wrapper
 * Implements a persistent storage interface as per requirements.
 * Uses localStorage under the hood but exposes a cleaner async-like API.
 */
export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from storage', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to storage', e);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from storage', e);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing storage', e);
            return false;
        }
    }
};

// Polyfill window.storage if it doesn't exist (it doesn't in browsers)
if (typeof window !== 'undefined') {
    window.storage = storage;
}
