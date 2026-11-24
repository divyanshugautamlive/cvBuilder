import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '../polyfills.js';
import ExperienceStep from '../components/features/form/ExperienceStep';
import EducationStep from '../components/features/form/EducationStep';
import useResumeStore from '../store/useResumeStore';

describe('ExperienceStep & EducationStep "Currently Working/Studying Here" Checkbox', () => {
    beforeEach(() => {
        useResumeStore.getState().resetData();
    });

    describe('ExperienceStep', () => {
        it('allows selecting "I currently work here" after setting start date', () => {
            render(<ExperienceStep />);

            // Add a position
            const addBtn = screen.getByRole('button', { name: /Add Position/i });
            fireEvent.click(addBtn);

            const expId = useResumeStore.getState().resumeData.experience[0].id;
            expect(expId).toBeDefined();

            // Find checkbox
            const checkbox = screen.getByLabelText(/I am currently working here|I currently work here/i);
            expect(checkbox).not.toBeChecked();

            // Set Start Date via store or date picker
            useResumeStore.getState().updateSection('experience', [{
                id: expId,
                company: 'Acme Corp',
                title: 'Software Engineer',
                startDate: '2022',
                endDate: '',
                current: false,
                description: ''
            }]);

            // Re-check checkbox after date is set
            fireEvent.click(checkbox);

            // Checkbox should now be checked!
            expect(checkbox).toBeChecked();

            const updatedExp = useResumeStore.getState().resumeData.experience.find(e => e.id === expId);
            expect(updatedExp.current).toBe(true);
            expect(updatedExp.endDate).toBe('');
        });

        it('clears endDate and disables picker when checking "I currently work here" after setting endDate', () => {
            render(<ExperienceStep />);

            // Add position with existing dates
            const addBtn = screen.getByRole('button', { name: /Add Position/i });
            fireEvent.click(addBtn);

            const expId = useResumeStore.getState().resumeData.experience[0].id;

            useResumeStore.getState().updateSection('experience', [{
                id: expId,
                company: 'Tech Corp',
                title: 'Lead Architect',
                startDate: 'Jan 2020',
                endDate: 'Dec 2023',
                current: false,
                description: ''
            }]);

            const checkbox = screen.getByLabelText(/I am currently working here|I currently work here/i);
            expect(checkbox).not.toBeChecked();

            // Check "I currently work here"
            fireEvent.click(checkbox);

            // Must be checked and store must reflect current: true and endDate: ''
            expect(checkbox).toBeChecked();
            const storeExp = useResumeStore.getState().resumeData.experience.find(e => e.id === expId);
            expect(storeExp.current).toBe(true);
            expect(storeExp.endDate).toBe('');

            // End date displays "Present"
            expect(screen.getByText('Present')).toBeInTheDocument();

            // Uncheck it
            fireEvent.click(checkbox);
            expect(checkbox).not.toBeChecked();
            const uncheckedExp = useResumeStore.getState().resumeData.experience.find(e => e.id === expId);
            expect(uncheckedExp.current).toBe(false);
        });
    });

    describe('EducationStep', () => {
        it('allows selecting "I currently study here" after setting dates', () => {
            render(<EducationStep />);

            // Add school
            const addBtn = screen.getByRole('button', { name: /Add School/i });
            fireEvent.click(addBtn);

            const eduId = useResumeStore.getState().resumeData.education[0].id;

            useResumeStore.getState().updateSection('education', [{
                id: eduId,
                school: 'MIT',
                degree: 'CS',
                startDate: '2021',
                endDate: '2025',
                current: false,
                gpa: ''
            }]);

            const checkbox = screen.getByLabelText(/I currently study here/i);
            expect(checkbox).not.toBeChecked();

            fireEvent.click(checkbox);

            expect(checkbox).toBeChecked();
            const updatedEdu = useResumeStore.getState().resumeData.education.find(e => e.id === eduId);
            expect(updatedEdu.current).toBe(true);
            expect(updatedEdu.endDate).toBe('');
        });
    });
});
