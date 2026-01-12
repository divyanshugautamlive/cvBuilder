
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import fs from "fs";

// 1. Generate PDF
const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("John Doe", 20, 20);

    doc.setFontSize(12);
    doc.text("john.doe@example.com | (555) 123-4567 | San Francisco, CA", 20, 30);

    doc.setFontSize(16);
    doc.text("Professional Summary", 20, 45);
    doc.setFontSize(12);
    doc.text("Experienced Software Engineer with a focus on React and Node.js.", 20, 55);

    doc.setFontSize(16);
    doc.text("Experience", 20, 70);
    doc.setFontSize(14);
    doc.text("Tech Corp | Senior Developer | Jan 2020 - Present", 20, 80);
    doc.setFontSize(12);
    doc.text("• Led development of the main dashboard.", 20, 90);
    doc.text("• Improved performance by 30%.", 20, 100);

    doc.setFontSize(16);
    doc.text("Education", 20, 120);
    doc.setFontSize(12);
    doc.text("Bachelor of Science in Computer Science", 20, 130);
    doc.text("University of Technology", 20, 135);

    doc.setFontSize(16);
    doc.text("Skills", 20, 150);
    doc.setFontSize(12);
    doc.text("JavaScript, React, Node.js, CSS, HTML, Python", 20, 160);

    const buffer = doc.output('arraybuffer');
    fs.writeFileSync("test_resume.pdf", Buffer.from(buffer));
    console.log("✅ test_resume.pdf created");
};

// 2. Generate DOCX
const generateDOCX = async () => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Jane Smith",
                                bold: true,
                                size: 44, // 22pt
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "jane.smith@example.com | (555) 987-6543 | New York, NY",
                                size: 24, // 12pt
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [new TextRun({ text: "Professional Summary", bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        children: [new TextRun("Creative Web Designer with 5 years of experience.")],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [new TextRun({ text: "Experience", bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Creative Studio | UI Designer | Mar 2018 - Dec 2022", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun("• Designed user interfaces for mobile apps.")],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [new TextRun({ text: "Skills", bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        children: [new TextRun("Figma, Adobe XD, Photoshop, CSS, HTML")],
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("test_resume.docx", buffer);
    console.log("✅ test_resume.docx created");
};

(async () => {
    try {
        generatePDF();
        await generateDOCX();
    } catch (e) {
        console.error("Error generating files:", e);
    }
})();
