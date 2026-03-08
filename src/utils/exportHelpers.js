import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * Force download a blob as a file with proper filename
 * This method creates a hidden anchor, sets the download attribute,
 * and programmatically clicks it to trigger download
 */
const forceDownload = (blob, filename) => {
    // Create object URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create hidden anchor element
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename); // This forces download with filename

    // Append to body (required for Firefox)
    document.body.appendChild(link);

    // Trigger click
    link.click();

    // Cleanup - use setTimeout to ensure download starts before cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 250);
};

/**
 * Generate PDF using html2canvas + jsPDF
 * Captures the element directly at its exact rendered size.
 * Uses html2canvas onclone to resolve CSS variables in the internal clone.
 */
export const exportToPDF = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
        // Get the element's exact rendered dimensions
        const rect = element.getBoundingClientRect();
        const elWidth = Math.round(rect.width);
        const elHeight = Math.round(rect.height);

        // Temporarily scroll to top and remove any transforms that could affect capture
        const scrollParent = element.closest('.overflow-y-auto') || element.parentElement;
        const origScroll = scrollParent ? scrollParent.scrollTop : 0;
        if (scrollParent) scrollParent.scrollTop = 0;

        // Small delay for scroll to settle
        await new Promise(r => setTimeout(r, 50));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: elWidth,
            height: elHeight,
            windowWidth: elWidth,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            onclone: (clonedDoc) => {
                // Resolve CSS custom properties in the cloned document
                const clonedEl = clonedDoc.getElementById(elementId);
                if (clonedEl) {
                    // Force the cloned element to use the same dimensions
                    clonedEl.style.width = elWidth + 'px';
                    clonedEl.style.minHeight = 'auto';
                    clonedEl.style.boxShadow = 'none';
                    clonedEl.style.overflow = 'visible';

                    // Resolve all var(--xxx) CSS custom properties
                    const resolveVars = (el) => {
                        const computed = window.getComputedStyle(
                            // Find matching element in original document
                            document.getElementById(elementId)
                        );
                        // Walk all elements and inline any CSS variable values
                        const allEls = el.querySelectorAll('*');
                        allEls.forEach((cloneChild, idx) => {
                            const style = cloneChild.getAttribute('style') || '';
                            if (style.includes('var(')) {
                                // Replace var(--xxx) with computed values
                                const newStyle = style.replace(
                                    /var\(--[^)]+\)/g,
                                    (match) => {
                                        const varName = match.slice(4, -1).trim();
                                        const rootComputed = getComputedStyle(document.documentElement);
                                        return rootComputed.getPropertyValue(varName) || match;
                                    }
                                );
                                cloneChild.setAttribute('style', newStyle);
                            }
                        });
                    };
                    resolveVars(clonedEl);
                }
            }
        });

        // Restore scroll position
        if (scrollParent) scrollParent.scrollTop = origScroll;

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const pdfBlob = pdf.output('blob');
        forceDownload(pdfBlob, 'resume.pdf');

        console.log('PDF exported successfully');
        return true;
    } catch (error) {
        console.error('PDF export failed:', error);
        throw error;
    }
};

/**
 * Generate DOCX with Word-compatible styles
 */
export const exportToDOCX = async (data) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [] } = data;

    try {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: (personalInfo.fullName || 'Your Name').toUpperCase(),
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: personalInfo.email || '' }),
                            new TextRun({ text: ' | ' + (personalInfo.phone || '') }),
                            new TextRun({ text: ' | ' + (personalInfo.location || '') }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 }
                    }),
                    ...(summary ? [
                        new Paragraph({
                            text: 'PROFESSIONAL SUMMARY',
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        new Paragraph({ text: summary, spacing: { after: 200 } })
                    ] : []),
                    ...(experience.length > 0 ? [
                        new Paragraph({
                            text: 'WORK EXPERIENCE',
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        ...experience.flatMap(exp => [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: exp.title || '', bold: true }),
                                    new TextRun({ text: ' at ' + (exp.company || ''), bold: true })
                                ]
                            }),
                            new Paragraph({
                                text: `${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}`,
                                spacing: { after: 80 }
                            }),
                            new Paragraph({ text: exp.description || '', spacing: { after: 150 } })
                        ])
                    ] : []),
                    ...(education.length > 0 ? [
                        new Paragraph({
                            text: 'EDUCATION',
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        ...education.flatMap(edu => [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: edu.school || '', bold: true }),
                                    new TextRun({ text: ' - ' + (edu.degree || '') })
                                ]
                            }),
                            new Paragraph({
                                text: edu.graduationDate || `${edu.startDate || ''} - ${edu.endDate || ''}`,
                                spacing: { after: 150 }
                            })
                        ])
                    ] : []),
                    ...(skills.length > 0 ? [
                        new Paragraph({
                            text: 'SKILLS',
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        new Paragraph({
                            text: skills.map(s => typeof s === 'string' ? s : s.name).join(', ')
                        })
                    ] : [])
                ],
            }],
        });

        // Generate blob with explicit MIME type
        const buffer = await Packer.toBlob(doc);
        const docxBlob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const filename = `${(personalInfo.fullName || 'resume').replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
        forceDownload(docxBlob, filename);

        console.log('DOCX exported successfully');
        return true;
    } catch (error) {
        console.error('DOCX export failed:', error);
        throw error;
    }
};

/**
 * Generate TXT plain text file
 */
export const exportToTXT = (data) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [] } = data;

    let text = '';
    text += (personalInfo.fullName || 'Your Name').toUpperCase() + '\n';
    text += '='.repeat(50) + '\n';
    text += `Email: ${personalInfo.email || ''}\n`;
    text += `Phone: ${personalInfo.phone || ''}\n`;
    text += `Location: ${personalInfo.location || ''}\n\n`;

    if (summary) {
        text += 'PROFESSIONAL SUMMARY\n' + '-'.repeat(30) + '\n';
        text += summary + '\n\n';
    }

    if (experience.length > 0) {
        text += 'WORK EXPERIENCE\n' + '-'.repeat(30) + '\n';
        experience.forEach(exp => {
            text += `${exp.title || ''} at ${exp.company || ''}\n`;
            text += `${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}\n`;
            if (exp.description) text += `${exp.description}\n`;
            text += '\n';
        });
    }

    if (education.length > 0) {
        text += 'EDUCATION\n' + '-'.repeat(30) + '\n';
        education.forEach(edu => {
            text += `${edu.school || ''} - ${edu.degree || ''}\n`;
            text += `${edu.startDate || ''} - ${edu.endDate || ''}\n\n`;
        });
    }

    if (skills.length > 0) {
        text += 'SKILLS\n' + '-'.repeat(30) + '\n';
        text += skills.map(s => typeof s === 'string' ? s : s.name).join(', ') + '\n';
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const filename = `${(personalInfo.fullName || 'resume').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    forceDownload(blob, filename);

    console.log('TXT exported successfully');
    return true;
};
