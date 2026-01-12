import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

/**
 * Force download a blob as a file with proper filename
 */
const forceDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 250);
};

export const exportToTxt = (resumeData) => {
    let text = "";

    // Header
    text += (resumeData.personalInfo.fullName || "").toUpperCase() + "\n";
    text += "----------------------------------------\n";
    text += `Email: ${resumeData.personalInfo.email || ""}\n`;
    text += `Phone: ${resumeData.personalInfo.phone || ""}\n`;
    text += `Location: ${resumeData.personalInfo.location || ""}\n`;
    if (resumeData.personalInfo.linkedin) text += `LinkedIn: ${resumeData.personalInfo.linkedin}\n`;
    text += "\n";

    // Summary
    if (resumeData.summary) {
        text += "PROFESSIONAL SUMMARY\n";
        text += "----------------------------------------\n";
        text += resumeData.summary + "\n\n";
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        text += "WORK EXPERIENCE\n";
        text += "----------------------------------------\n";
        resumeData.experience.forEach(job => {
            text += `${job.title} at ${job.company}\n`;
            text += `${job.startDate} - ${job.endDate || 'Present'} | ${job.location || ""}\n`;
            if (job.description) text += `${job.description}\n`;
            text += "\n";
        });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
        text += "EDUCATION\n";
        text += "----------------------------------------\n";
        resumeData.education.forEach(edu => {
            text += `${edu.school} - ${edu.degree}\n`;
            text += `${edu.startDate} - ${edu.endDate}\n`;
            text += "\n";
        });
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
        text += "SKILLS\n";
        text += "----------------------------------------\n";
        const skillNames = resumeData.skills.map(s => typeof s === 'string' ? s : s.name).join(", ");
        text += skillNames + "\n";
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const filename = `${(resumeData.personalInfo.fullName || "Resume").replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    forceDownload(blob, filename);
};

export const exportToDocx = async (resumeData) => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Name
                    new Paragraph({
                        text: (resumeData.personalInfo.fullName || "Your Name").toUpperCase(),
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    }),

                    // Contact Info
                    new Paragraph({
                        children: [
                            new TextRun({ text: resumeData.personalInfo.email || "", break: 0 }),
                            new TextRun({ text: " | " + (resumeData.personalInfo.phone || ""), break: 0 }),
                            new TextRun({ text: " | " + (resumeData.personalInfo.location || ""), break: 0 }),
                            new TextRun({ text: " | " + (resumeData.personalInfo.linkedin || ""), break: 0 }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),

                    // Summary Section
                    ...(resumeData.summary ? [
                        new Paragraph({
                            text: "PROFESSIONAL SUMMARY",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                            spacing: { after: 120 }
                        }),
                        new Paragraph({
                            text: resumeData.summary,
                            spacing: { after: 300 }
                        })
                    ] : []),

                    // Experience Section
                    ...(resumeData.experience.length > 0 ? [
                        new Paragraph({
                            text: "WORK EXPERIENCE",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                            spacing: { before: 200, after: 120 }
                        }),
                        ...resumeData.experience.flatMap(job => [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: job.title, bold: true, size: 24 }),
                                    new TextRun({ text: "\t" + (job.startDate + " - " + (job.endDate || "Present")), bold: true })
                                ],
                                tabStops: [
                                    { type: "right", position: 9000 }
                                ]
                            }),
                            new Paragraph({
                                text: `${job.company}, ${job.location || ""}`,
                                italics: true,
                                spacing: { after: 100 }
                            }),
                            ...(job.description ? job.description.split('\n').map(line =>
                                new Paragraph({
                                    text: line.replace(/^[•-]\s*/, ''),
                                    bullet: { level: 0 }
                                })
                            ) : [])
                        ])
                    ] : []),

                    // Education Section
                    ...(resumeData.education.length > 0 ? [
                        new Paragraph({
                            text: "EDUCATION",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                            spacing: { before: 300, after: 120 }
                        }),
                        ...resumeData.education.flatMap(edu => [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: edu.school, bold: true }),
                                    new TextRun({ text: "\t" + (edu.startDate + " - " + edu.endDate), bold: true })
                                ],
                                tabStops: [
                                    { type: "right", position: 9000 }
                                ]
                            }),
                            new Paragraph({
                                text: edu.degree,
                                spacing: { after: 200 }
                            })
                        ])
                    ] : []),

                    // Skills Section
                    ...(resumeData.skills.length > 0 ? [
                        new Paragraph({
                            text: "SKILLS",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                            spacing: { before: 300, after: 120 }
                        }),
                        new Paragraph({
                            text: resumeData.skills.map(s => typeof s === 'string' ? s : s.name).join(", "),
                            spacing: { after: 200 }
                        })
                    ] : []),
                ],
            },
        ],
    });

    const buffer = await Packer.toBlob(doc);
    const docxBlob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const filename = `${(resumeData.personalInfo.fullName || "resume").replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
    forceDownload(docxBlob, filename);
};
