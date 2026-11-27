import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '../polyfills.js';
import EducationStep from '../components/features/form/EducationStep';
import ExperienceStep from '../components/features/form/ExperienceStep';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import useResumeStore from '../store/useResumeStore';

describe('CustomDatePicker & Flexible Date Selection', () => {
    beforeEach(() => {
        useResumeStore.getState().resetData();
    });

    it('renders calendar popover in a portal (document.body) above multiple education cards', () => {
        useResumeStore.getState().updateSection('education', [
            { id: 1, school: 'First University', degree: 'BSc', startDate: '', endDate: '', current: false, gpa: '' },
            { id: 2, school: 'Second University', degree: 'MSc', startDate: '', endDate: '', current: false, gpa: '' },
            { id: 3, school: 'Third University', degree: 'PhD', startDate: '', endDate: '', current: false, gpa: '' }
        ]);

        const { container } = render(<EducationStep />);

        const toggleButtons = screen.getAllByRole('button', { name: /Toggle Start Date calendar/i });
        fireEvent.click(toggleButtons[0]);

        const selectYearHeader = screen.getByText('Select Year');
        expect(selectYearHeader).toBeInTheDocument();
        expect(container.contains(selectYearHeader)).toBe(false);
        expect(document.body.contains(selectYearHeader)).toBe(true);
    });

    it('allows selecting Year only via calendar and reflects on template', async () => {
        useResumeStore.getState().updateSection('education', [
            { id: 101, school: 'MIT', degree: 'CS', startDate: '', endDate: '', current: false, gpa: '' }
        ]);

        const { rerender } = render(
            <>
                <EducationStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );

        const startToggle = screen.getByRole('button', { name: /Toggle Start Date calendar/i });
        fireEvent.click(startToggle);
        fireEvent.click(screen.getByRole('button', { name: '2022' }));
        fireEvent.click(await screen.findByRole('button', { name: 'Use 2022 Only' }));

        expect(useResumeStore.getState().resumeData.education[0].startDate).toBe('2022');

        rerender(
            <>
                <EducationStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );
        expect(within(screen.getByTestId('template-output')).getByText('2022')).toBeInTheDocument();
    });

    it('allows selecting Month & Year via calendar and reflects on template', async () => {
        useResumeStore.getState().updateSection('education', [
            { id: 102, school: 'Stanford', degree: 'MS', startDate: '2022', endDate: '', current: false, gpa: '' }
        ]);

        const { rerender } = render(
            <>
                <EducationStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );

        const endToggle = screen.getByRole('button', { name: /Toggle End Date \(or Expected\) calendar/i });
        fireEvent.click(endToggle);
        fireEvent.click(screen.getByRole('button', { name: '2024' }));
        fireEvent.click(await screen.findByRole('button', { name: 'Jul' }));
        fireEvent.click(await screen.findByRole('button', { name: 'Use Jul 2024' }));

        expect(useResumeStore.getState().resumeData.education[0].endDate).toBe('Jul 2024');

        rerender(
            <>
                <EducationStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );
        expect(within(screen.getByTestId('template-output')).getByText('Jul 2024')).toBeInTheDocument();
    });

    it('allows selecting Full Date (DD MMM YYYY) via calendar and reflects on template', async () => {
        useResumeStore.getState().updateSection('education', [
            { id: 103, school: 'Berkeley', degree: 'BS', startDate: '', endDate: '', current: false, gpa: '' }
        ]);

        const { rerender } = render(
            <>
                <EducationStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );

        const startToggle = screen.getByRole('button', { name: /Toggle Start Date calendar/i });
        fireEvent.click(startToggle);
        fireEvent.click(screen.getByRole('button', { name: '2021' }));
        fireEvent.click(await screen.findByRole('button', { name: 'Jan' }));
        fireEvent.click(await screen.findByRole('button', { name: '15' }));

        expect(useResumeStore.getState().resumeData.education[0].startDate).toBe('15 Jan 2021');

        rerender(
            <>
                <EducationStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );
        expect(within(screen.getByTestId('template-output')).getByText('15 Jan 2021')).toBeInTheDocument();
    });

    it('allows typing Year only, Month & Year, or DD/MM/YYYY directly without restriction and reflects on template', () => {
        useResumeStore.getState().updateSection('experience', [
            { id: 201, company: 'Acme', title: 'Dev', startDate: '', endDate: '', current: false, description: '' }
        ]);

        const { rerender } = render(
            <>
                <ExperienceStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );

        const startInput = screen.getByLabelText('Start Date');
        const endInput = screen.getByLabelText('End Date');

        fireEvent.change(startInput, { target: { value: '2020' } });
        fireEvent.change(endInput, { target: { value: '15/08/2025' } });

        expect(useResumeStore.getState().resumeData.experience[0].startDate).toBe('2020');
        expect(useResumeStore.getState().resumeData.experience[0].endDate).toBe('15/08/2025');

        rerender(
            <>
                <ExperienceStep />
                <div data-testid="template-output">
                    <ClassicTemplate data={useResumeStore.getState().resumeData} />
                </div>
            </>
        );
        const templateOutput = screen.getByTestId('template-output');
        expect(within(templateOutput).getByText('2020')).toBeInTheDocument();
        expect(within(templateOutput).getByText('15/08/2025')).toBeInTheDocument();
    });
});
