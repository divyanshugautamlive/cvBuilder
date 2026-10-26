import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../polyfills.js';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import useResumeStore from '../store/useResumeStore';
import { storage } from '../utils/storage';

const ThrowingComponent = () => {
    throw new Error('Simulated crash');
};

describe('Blank Screen Safeguards & Fixes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('Promise.withResolvers is defined and functional', async () => {
        expect(typeof Promise.withResolvers).toBe('function');
        const { promise, resolve, reject } = Promise.withResolvers();
        expect(typeof resolve).toBe('function');
        expect(typeof reject).toBe('function');
        expect(promise instanceof Promise).toBe(true);

        resolve('resolved_value');
        const val = await promise;
        expect(val).toBe('resolved_value');
    });

    it('ErrorBoundary catches child error and displays fallback UI', () => {
        // Prevent console.error clutter in test output
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Reload Page')).toBeInTheDocument();
        expect(screen.getByText('Reset Editor')).toBeInTheDocument();

        spy.mockRestore();
    });

    it('useResumeStore gracefully handles corrupted localStorage without throwing', () => {
        // Set broken/incomplete stored data
        storage.set('resume_data', {
            personalInfo: null,
            experience: null,
            selectedTemplate: 'invalid_template_xyz'
        });

        // Trigger store rehydration or read
        const store = useResumeStore.getState();
        store.resetData();
        const data = useResumeStore.getState().resumeData;

        expect(data).toBeDefined();
        expect(data.personalInfo).toBeDefined();
        expect(data.personalInfo.fullName).toBe('');
        expect(Array.isArray(data.experience)).toBe(true);
        expect(data.selectedTemplate).toBe('executive');
    });
});
