import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.print
window.print = vi.fn();

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});

// Mock storage wrapper for localStorage
import { storage } from './utils/storage';
window.storage = storage;
