import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker with local file matching installed version
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extract text from a file (PDF or DOCX)
 */
export const extractTextFromFile = async (file) => {
    const fileType = file.type;
    console.log(`Extracting text from file: ${file.name} (${fileType})`);

    try {
        if (fileType === 'application/pdf') {
            return await extractTextFromPDF(file);
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileType === 'application/msword'
        ) {
            return await extractTextFromDOCX(file);
        } else {
            console.error(`Unsupported file type: ${fileType}`);
            throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
        }
    } catch (error) {
        console.error('Text extraction failed:', error);
        throw error;
    }
};

const extractTextFromPDF = async (file) => {
    try {
        console.log("📄 Starting PDF parse for:", file.name);

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        console.log("✓ ArrayBuffer created:", arrayBuffer.byteLength, "bytes");

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log("✓ PDF loaded, pages:", pdf.numPages);

        let fullText = "";

        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
            console.log(`✓ Extracted page ${i}/${pdf.numPages}`);
        }

        console.log("✓ Total text extracted:", fullText.length, "characters");
        console.log("Preview (first 300 chars):", fullText.substring(0, 300));

        return fullText;

    } catch (error) {
        console.error("❌ PDF parsing error:", error);
        alert("Failed to parse PDF. Error: " + error.message);
        throw error;
    }
};

const extractTextFromDOCX = async (file) => {
    try {
        console.log("📄 Starting DOCX parse for:", file.name);

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        console.log("✓ ArrayBuffer created:", arrayBuffer.byteLength, "bytes");

        // Extract raw text using mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });

        console.log("✓ Text extracted:", result.value.length, "characters");
        console.log("Preview (first 300 chars):", result.value.substring(0, 300));

        // Log any warnings from mammoth
        if (result.messages.length > 0) {
            console.warn("⚠️ Mammoth warnings:", result.messages);
        }

        return result.value;

    } catch (error) {
        console.error("❌ DOCX parsing error:", error);
        alert("Failed to parse DOCX. Error: " + error.message);
        throw error;
    }
};

/**
 * Enhanced Regex Parser
 * Returns structured data + confidence scores
 */
export const parseResumeText = (text) => {
    console.log("🔍 Parsing resume text...");

    // Initialize empty resume data structure
    const resumeData = {
        personalInfo: {
            name: "",
            email: "",
            phone: "",
            location: ""
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        certifications: []
    };

    // Split text into lines for easier parsing
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // 1. Extract Email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) {
        resumeData.personalInfo.email = emailMatch[0];
        console.log("✓ Found email:", emailMatch[0]);
    }

    // 2. Extract Phone (multiple formats)
    const phoneMatch = text.match(/(\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
    if (phoneMatch) {
        resumeData.personalInfo.phone = phoneMatch[0].trim();
        console.log("✓ Found phone:", phoneMatch[0]);
    }

    // 3. Extract Name (usually first line before email)
    if (lines.length > 0) {
        // Find first line that's not an email or phone
        const nameLine = lines.find(line =>
            !line.includes('@') &&
            !line.match(/\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/) &&
            line.length > 3 &&
            line.length < 50
        );
        if (nameLine) {
            resumeData.personalInfo.name = nameLine.trim();
            console.log("✓ Found name:", nameLine.trim());
        }
    }

    // 4. Extract Location/Address
    const locationMatch = text.match(/([A-Z][a-z]+,\s*[A-Z]{2}\s*\d{5}|[A-Z][a-z]+,\s*[A-Z][a-z]+)/);
    if (locationMatch) {
        resumeData.personalInfo.location = locationMatch[0];
        console.log("✓ Found location:", locationMatch[0]);
    }

    // 5. Extract Professional Summary
    const summaryMatch = text.match(/(?:summary|profile|objective|about)(.*?)(?=experience|education|skills|work|employment)/is);
    if (summaryMatch && summaryMatch[1]) {
        resumeData.summary = summaryMatch[1].trim().substring(0, 500);
        console.log("✓ Found summary:", resumeData.summary.length, "characters");
    }

    // 6. Extract Experience
    const experienceMatch = text.match(/(?:experience|work history|employment|professional experience)(.*?)(?=education|skills|certifications|$)/is);
    if (experienceMatch && experienceMatch[1]) {
        console.log("✓ Found experience section");
        const expText = experienceMatch[1];

        // Split by job entries (look for company/title patterns)
        // This is a simplified parser - may need refinement
        const jobPattern = /([A-Z][a-zA-Z\s&]+)\s*[|•-]\s*([A-Z][a-zA-Z\s]+)\s*[|•-]?\s*(\d{4}|\d{1,2}\/\d{4})/g;
        let match;
        let jobCount = 0;

        while ((match = jobPattern.exec(expText)) !== null && jobCount < 5) {
            resumeData.experience.push({
                id: `exp-${Date.now()}-${jobCount}`,
                order: jobCount,
                company: match[1].trim(),
                title: match[2].trim(),
                startDate: match[3],
                endDate: "Present",
                current: false,
                bullets: ["• Responsibility/achievement details"]
            });
            jobCount++;
        }

        console.log("✓ Extracted", resumeData.experience.length, "jobs");
    }

    // 7. Extract Education
    const educationMatch = text.match(/(?:education|academic background)(.*?)(?=experience|skills|certifications|$)/is);
    if (educationMatch && educationMatch[1]) {
        console.log("✓ Found education section");
        const eduText = educationMatch[1];

        // Look for degree patterns
        const degreePattern = /(Bachelor|Master|PhD|B\.S\.|M\.S\.|MBA|B\.A\.|M\.A\.)[^.]*\s+(?:in\s+)?([A-Za-z\s]+)/gi;
        let match;
        let eduCount = 0;

        while ((match = degreePattern.exec(eduText)) !== null && eduCount < 3) {
            resumeData.education.push({
                id: `edu-${Date.now()}-${eduCount}`,
                order: eduCount,
                degree: match[0].trim(),
                school: "University Name",
                graduationDate: "",
                gpa: ""
            });
            eduCount++;
        }

        console.log("✓ Extracted", resumeData.education.length, "degrees");
    }

    // 8. Extract Skills
    const skillsMatch = text.match(/(?:skills|technical skills|core competencies|expertise)(.*?)(?=experience|education|certifications|$)/is);
    if (skillsMatch && skillsMatch[1]) {
        const skillsText = skillsMatch[1];
        // Split by common separators
        const skillsList = skillsText
            .split(/[,•\n|]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 30)
            .slice(0, 20);

        resumeData.skills = skillsList;
        console.log("✓ Extracted", skillsList.length, "skills");
    }

    // 9. Extract Certifications
    const certsMatch = text.match(/(?:certifications|certificates|licenses)(.*?)(?=experience|education|skills|$)/is);
    if (certsMatch && certsMatch[1]) {
        const certsText = certsMatch[1];
        const certsList = certsText
            .split(/[•\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 5 && s.length < 100)
            .slice(0, 10);

        resumeData.certifications = certsList;
        console.log("✓ Extracted", certsList.length, "certifications");
    }

    console.log("✅ Parsing complete. Extracted data:", resumeData);
    return resumeData;
};
