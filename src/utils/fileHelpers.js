import '../polyfills.js';
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
            
            const items = textContent.items || [];
            if (items.length === 0) continue;
            
            // Map items with coordinates
            const positionedItems = items.map(item => ({
                str: item.str,
                x: item.transform ? item.transform[4] : 0,
                y: item.transform ? item.transform[5] : 0,
                height: item.height || 0
            }));
            
            // Sort by Y coordinate descending (top to bottom)
            positionedItems.sort((a, b) => b.y - a.y);
            
            const lines = [];
            let currentLine = [];
            let currentY = positionedItems[0].y;
            const lineTolerance = 5; // pixels tolerance for single line
            
            for (const item of positionedItems) {
                if (Math.abs(item.y - currentY) <= lineTolerance) {
                    currentLine.push(item);
                } else {
                    // Sort the finished line left-to-right (x ascending)
                    currentLine.sort((a, b) => a.x - b.x);
                    lines.push(currentLine);
                    // Start new line
                    currentLine = [item];
                    currentY = item.y;
                }
            }
            if (currentLine.length > 0) {
                currentLine.sort((a, b) => a.x - b.x);
                lines.push(currentLine);
            }
            
            const pageText = lines.map(line => line.map(item => item.str).join(" ")).join("\n");
            fullText += pageText + "\n";
            console.log(`✓ Extracted page ${i}/${pdf.numPages} in visual order`);
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
            fullName: "",
            jobTitle: "",
            email: "",
            phone: "",
            location: "",
            linkedin: ""
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        parserConfidence: {
            fullName: false,
            jobTitle: false,
            email: false,
            phone: false,
            location: false,
            linkedin: false,
            summary: false
        }
    };

    // Split text into lines for easier parsing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // 1. Extract Email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) {
        resumeData.personalInfo.email = emailMatch[0];
        resumeData.parserConfidence.email = true;
        console.log("✓ Found email:", emailMatch[0]);
    }

    // 2. Extract Phone (multiple formats, including international +91)
    const phoneRegex = /(?:(?:\+91|91)[\s.-]?)?\(?[6-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) {
        resumeData.personalInfo.phone = phoneMatch[0].trim();
        resumeData.parserConfidence.phone = true;
        console.log("✓ Found phone:", phoneMatch[0]);
    }

    // 3. Extract LinkedIn URL
    const linkedinRegex = /(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)|(?:linkedin\.com\/pub\/[a-zA-Z0-9_-]+)/i;
    const linkedinMatch = text.match(linkedinRegex);
    if (linkedinMatch) {
        resumeData.personalInfo.linkedin = linkedinMatch[0].trim();
        resumeData.parserConfidence.linkedin = true;
        console.log("✓ Found LinkedIn:", linkedinMatch[0]);
    }

    // 4. Extract Location/Address
    const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\s*\d{5}|[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}|[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/);
    if (locationMatch) {
        resumeData.personalInfo.location = locationMatch[0].trim();
        resumeData.parserConfidence.location = true;
        console.log("✓ Found location:", locationMatch[0].trim());
    }

    // 5. Extract Name (usually first line before email/phone/etc.)
    if (lines.length > 0) {
        const nameLine = lines.slice(0, 10).find(line =>
            !line.includes('@') &&
            !line.match(/\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/) &&
            !line.match(phoneRegex) &&
            !line.match(linkedinRegex) &&
            !/(?:summary|profile|objective|experience|education|skills|work|employment|certifications)/i.test(line) &&
            line.length > 3 &&
            line.length < 50
        );
        if (nameLine) {
            resumeData.personalInfo.fullName = nameLine.trim();
            const words = nameLine.trim().split(/\s+/);
            const isTitleCase = words.every(w => /^[A-Z][a-zA-Z]*$/.test(w));
            if (words.length >= 2 && words.length <= 4 && isTitleCase) {
                resumeData.parserConfidence.fullName = true;
            } else {
                resumeData.parserConfidence.fullName = false;
            }
            console.log("✓ Found name:", nameLine.trim(), "Confidence:", resumeData.parserConfidence.fullName);
        }
    }

    // Segment sections
    const sections = {
        summary: [],
        experience: [],
        education: [],
        skills: [],
        certifications: []
    };
    
    let currentSection = null;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        if (/(?:^|\s)(?:summary|professional\s+profile|profile|objective|about\s+me|career\s+objective)(?:\s+|$)/i.test(trimmed) && trimmed.length < 30) {
            currentSection = 'summary';
            continue;
        } else if (/(?:^|\s)(?:experience|work\s+history|employment|professional\s+experience|work\s+experience|career\s+history)(?:\s+|$)/i.test(trimmed) && trimmed.length < 30) {
            currentSection = 'experience';
            continue;
        } else if (/(?:^|\s)(?:education|academic\s+background|academic\s+history|academic\s+credentials|qualifications)(?:\s+|$)/i.test(trimmed) && trimmed.length < 30) {
            currentSection = 'education';
            continue;
        } else if (/(?:^|\s)(?:skills|technical\s+skills|core\s+competencies|expertise|technologies|technical\s+expertise)(?:\s+|$)/i.test(trimmed) && trimmed.length < 30) {
            currentSection = 'skills';
            continue;
        } else if (/(?:^|\s)(?:certifications|certificates|licenses|credentials|professional\s+certifications)(?:\s+|$)/i.test(trimmed) && trimmed.length < 30) {
            currentSection = 'certifications';
            continue;
        }
        
        if (currentSection) {
            sections[currentSection].push(trimmed);
        }
    }

    // Parse Summary
    if (sections.summary.length > 0) {
        resumeData.summary = sections.summary.join(' ').substring(0, 500);
        resumeData.parserConfidence.summary = true;
        console.log("✓ Found summary:", resumeData.summary.length, "characters");
    }

    // Parse Skills
    const skillsList = [];
    sections.skills.forEach(line => {
        const parts = line.split(/[,•|;\t]|\s{2,}/);
        parts.forEach(part => {
            const trimmedPart = part.trim();
            if (trimmedPart.length > 1 && trimmedPart.length < 40 && !/^(skills|technical|technologies|expertise)$/i.test(trimmedPart)) {
                skillsList.push({ name: trimmedPart, level: 'Intermediate' });
            }
        });
    });
    resumeData.skills = skillsList.slice(0, 20);
    console.log("✓ Extracted", resumeData.skills.length, "skills");

    // Parse Certifications
    const certsList = [];
    sections.certifications.forEach(line => {
        const parts = line.split(/[,•|;\t]|\s{2,}/);
        parts.forEach(part => {
            const trimmedPart = part.trim();
            if (trimmedPart.length > 3 && trimmedPart.length < 100 && !/^(certifications|certificates|licenses|credentials)$/i.test(trimmedPart)) {
                certsList.push(trimmedPart);
            }
        });
    });
    resumeData.certifications = certsList.slice(0, 10);
    console.log("✓ Extracted", resumeData.certifications.length, "certifications");

    // Parse Education
    const eduList = [];
    let currentEdu = null;
    sections.education.forEach((line) => {
        const degreeMatch = line.match(/(Bachelor|Master|PhD|B\.S\.|M\.S\.|MBA|B\.A\.|M\.A\.|B\.Tech|B\.E\.|BCA|MCA|Diploma)/i);
        const yearMatches = line.match(/\b(19|20)\d{2}\b/g);
        
        const isNewEntry = degreeMatch || line.includes("University") || line.includes("College") || line.includes("Institute") || line.includes("School");
        
        if (isNewEntry || !currentEdu) {
            if (currentEdu) eduList.push(currentEdu);
            currentEdu = {
                id: `edu-${Date.now()}-${eduList.length}`,
                order: eduList.length,
                degree: degreeMatch ? degreeMatch[0] : "Degree/Certificate",
                school: "University/School",
                startDate: "",
                endDate: "",
                current: false,
                gpa: ""
            };
            if (!degreeMatch) {
                currentEdu.school = line;
            }
        } else {
            if (line.includes("University") || line.includes("College") || line.includes("Institute") || line.includes("School")) {
                currentEdu.school = line;
            } else if (currentEdu.degree === "Degree/Certificate") {
                currentEdu.degree = line;
            } else if (line.match(/gpa|cgpa/i)) {
                const gpaMatch = line.match(/\b\d\.\d{1,2}\b/);
                if (gpaMatch) currentEdu.gpa = gpaMatch[0];
            }
        }
        if (yearMatches && currentEdu) {
            if (yearMatches.length >= 2) {
                currentEdu.startDate = yearMatches[0];
                currentEdu.endDate = yearMatches[1];
            } else if (yearMatches.length === 1) {
                currentEdu.endDate = yearMatches[0];
            }
        }
    });
    if (currentEdu) eduList.push(currentEdu);
    resumeData.education = eduList.filter(edu => edu.school !== "University/School" || edu.degree !== "Degree/Certificate").slice(0, 3);
    console.log("✓ Extracted", resumeData.education.length, "degrees");

    // Parse Experience (Block-based)
    const jobs = [];
    let currentJob = null;
    const hasDateRange = (line) => {
        const yearMatches = line.match(/\b(19|20)\d{2}\b/g);
        return yearMatches && (yearMatches.length >= 1 || /present|current/i.test(line));
    };
    const companyKeywords = /\b(inc|ltd|corp|corporation|solutions|systems|services|technologies|group|company|agency|university|institute)\b/i;
    const titleKeywords = /\b(engineer|developer|designer|manager|analyst|specialist|lead|director|intern|consultant|architect|strategist|executive|head|officer|programmer|administrator)\b/i;
    
    sections.experience.forEach((line) => {
        const isNewJob = hasDateRange(line) || (companyKeywords.test(line) && currentJob && currentJob.company !== "Company Name") || (titleKeywords.test(line) && currentJob && currentJob.title !== "Job Title" && !line.startsWith("•") && !line.startsWith("-"));
        
        if (isNewJob || !currentJob) {
            if (currentJob) jobs.push(currentJob);
            currentJob = {
                id: `exp-${Date.now()}-${jobs.length}`,
                order: jobs.length,
                company: "Company Name",
                title: "Job Title",
                startDate: "",
                endDate: "Present",
                current: true,
                description: ""
            };
        }
        
        const years = line.match(/\b(19|20)\d{2}\b/g);
        if (years) {
            if (years.length >= 2) {
                currentJob.startDate = years[0];
                currentJob.endDate = years[1];
                currentJob.current = false;
            } else if (years.length === 1) {
                currentJob.startDate = years[0];
                if (/present|current|now/i.test(line)) {
                    currentJob.endDate = "Present";
                    currentJob.current = true;
                } else {
                    currentJob.endDate = years[0];
                    currentJob.current = false;
                }
            }
        }
        
        if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
            const bullet = line.replace(/^[•\-*]\s*/, '').trim();
            if (bullet) {
                currentJob.description = currentJob.description 
                    ? `${currentJob.description}\n• ${bullet}`
                    : `• ${bullet}`;
            }
        } else if (titleKeywords.test(line) && currentJob.title === "Job Title") {
            currentJob.title = line.trim();
        } else if (currentJob.company === "Company Name" && !hasDateRange(line)) {
            currentJob.company = line.trim();
        } else if (!hasDateRange(line) && !line.startsWith("•") && !line.startsWith("-")) {
            currentJob.description = currentJob.description 
                ? `${currentJob.description}\n${line.trim()}`
                : line.trim();
        }
    });
    if (currentJob) jobs.push(currentJob);
    resumeData.experience = jobs
        .filter(job => job.company !== "Company Name" || job.title !== "Job Title")
        .map(job => {
            if (job.company === "Company Name") job.company = "Independent Contractor";
            if (job.title === "Job Title") job.title = "Professional Experience";
            return job;
        })
        .slice(0, 5);
    console.log("✓ Extracted", resumeData.experience.length, "experience entries");

    // Extract Job Title from top lines of resume (if available)
    if (lines.length > 0 && !resumeData.personalInfo.jobTitle) {
        const titleLine = lines.slice(0, 10).find(line =>
            titleKeywords.test(line) &&
            !line.includes('@') &&
            !line.match(/\d{3}/) &&
            line.length > 5 &&
            line.length < 50
        );
        if (titleLine) {
            resumeData.personalInfo.jobTitle = titleLine.trim();
            resumeData.parserConfidence.jobTitle = true;
            console.log("✓ Found job title:", titleLine.trim());
        }
    }

    console.log("✅ Parsing complete. Extracted data:", resumeData);
    return resumeData;
};
