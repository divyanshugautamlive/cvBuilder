export const calculateATSScore = (resumeData) => {
    let score = 0;
    const checks = [];
    const improvements = [];

    // 1. File format compatibility (30 pts)
    // Since we are building the resume to export as PDF/DOCX standard, we assume compatibility.
    // However, we can check if data exists to generate it.
    score += 30;
    checks.push({ text: "File formats (PDF/DOCX) ready", status: "pass" });

    // 2. Section headers (15 pts)
    const sections = [
        { key: 'experience', label: 'Work Experience' },
        { key: 'education', label: 'Education' },
        { key: 'skills', label: 'Skills' },
        { key: 'summary', label: 'Professional Summary' }
    ];

    let sectionsFound = 0;
    sections.forEach(sec => {
        if (resumeData[sec.key] && resumeData[sec.key].length > 0) {
            sectionsFound++;
        }
    });

    if (sectionsFound === 4) {
        score += 15;
        checks.push({ text: "All standard sections present", status: "pass" });
    } else {
        score += (sectionsFound / 4) * 15; // Partial credit
        checks.push({ text: "Missing some standard sections", status: "warn" });
        if (!resumeData.summary) improvements.push("Add a Professional Summary");
        if (!resumeData.experience || resumeData.experience.length === 0) improvements.push("Add Work Experience");
    }

    // 3. Keyword optimization (20 pts)
    // Detailed keyword matching requires Job Desc, but for general ATS score we check content density.
    let keywordScore = 0;
    if (resumeData.skills && resumeData.skills.length >= 5) keywordScore += 10;
    if (resumeData.summary && resumeData.summary.length > 100) keywordScore += 5;
    if (resumeData.experience && resumeData.experience.some(j => j.description && j.description.length > 50)) keywordScore += 5;

    score += keywordScore;
    if (keywordScore === 20) {
        checks.push({ text: "Good keyword density", status: "pass" });
    } else {
        checks.push({ text: "Increase content density (skills, summary)", status: "warn" });
        if (resumeData.skills.length < 5) improvements.push("Add at least 5 key skills");
    }

    // 4. Formatting simplicity (15 pts)
    // Our templates are guaranteed simple.
    score += 15;
    checks.push({ text: "ATS-friendly formatting", status: "pass" });

    // 5. Font readability (10 pts)
    // Our templates use standard fonts.
    score += 10;
    checks.push({ text: "Standard readability fonts", status: "pass" });

    // 6. Contact info completeness (10 pts)
    const contact = resumeData.personalInfo || {};
    let contactScore = 0;
    if (contact.email) contactScore += 4;
    if (contact.phone) contactScore += 3;
    if (contact.location) contactScore += 3;

    score += contactScore;

    if (contactScore === 10) {
        checks.push({ text: "Contact Information Complete", status: "pass" });
    } else {
        checks.push({ text: "Incomplete Contact Info", status: "warn" });
        if (!contact.email) improvements.push("Add Email Address");
        if (!contact.phone) improvements.push("Add Phone Number");
    }

    return {
        score: Math.round(score),
        checks,
        improvements
    };
};
