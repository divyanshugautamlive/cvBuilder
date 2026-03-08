/**
 * GTM DataLayer Push Utility
 * 
 * This file provides helper functions to push custom events to the 
 * Google Tag Manager dataLayer. These events correspond to the triggers 
 * defined in gtm-container-ga4.json.
 * 
 * USAGE: Import and call these functions from your React components
 * wherever the corresponding user action occurs.
 */

// Initialize dataLayer if not already present
window.dataLayer = window.dataLayer || [];

/**
 * Generic dataLayer push
 */
const pushEvent = (eventName, params = {}) => {
    window.dataLayer.push({
        event: eventName,
        ...params,
    });
};

// ─── Form Wizard ─────────────────────────────────────────────

export const trackFormWizardStep = (stepNumber, stepName) => {
    pushEvent('form_wizard_step', {
        event_category: 'resume_builder',
        step_number: stepNumber,
        step_name: stepName,
    });
};

export const trackFormWizardComplete = () => {
    pushEvent('form_wizard_complete', {
        event_category: 'resume_builder',
        event_label: 'all_steps_completed',
    });
};

// ─── Template ────────────────────────────────────────────────

export const trackTemplateSwitch = (templateName) => {
    pushEvent('template_switch', {
        event_category: 'resume_builder',
        template_name: templateName,
    });
};

// ─── Resume Export ───────────────────────────────────────────

export const trackResumeExport = (format, templateName) => {
    pushEvent('resume_export', {
        event_category: 'export',
        export_format: format,
        template_name: templateName,
    });
};

export const trackResumeExportSuccess = (format) => {
    pushEvent('resume_export_success', {
        event_category: 'export',
        export_format: format,
    });
};

export const trackResumeExportError = (format, errorMessage) => {
    pushEvent('resume_export_error', {
        event_category: 'export',
        export_format: format,
        event_label: errorMessage,
    });
};

// ─── File Upload / Parse ─────────────────────────────────────

export const trackFileUpload = (fileType) => {
    pushEvent('file_upload', {
        event_category: 'resume_import',
        file_type: fileType,
    });
};

export const trackFileParseSuccess = (fileType) => {
    pushEvent('file_parse_success', {
        event_category: 'resume_import',
        file_type: fileType,
    });
};

export const trackFileParseError = (fileType, errorMessage) => {
    pushEvent('file_parse_error', {
        file_type: fileType,
        event_label: errorMessage,
    });
};

// ─── Job Matcher ─────────────────────────────────────────────

export const trackJobMatchAnalyze = (matchScore) => {
    pushEvent('job_match_analyze', {
        event_category: 'job_matching',
        match_score: matchScore,
    });
};

export const trackJobMatchAddSkill = (skillName) => {
    pushEvent('job_match_add_skill', {
        event_category: 'job_matching',
        skill_added: skillName,
    });
};

// ─── ATS Score ───────────────────────────────────────────────

export const trackATSScoreCalculated = (score) => {
    pushEvent('ats_score_calculated', {
        event_category: 'resume_analysis',
        ats_score: score,
    });
};

// ─── AI Assist ───────────────────────────────────────────────

export const trackAIAssistOpen = (context) => {
    pushEvent('ai_assist_open', {
        event_category: 'ai_features',
        ai_context: context,
    });
};

export const trackAIAssistGenerate = (context, prompt) => {
    pushEvent('ai_assist_generate', {
        event_category: 'ai_features',
        ai_context: context,
        event_label: prompt,
    });
};

// ─── Cover Letter ────────────────────────────────────────────

export const trackCoverLetterGenerate = () => {
    pushEvent('cover_letter_generate', {
        event_category: 'cover_letter',
    });
};

export const trackCoverLetterExport = (format) => {
    pushEvent('cover_letter_export', {
        event_category: 'cover_letter',
        export_format: format,
    });
};

// ─── Version Management ──────────────────────────────────────

export const trackVersionSave = (versionName) => {
    pushEvent('version_save', {
        event_category: 'version_management',
        version_name: versionName,
    });
};

export const trackVersionLoad = (versionName) => {
    pushEvent('version_load', {
        event_category: 'version_management',
        version_name: versionName,
    });
};

export const trackVersionDelete = (versionName) => {
    pushEvent('version_delete', {
        event_category: 'version_management',
        version_name: versionName,
    });
};

export const trackVersionDuplicate = (versionName) => {
    pushEvent('version_duplicate', {
        event_category: 'version_management',
        version_name: versionName,
    });
};

// ─── UI / Navigation ─────────────────────────────────────────

export const trackInlineEditToggle = (isEnabled) => {
    pushEvent('inline_edit_toggle', {
        event_category: 'resume_builder',
        edit_mode: isEnabled ? 'enabled' : 'disabled',
    });
};

export const trackViewSwitch = (viewName) => {
    pushEvent('view_switch', {
        event_category: 'navigation',
        active_view: viewName,
    });
};

export const trackCTAClick = (ctaLabel) => {
    pushEvent('cta_click', {
        event_category: 'engagement',
        event_label: ctaLabel,
    });
};

export const trackImportResumeClick = () => {
    pushEvent('import_resume_click', {
        event_category: 'engagement',
    });
};

export default pushEvent;
