import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseResume = async (file) => {
    const fileType = file.type;
    let text = "";

    if (fileType === "application/pdf") {
        text = await extractTextFromPDF(file);
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileType === "application/msword") {
        text = await extractTextFromDOCX(file);
    } else {
        throw new Error("Unsupported file type. Please upload PDF or DOCX.");
    }

    return extractDataFromText(text);
};

const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
    }

    return fullText;
};

const extractTextFromDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

const extractDataFromText = (text) => {
    // Simple heuristic extraction
    // In a real app, this would be more sophisticated or use an AI API

    // Normalize text
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // 1. Email extraction
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const emailMatch = cleanText.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : "";

    // 2. Phone extraction (very basic)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const phoneMatch = cleanText.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : "";

    // 3. Name (Heuristic: usually first couple of words, or look for capitalized words near email)
    // This is hard to do reliably without NLP. We'll take the first non-empty line or first few words.
    // A VERY Naive approach:
    const name = cleanText.split(' ').slice(0, 3).join(' ');

    // 4. Skills (Naive keyword matching against a common list)
    const commonSkills = ["JavaScript", "React", "Node.js", "Python", "Java", "SQL", "Teamwork", "Communication", "Management", "HTML", "CSS", "C++", "C#", "AWS", "Azure", "Docker", "Kubernetes", "Git"];
    const foundSkills = commonSkills.filter(skill => cleanText.toLowerCase().includes(skill.toLowerCase()));

    // Structure return data
    return {
        personalInfo: {
            fullName: name, // User will likely need to correct this
            email: email,
            phone: phone,
            location: "", // Hard to extract reliably without NLP
            linkedin: "",
            website: ""
        },
        summary: cleanText.slice(0, 500) + "...", // Just taking the beginning as placeholder or user needs to fill
        experience: [], // Difficult to parse structure reliably without complex logic
        education: [],
        skills: foundSkills,
        rawText: cleanText // Keep raw text for debugging or advanced parsing
    };
};
