import { jsPDF } from 'jspdf';

// ── Helpers ──────────────────────────────────────────────────────────────

const stripHtml = (html) => {
    if (!html) return '';
    return html
        .replace(/<li[^>]*>/gi, '\n').replace(/<\/li>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n').trim();
};

const parseBullets = (desc) => {
    const t = stripHtml(desc);
    if (!t) return [];
    return t.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        .map(l => l.replace(/^[•\-*]\s*/, ''));
};

const hex = (h) => {
    const c = h.replace('#', '');
    return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)];
};

const lighten = (rgb, amt = 0.85) => rgb.map(c => Math.min(255, c + Math.round((255 - c) * amt)));

// ── Template Style Configs ───────────────────────────────────────────────

const S = {
    classic: {
        headerAlign: 'center', headerBg: null, accentBar: 0,
        headerBorder: { width: 0.7, color: [0, 0, 0] },
        nameSize: 22, nameUpper: true,
        accent: [0, 0, 0], body: [30, 30, 30], muted: [100, 100, 100],
        headingStyle: 'center-upper', headingColor: [0, 0, 0],
        headingBorder: { width: 0, color: [0, 0, 0] },
        skillsMode: 'inline-pipe',
        companyStyle: 'normal',
        labels: { summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills', certifications: 'Certifications' },
    },
    minimalist: {
        headerAlign: 'left', headerBg: null, accentBar: 0,
        headerBorder: null,
        nameSize: 24, nameUpper: false,
        accent: [100, 116, 139], body: [51, 65, 85], muted: [148, 163, 184],
        headingStyle: 'tiny-upper', headingColor: [148, 163, 184],
        headingBorder: null,
        skillsMode: 'list',
        companyStyle: 'bold',
        labels: { summary: 'Profile', experience: 'Work History', education: 'Education', skills: 'Skills', certifications: 'Certifications' },
    },
    modern: {
        headerAlign: 'left', headerBg: null, accentBar: 0,
        headerBorder: { width: 0.7, color: [31, 41, 55] },
        nameSize: 22, nameUpper: true,
        accent: [31, 41, 55], body: [55, 65, 81], muted: [107, 114, 128],
        headingStyle: 'upper-underline', headingColor: [31, 41, 55],
        headingBorder: { width: 0.3, color: [209, 213, 219] },
        skillsMode: 'inline-dot',
        companyStyle: 'italic',
        labels: { summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills', certifications: 'Certifications' },
    },
    executive: {
        headerAlign: 'center', headerBg: null, accentBar: 0,
        headerBorder: { width: 1.4, color: [51, 65, 85] },
        nameSize: 26, nameUpper: true,
        accent: [51, 65, 85], body: [51, 65, 85], muted: [100, 116, 139],
        headingStyle: 'upper-underline', headingColor: [51, 65, 85],
        headingBorder: { width: 0.7, color: [203, 213, 225] },
        skillsMode: 'list',
        companyStyle: 'italic',
        labels: { summary: 'Executive Profile', experience: 'Professional Experience', education: 'Education', skills: 'Core Competencies', certifications: 'Certifications' },
    },
    tech: {
        headerAlign: 'left', headerBg: null, accentBar: 0,
        headerBorder: { width: 0.7, color: [156, 163, 175] },
        nameSize: 22, nameUpper: false, namePrefix: '> ',
        accent: [30, 58, 138], body: [55, 65, 81], muted: [107, 114, 128],
        headingStyle: 'hash', headingColor: [30, 58, 138],
        headingBorder: null,
        skillsMode: 'tags',
        companyStyle: 'accent',
        labels: { summary: 'Summary', experience: 'Experience_Log', education: 'Education', skills: 'Tech_Stack', certifications: 'Certs' },
    },
    entrylevel: {
        headerAlign: 'center', headerBg: null, accentBar: 0,
        headerBorder: null,
        nameSize: 22, nameUpper: true,
        accent: [13, 148, 136], body: [55, 65, 81], muted: [107, 114, 128],
        headingStyle: 'upper-underline', headingColor: [13, 148, 136],
        headingBorder: { width: 0.3, color: [229, 231, 235] },
        skillsMode: 'pills',
        companyStyle: 'accent',
        labels: { summary: 'Objective', experience: 'Experience', education: 'Education', skills: 'Core Strengths', certifications: 'Certifications' },
    },
    jupiter: {
        headerAlign: 'left', headerBg: hex('#f7fafc'), accentBar: 1.8,
        headerBorder: { width: 0.7, color: null }, // color = accent
        nameSize: 22, nameUpper: false,
        accent: hex('#1e6bb8'), body: hex('#4a5568'), muted: hex('#718096'),
        headingStyle: 'accent-bar', headingColor: null, // color = accent
        headingBorder: null,
        skillsMode: 'pills',
        companyStyle: 'accent',
        labels: { summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills', certifications: 'Certifications' },
    },
    mars: {
        headerAlign: 'center', headerBg: null, accentBar: 0,
        headerBorder: { width: 0.7, color: null }, // color = accent
        nameSize: 20, nameUpper: false,
        accent: hex('#2d3748'), body: hex('#2d3748'), muted: hex('#718096'),
        headingStyle: 'upper-underline', headingColor: null, // color = accent
        headingBorder: { width: 0.3, color: hex('#cbd5e0') },
        skillsMode: 'inline-comma',
        companyStyle: 'normal',
        labels: { summary: 'Summary', experience: 'Experience', education: 'Education', skills: 'Skills', certifications: 'Certifications' },
    },
    blank: {
        headerAlign: 'left', headerBg: null, accentBar: 0,
        headerBorder: null,
        nameSize: 20, nameUpper: false,
        accent: [60, 60, 60], body: [60, 60, 60], muted: [120, 120, 120],
        headingStyle: 'simple-upper', headingColor: [60, 60, 60],
        headingBorder: null,
        skillsMode: 'inline-comma',
        companyStyle: 'normal',
        labels: { summary: 'Summary', experience: 'Experience', education: 'Education', skills: 'Skills', certifications: 'Certifications' },
    },
};

// ── Main Export Function ─────────────────────────────────────────────────

export const exportResumeAsPDF = async (resumeData) => {
    const {
        personalInfo = {}, summary = '', experience = [], education = [],
        skills = [], certifications = [], templateSettings = {}
    } = resumeData;

    const templateId = resumeData.selectedTemplate || 'classic';
    const sectionOrder = resumeData.sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications'];

    // Get style config, use accent override from templateSettings
    const cfg = { ...(S[templateId] || S.classic) };
    if (templateSettings.accentColor) {
        cfg.accent = hex(templateSettings.accentColor);
    }
    // Resolve null colours to accent
    if (!cfg.headingColor) cfg.headingColor = cfg.accent;
    if (cfg.headerBorder && !cfg.headerBorder.color) cfg.headerBorder = { ...cfg.headerBorder, color: cfg.accent };

    const accentLight = lighten(cfg.accent, 0.85);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const PW = 210, PH = 297, ML = 16, MR = 16, MT = 10, MB = 14;
    const UW = PW - ML - MR;
    let y = MT;

    const lh = (pt, f = 1.5) => pt * 0.3528 * f;
    const checkSpace = (n) => { if (y + n > PH - MB) { doc.addPage(); y = MT; return true; } return false; };
    const sf = (sz, st = 'normal', c = cfg.body) => { doc.setFont('helvetica', st); doc.setFontSize(sz); doc.setTextColor(...c); };

    const wrap = (text, x, maxW, sz, st = 'normal', c = cfg.body) => {
        sf(sz, st, c);
        const lines = doc.splitTextToSize(text || '', maxW);
        const h = lh(sz);
        for (const line of lines) { checkSpace(h); doc.text(line, x, y); y += h; }
    };

    // ═══════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════
    const candidateName = personalInfo.fullName || 'Your Name';
    const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean);

    // Calculate header height
    let hH = 10 + lh(cfg.nameSize, 1.15);
    if (personalInfo.jobTitle && (templateId === 'jupiter' || templateId === 'tech')) hH += lh(10, 1.3) + 2;
    if (contactParts.length > 0) hH += lh(9, 1.2);
    hH += 6;

    // Accent bar
    if (cfg.accentBar > 0) {
        doc.setFillColor(...cfg.accent);
        doc.rect(0, 0, PW, cfg.accentBar, 'F');
    }

    // Header background
    const hTop = cfg.accentBar || 0;
    if (cfg.headerBg) {
        doc.setFillColor(...cfg.headerBg);
        doc.rect(0, hTop, PW, hH, 'F');
    }

    // Header border
    if (cfg.headerBorder) {
        doc.setDrawColor(...cfg.headerBorder.color);
        doc.setLineWidth(cfg.headerBorder.width);
        doc.line(0, hTop + hH, PW, hTop + hH);
    }

    y = hTop + 10;

    // Name
    const nameText = (cfg.namePrefix || '') + (cfg.nameUpper ? candidateName.toUpperCase() : candidateName);
    sf(cfg.nameSize, 'bold', hex('#1a202c'));
    if (cfg.headerAlign === 'center') {
        doc.text(nameText, PW / 2, y, { align: 'center' });
    } else {
        doc.text(nameText, ML, y);
    }
    y += lh(cfg.nameSize, 1.15);

    // Job title (Jupiter/Tech only)
    if (personalInfo.jobTitle && (templateId === 'jupiter' || templateId === 'tech')) {
        sf(10, 'bold', cfg.accent);
        const jt = personalInfo.jobTitle.toUpperCase();
        if (cfg.headerAlign === 'center') doc.text(jt, PW / 2, y, { align: 'center' });
        else doc.text(jt, ML, y);
        y += lh(10, 1.3) + 2;
    }

    // Contact
    if (contactParts.length > 0) {
        sf(9, 'normal', cfg.muted);
        const sep = templateId === 'modern' ? '  |  ' : '   |   ';
        const cs = contactParts.join(sep);
        if (cfg.headerAlign === 'center') doc.text(cs, PW / 2, y, { align: 'center' });
        else doc.text(cs, ML, y);
        y += lh(9, 1.2);
    }

    y = hTop + hH + 8;

    // ═══════════════════════════════════════
    // SECTION HEADING
    // ═══════════════════════════════════════
    const drawHeading = (label) => {
        checkSpace(10);
        const style = cfg.headingStyle;
        const hc = cfg.headingColor;

        if (style === 'accent-bar') {
            doc.setFillColor(...cfg.accent);
            doc.rect(ML, y - 4, 0.9, 5, 'F');
            sf(9.5, 'bold', hc);
            doc.text(label.toUpperCase(), ML + 3.5, y);
            y += lh(9.5, 1.0) + 3;
        } else if (style === 'hash') {
            sf(11, 'bold', hc);
            doc.text('# ' + label.toUpperCase(), ML, y);
            y += lh(11, 1.0) + 3;
        } else if (style === 'center-upper') {
            sf(11, 'bold', hc);
            doc.text(label.toUpperCase(), PW / 2, y, { align: 'center' });
            y += lh(11, 1.0) + 2;
        } else if (style === 'tiny-upper') {
            sf(8, 'bold', hc);
            doc.text(label.toUpperCase(), ML, y);
            y += lh(8, 1.0) + 3;
        } else {
            // 'upper-underline', 'simple-upper'
            sf(11, 'bold', hc);
            doc.text(label.toUpperCase(), ML, y);
            y += lh(11, 1.0) + 1;
            if (cfg.headingBorder) {
                doc.setDrawColor(...cfg.headingBorder.color);
                doc.setLineWidth(cfg.headingBorder.width);
                doc.line(ML, y, ML + UW, y);
                y += 2;
            }
            y += 1;
        }
    };

    // ═══════════════════════════════════════
    // SECTION RENDERERS
    // ═══════════════════════════════════════
    const L = cfg.labels;

    const renderSummary = () => {
        if (!summary) return;
        drawHeading(L.summary);
        wrap(summary, ML, UW, 9.5, 'normal', cfg.body);
        y += 5;
    };

    const renderExperience = () => {
        if (!experience || experience.length === 0) return;
        drawHeading(L.experience);
        experience.forEach((job, idx) => {
            const bullets = parseBullets(job.description);
            let eH = lh(11) + lh(10) + 4;
            bullets.forEach(b => { sf(9.5); eH += doc.splitTextToSize(b, UW - 8).length * lh(9.5); });
            if (eH < PH - MT - MB) checkSpace(eH);

            // Title + dates
            sf(11, 'bold', hex('#1a202c'));
            doc.text(job.title || '', ML, y);
            const ds = `${job.startDate || ''} - ${job.current ? 'Present' : (job.endDate || '')}`;
            sf(8.5, 'normal', cfg.muted);
            doc.text(ds, PW - MR, y, { align: 'right' });
            y += lh(11, 1.1);

            // Company
            const cs = cfg.companyStyle;
            if (cs === 'accent') sf(10, 'bold', cfg.accent);
            else if (cs === 'italic') sf(10, 'italic', cfg.body);
            else sf(10, 'normal', cfg.body);
            doc.text(job.company || '', ML, y);
            if (job.location) {
                const cw = doc.getTextWidth((job.company || '') + '  ');
                sf(9, 'normal', cfg.muted);
                doc.text('  ' + job.location, ML + cw, y);
            }
            y += lh(10, 1.1) + 1;

            // Bullets
            bullets.forEach(bt => {
                sf(9.5, 'normal', cfg.body);
                const wr = doc.splitTextToSize(bt, UW - 8);
                checkSpace(wr.length * lh(9.5));
                wr.forEach((line, li) => {
                    if (li === 0) { sf(9.5, 'normal', cfg.body); doc.text('-', ML + 1.5, y); }
                    doc.text(line, ML + 5, y);
                    y += lh(9.5);
                });
            });
            if (idx < experience.length - 1) y += 4;
        });
        y += 4;
    };

    const renderEducation = () => {
        if (!education || education.length === 0) return;
        drawHeading(L.education);
        education.forEach((edu, idx) => {
            checkSpace(lh(11) * 3);
            sf(11, 'bold', hex('#1a202c'));
            doc.text(edu.school || '', ML, y);
            const ds = edu.graduationDate || [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
            if (ds) { sf(8.5, 'normal', cfg.muted); doc.text(ds, PW - MR, y, { align: 'right' }); }
            y += lh(11, 1.1);
            const dl = [edu.degree, edu.field].filter(Boolean).join(' in ');
            if (dl) { sf(10, 'italic', cfg.body); doc.text(dl, ML, y); y += lh(10, 1.1); }
            if (idx < education.length - 1) y += 3;
        });
        y += 4;
    };

    const renderSkills = () => {
        if (!skills || skills.length === 0) return;
        drawHeading(L.skills);
        const names = skills.map(s => typeof s === 'string' ? s : s.name);
        const mode = cfg.skillsMode;

        if (mode === 'pills') {
            const pillH = 5.5, padX = 3.5, gap = 2.5;
            let rx = ML;
            names.forEach(name => {
                sf(8.5, 'bold', cfg.accent);
                const tw = doc.getTextWidth(name);
                const pw = tw + padX * 2;
                if (rx + pw > PW - MR) { rx = ML; y += pillH + gap; checkSpace(pillH + gap); }
                doc.setFillColor(...accentLight);
                doc.roundedRect(rx, y - 3.8, pw, pillH, 2.5, 2.5, 'F');
                doc.setDrawColor(...cfg.accent);
                doc.setLineWidth(0.2);
                doc.roundedRect(rx, y - 3.8, pw, pillH, 2.5, 2.5, 'S');
                sf(8.5, 'bold', cfg.accent);
                doc.text(name, rx + padX, y);
                rx += pw + gap;
            });
            y += pillH + 4;
        } else if (mode === 'tags') {
            const tagH = 5, padX = 3, gap = 2;
            let rx = ML;
            names.forEach(name => {
                sf(8, 'bold', cfg.accent);
                const tw = doc.getTextWidth(name);
                const pw = tw + padX * 2;
                if (rx + pw > PW - MR) { rx = ML; y += tagH + gap; checkSpace(tagH + gap); }
                doc.setDrawColor(...cfg.muted);
                doc.setLineWidth(0.2);
                doc.rect(rx, y - 3.5, pw, tagH, 'S');
                sf(8, 'bold', cfg.accent);
                doc.text(name, rx + padX, y);
                rx += pw + gap;
            });
            y += tagH + 4;
        } else if (mode === 'list') {
            names.forEach(name => {
                checkSpace(lh(9.5));
                sf(9.5, 'normal', cfg.body);
                doc.text('-  ' + name, ML, y);
                y += lh(9.5);
            });
            y += 3;
        } else {
            // inline-comma, inline-pipe, inline-dot
            const sep = mode === 'inline-pipe' ? '  |  ' : mode === 'inline-dot' ? '  -  ' : ',  ';
            sf(9.5, 'normal', cfg.body);
            const str = names.join(sep);
            const lines = doc.splitTextToSize(str, UW);
            for (const line of lines) { checkSpace(lh(9.5)); doc.text(line, ML, y); y += lh(9.5); }
            y += 3;
        }
    };

    const renderCertifications = () => {
        if (!certifications || certifications.length === 0) return;
        drawHeading(L.certifications);
        certifications.forEach(cert => {
            checkSpace(lh(9.5));
            const text = typeof cert === 'string' ? cert : (cert.name || cert.title || '');
            sf(9.5, 'normal', cfg.body);
            doc.text('-  ' + text, ML, y);
            y += lh(9.5);
        });
        y += 4;
    };

    // ═══════════════════════════════════════
    // RENDER IN ORDER
    // ═══════════════════════════════════════
    const R = { summary: renderSummary, skills: renderSkills, experience: renderExperience, education: renderEducation, certifications: renderCertifications };
    sectionOrder.forEach(k => { if (R[k]) R[k](); });

    // ═══════════════════════════════════════
    // SAVE
    // ═══════════════════════════════════════
    const fn = `${candidateName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}-Resume.pdf`;
    doc.save(fn);
    return true;
};
