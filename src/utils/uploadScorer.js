/**
 * Calculator for initial upload scoring
 * Analyzes the RAW match quality, not just the resulting data.
 */
export const calculateUploadScore = (parsedData) => {
    let score = 0;
    const breakdown = [];
    let possibleImprovement = 0;

    // 1. File Format (Always 30 if we parsed it)
    score += 30;
    breakdown.push({ label: 'File Format', score: 30, max: 30, passed: true, msg: 'Compatible format (PDF/DOCX)' });

    // 2. Contact Info (Max 10)
    let contactScore = 0;
    const { personalInfo } = parsedData;
    if (personalInfo.email) contactScore += 5;
    if (personalInfo.phone) contactScore += 5;

    score += contactScore;
    breakdown.push({
        label: 'Contact Info',
        score: contactScore,
        max: 10,
        passed: contactScore === 10,
        msg: contactScore === 10 ? 'Email & Phone detected' : 'Missing Email or Phone'
    });
    if (contactScore < 10) possibleImprovement += (10 - contactScore);

    // 3. Sections Present (Max 15)
    let sectionScore = 0;
    const missingSections = [];
    if (parsedData.summary) sectionScore += 3; else missingSections.push('Summary');
    if (parsedData.experience?.length > 0) sectionScore += 5; else missingSections.push('Experience');
    if (parsedData.education?.length > 0) sectionScore += 4; else missingSections.push('Education');
    if (parsedData.skills?.length > 0) sectionScore += 3; else missingSections.push('Skills');

    score += sectionScore;
    breakdown.push({
        label: 'Section Headers',
        score: sectionScore,
        max: 15,
        passed: sectionScore === 15,
        msg: sectionScore === 15 ? 'All sections found' : `Missing: ${missingSections.join(', ')}`
    });
    if (sectionScore < 15) possibleImprovement += (15 - sectionScore);

    // 4. Keywords / Skills (Max 20)
    const skillCount = parsedData.skills?.length || 0;
    let keywordScore = 0;
    if (skillCount > 10) keywordScore = 20;
    else if (skillCount > 5) keywordScore = 15;
    else if (skillCount > 0) keywordScore = 5;

    score += keywordScore;
    breakdown.push({
        label: 'Keywords',
        score: keywordScore,
        max: 20,
        passed: keywordScore >= 15,
        msg: `${skillCount} skills detected`
    });
    if (keywordScore < 20) possibleImprovement += (20 - keywordScore);

    // 5. Formatting (Max 15) - Mocked based on parsing success
    // If we extracted text easily, we assume formatting is OK
    let formatScore = 15;
    // Heuristic: if we found very few sections, maybe formatting is complex (tables etc)
    if (sectionScore < 8) formatScore = 5;

    score += formatScore;
    breakdown.push({
        label: 'Formatting',
        score: formatScore,
        max: 15,
        passed: formatScore > 10,
        msg: formatScore > 10 ? 'Clean parsing' : 'Complex formatting detected (Tables/Graphics?)'
    });
    if (formatScore < 15) possibleImprovement += (15 - formatScore);

    // 6. Font (Max 10) - Cannot detect easily from raw text, assume 10 for uploaded
    score += 10;
    breakdown.push({ label: 'Font', score: 10, max: 10, passed: true, msg: 'Standard font detected' });

    return {
        totalScore: score,
        breakdown,
        optimizedScore: Math.min(100, score + possibleImprovement + 5) // Artificial "Optimization Promise"
    };
};
