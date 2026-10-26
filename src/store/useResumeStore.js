import { create } from 'zustand';
import { storage } from '../utils/storage';

const DEFAULT_RESUME_DATA = {
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
    selectedTemplate: "executive", // Default to executive template
    atsScore: 0,
    jobKeywords: { score: null, matched: [], missing: [] },
    parserConfidence: {}, // Map of field key -> boolean (false = low confidence parsed value)
    templateSettings: {
        accentColor: '',   // empty = use template default
        density: 'normal'  // 'compact', 'normal', 'relaxed'
    },
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
    theme: 'light' // 'light' or 'dark'
};

// Valid template IDs after cleanup
const VALID_TEMPLATES = ['classic', 'minimalist', 'modern', 'executive', 'tech', 'entrylevel', 'jupiter', 'mars', 'blank'];

const useResumeStore = create((set, get) => ({
    resumeData: (() => {
        const stored = storage.get('resume_data');
        if (stored && typeof stored === 'object') {
            const merged = {
                ...DEFAULT_RESUME_DATA,
                ...stored,
                personalInfo: {
                    ...DEFAULT_RESUME_DATA.personalInfo,
                    ...(stored.personalInfo && typeof stored.personalInfo === 'object' ? stored.personalInfo : {})
                },
                templateSettings: {
                    ...DEFAULT_RESUME_DATA.templateSettings,
                    ...(stored.templateSettings && typeof stored.templateSettings === 'object' ? stored.templateSettings : {})
                },
                sectionOrder: Array.isArray(stored.sectionOrder) && stored.sectionOrder.length > 0
                    ? stored.sectionOrder
                    : DEFAULT_RESUME_DATA.sectionOrder,
                experience: Array.isArray(stored.experience) ? stored.experience : [],
                education: Array.isArray(stored.education) ? stored.education : [],
                skills: Array.isArray(stored.skills) ? stored.skills : [],
                certifications: Array.isArray(stored.certifications) ? stored.certifications : [],
                selectedTemplate: VALID_TEMPLATES.includes(stored.selectedTemplate)
                    ? stored.selectedTemplate
                    : 'executive',
                theme: stored.theme || DEFAULT_RESUME_DATA.theme
            };
            delete merged.selectedThemeColor;
            return merged;
        }
        return DEFAULT_RESUME_DATA;
    })(),

    // Actions
    updatePersonalInfo: (info) => {
        const currentConfidence = get().resumeData.parserConfidence || {};
        const newConfidence = { ...currentConfidence };
        Object.keys(info).forEach(key => {
            newConfidence[key] = true;
        });
        const newData = {
            ...get().resumeData,
            personalInfo: { ...get().resumeData.personalInfo, ...info },
            parserConfidence: newConfidence
        };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    updateSection: (section, value) => {
        const currentConfidence = get().resumeData.parserConfidence || {};
        const newConfidence = { ...currentConfidence, [section]: true };
        const newData = {
            ...get().resumeData,
            [section]: value,
            parserConfidence: newConfidence
        };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    setTemplate: (templateId) => {
        // Only allow valid templates
        if (!VALID_TEMPLATES.includes(templateId)) {
            templateId = 'executive';
        }
        const newData = { ...get().resumeData, selectedTemplate: templateId };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    updateTemplateSettings: (settings) => {
        const newData = {
            ...get().resumeData,
            templateSettings: { ...get().resumeData.templateSettings, ...settings }
        };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    updateSectionOrder: (newOrder) => {
        const newData = { ...get().resumeData, sectionOrder: newOrder };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    resetData: () => {
        set({ resumeData: DEFAULT_RESUME_DATA });
        storage.set('resume_data', DEFAULT_RESUME_DATA);
    },

    // ATS Scoring Helper
    calculateScore: () => {
        return get().resumeData.atsScore;
    },

    updateJobMatchScore: (score, matched, missing) => {
        const newData = {
            ...get().resumeData,
            jobKeywords: { score, matched, missing }
        };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    setResumeData: (newData) => {
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    },

    setTheme: (theme) => {
        const currentData = get().resumeData;
        const newData = { ...currentData, theme };
        set({ resumeData: newData });
        storage.set('resume_data', newData);
    }
}));

export default useResumeStore;
