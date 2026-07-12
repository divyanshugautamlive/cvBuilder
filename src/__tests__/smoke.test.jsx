import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock components/utilities that make external calls or use untestable browser features
vi.mock('pdfjs-dist', () => {
    return {
        getDocument: vi.fn(() => ({
            promise: Promise.resolve({
                numPages: 1,
                getPage: vi.fn(() => Promise.resolve({
                    getTextContent: vi.fn(() => Promise.resolve({
                        items: [{ str: "John Doe\njohn.doe@example.com | (555) 123-4567 | San Francisco, CA" }]
                    }))
                }))
            })
        })),
        GlobalWorkerOptions: {
            workerSrc: ''
        }
    };
});

vi.mock('mammoth', () => {
    return {
        default: {
            extractRawText: vi.fn(() => Promise.resolve({
                value: "Jane Smith\njane.smith@example.com | (555) 987-6543 | New York, NY\nProfessional Summary\nCreative Web Designer with 5 years of experience.",
                messages: []
            }))
        }
    };
});

// Import live components/helpers to test
import FormWizard from '../components/features/form/FormWizard';
import TemplateRenderer from '../components/features/preview/TemplateRenderer';
import ExportButtons from '../components/features/export/ExportButtons';
import FileUploader from '../components/features/parser/FileUploader';
import useResumeStore from '../store/useResumeStore';
import { parseResumeText } from '../utils/fileHelpers';

describe('CVDesignHub Smoke Tests', () => {
    beforeEach(() => {
        // Reset Zustand store state before each test
        useResumeStore.getState().resetData();
        vi.clearAllMocks();
    });

    describe('1. Resume Form Wizard Navigation', () => {
        it('should render and navigate through steps after input', async () => {
            render(<FormWizard />);

            // Step 1: Personal Info
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            
            // Try clicking next without required fields (alert should show)
            const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
            fireEvent.click(screen.getByText('Next'));
            expect(alertMock).toHaveBeenCalledWith('Please fill in the required fields before proceeding.');
            alertMock.mockRestore();

            // Fill in Personal Info
            const nameInput = screen.getByPlaceholderText(/e.g. John Doe/i);
            const emailInput = screen.getByPlaceholderText(/e.g. john@example.com/i);
            fireEvent.change(nameInput, { target: { value: 'John Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

            // Proceed to Step 2: Summary
            fireEvent.click(screen.getByText('Next'));
            expect(screen.getByText('Professional Summary')).toBeInTheDocument();

            // Fill in Summary & proceed to Step 3: Experience
            const summaryTextArea = screen.getByPlaceholderText(/Experienced professional/i);
            fireEvent.change(summaryTextArea, { target: { value: 'Experienced engineer.' } });
            fireEvent.click(screen.getByText('Next'));

            // Step 3: Experience (validateStep checks if experience.length > 0)
            expect(screen.getByText('Work Experience')).toBeInTheDocument();
            
            // Click Add Position
            fireEvent.click(screen.getByText(/Add Position/i));
            
            // Proceed to Step 4: Education
            fireEvent.click(screen.getByText('Next'));
            expect(screen.getAllByText('Education').length).toBeGreaterThan(0);

            // Proceed to Step 5: Skills
            fireEvent.click(screen.getByText('Next'));
            expect(screen.getByText('Skills & Certifications')).toBeInTheDocument();
        });
    });

    describe('2. Resume Templates Rendering', () => {
        const templates = ['classic', 'minimalist', 'modern', 'executive', 'tech', 'entrylevel', 'jupiter', 'mars', 'blank'];

        templates.forEach((templateId) => {
            it(`should render ${templateId} template without throwing`, () => {
                useResumeStore.getState().setTemplate(templateId);
                const { container } = render(<TemplateRenderer />);
                expect(container.querySelector('#resume-preview')).toBeInTheDocument();
            });
        });
    });

    describe('3. File Upload & Parsing', () => {
        it('should handle PDF file upload and update store', async () => {
            // Read sample pdf from fixtures to construct File object
            const pdfPath = path.resolve(__dirname, 'fixtures/test_resume.pdf');
            const pdfBuffer = fs.readFileSync(pdfPath);
            const pdfFile = new File([pdfBuffer], 'test_resume.pdf', { type: 'application/pdf' });

            const { container } = render(<FileUploader />);
            const fileInput = container.querySelector('input[type="file"]');
            
            const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

            // Upload the file
            fireEvent.change(fileInput, { target: { files: [pdfFile] } });

            await waitFor(() => {
                expect(alertMock).toHaveBeenCalled();
            });

            // Verify that the Zustand store was updated with the parsed data
            const storeState = useResumeStore.getState().resumeData;
            expect(storeState.personalInfo.fullName).toBe('John Doe');
            expect(storeState.personalInfo.email).toBe('john.doe@example.com');
            expect(storeState.personalInfo.phone).toBe('(555) 123-4567');
            expect(storeState.personalInfo.location).toBe('San Francisco, CA');

            alertMock.mockRestore();
        });

        it('should handle DOCX file upload and update store', async () => {
            // Read sample docx from fixtures to construct File object
            const docxPath = path.resolve(__dirname, 'fixtures/test_resume.docx');
            const docxBuffer = fs.readFileSync(docxPath);
            const docxFile = new File([docxBuffer], 'test_resume.docx', {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            const { container } = render(<FileUploader />);
            const fileInput = container.querySelector('input[type="file"]');
            
            const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

            // Upload the file
            fireEvent.change(fileInput, { target: { files: [docxFile] } });

            await waitFor(() => {
                expect(alertMock).toHaveBeenCalled();
            });

            // Verify store update
            const storeState = useResumeStore.getState().resumeData;
            expect(storeState.personalInfo.fullName).toBe('Jane Smith');
            expect(storeState.personalInfo.email).toBe('jane.smith@example.com');

            alertMock.mockRestore();
        });

        it('should extract structured data in parseResumeText', () => {
            const rawText = `Jane Smith\njane.smith@example.com | (555) 987-6543 | New York, NY\nProfessional Summary\nCreative Web Designer.`;
            const parsed = parseResumeText(rawText);
            expect(parsed.personalInfo.fullName).toBe('Jane Smith');
            expect(parsed.personalInfo.email).toBe('jane.smith@example.com');
            expect(parsed.personalInfo.phone).toBe('(555) 987-6543');
            expect(parsed.personalInfo.location).toBe('New York, NY');
        });
    });

    describe('4. Export Control Print Action', () => {
        it('should trigger print dialog without error', async () => {
            render(
                <div>
                    <div id="root">
                        <ExportButtons />
                    </div>
                    <div id="resume-preview">Resume Content</div>
                </div>
            );

            const downloadButton = screen.getByRole('button', { name: /Download PDF/i });
            fireEvent.click(downloadButton);

            // Assert print was triggered asynchronously
            await waitFor(() => {
                expect(window.print).toHaveBeenCalled();
            });
        });
    });
});
