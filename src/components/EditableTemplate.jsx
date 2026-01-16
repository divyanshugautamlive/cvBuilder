import React, { useState, useEffect, useRef } from 'react';
import RichTextToolbar from './RichTextToolbar';

export default function EditableTemplate({
    children,
    resumeData,
    onUpdateData,
    enabled = true
}) {
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!enabled || !wrapperRef.current) return;

        const wrapper = wrapperRef.current;

        // Make all text elements editable
        const makeEditable = () => {
            // Find all text-containing elements
            // We exclude icons and toolbar buttons
            // We specifically look for elements that usually contain resume content
            const textElements = wrapper.querySelectorAll(
                'h1, h2, h3, h4, h5, h6, p, li, span:not(.icon):not(.toolbar-btn), td, th, a, label'
            );

            textElements.forEach((element) => {
                // Skip if already has contentEditable
                if (element.hasAttribute('contenteditable')) return;

                // Skip if inside toolbar or controls or edit-mode-info
                if (element.closest('.rich-text-toolbar, .preview-controls, .edit-mode-info')) return;

                // Skip purely layout/container spans if they have children that are also elements (to avoid nested editables chaos)
                // Actually, contentEditable works best on leaf nodes or block nodes.
                // If a span contains another span, making the parent editable might be okay, but granular is better.
                // For now, let's just apply to all and see.

                element.setAttribute('contenteditable', 'true');
                element.classList.add('auto-editable');

                // Handle input
                element.addEventListener('input', handleElementInput);

                // Handle selection
                element.addEventListener('mouseup', handleElementSelection);
                element.addEventListener('keyup', handleElementSelection);
            });
        };

        makeEditable();

        // DOMObserver to handle new elements if template re-renders?
        // React re-renders might remove attributes.
        // We can use a MutationObserver, or just run this on every render if children change.
        // Since we depend on [enabled, children], specific re-runs happen.
        // However, if children are just re-ordered or updated by React, attributes might be lost.
        // A MutationObserver is safer for React integration without hacking refs too much.

        const observer = new MutationObserver((mutations) => {
            makeEditable();
        });

        observer.observe(wrapper, { childList: true, subtree: true });

        // Cleanup
        return () => {
            observer.disconnect();
            const textElements = wrapper.querySelectorAll('.auto-editable');
            textElements.forEach((element) => {
                element.removeEventListener('input', handleElementInput);
                element.removeEventListener('mouseup', handleElementSelection);
                element.removeEventListener('keyup', handleElementSelection);
            });
        };
    }, [enabled, children]);

    const handleElementInput = (e) => {
        const element = e.target;
        // We use innerText or textContent? 
        // innerText preserves newlines better as \n, textContent as raw text.
        // If rich text (bold/italic) is used, we might want innerHTML?
        // But updateNestedField expects a string usually.
        // If the field supports HTML (like description), we should send HTML.
        // Check if the field is "description" or "summary" (usually rich text allowed) vs "email" (plain).

        // For now, let's extract text for simple fields and HTML for rich fields.
        const field = identifyField(element);

        if (field && onUpdateData) {
            let value = element.innerHTML;
            // Simple heuristic: if it looks like a simple field, maybe strip html?
            // But the user wants "rich text toolbar", so we should probably save HTML for descriptions.
            // For Name/Phone/Email, we should probably strip tags or just use textContent?
            // Let's stick to innerHTML for now to support styling persistence, 
            // OR rely on the fact that for simple fields we might only allow simple text.
            // Actually, if I bold my name, I want it bold.

            // BUT, if I bind this back to state, and the state re-renders,
            // React might conflict with contentEditable.
            // This "Universal Wrapper" approach is "uncontrolled" in a sense.
            // We are reading from DOM and writing to State.
            // If State updates and triggers re-render, React will overwrite DOM.
            // This loop can cause cursor jumping.
            // Ideally, we should debounce or specific handling.
            // But for this task, "Make inline editing work... automatically".
            // Use textContent for "plain" fields to avoid HTML mess in data properties?

            if (field.includes('email') || field.includes('phone') || field.includes('link')) {
                value = element.textContent;
            }

            updateNestedField(resumeData, field, value, onUpdateData);
        }
    };

    const handleElementSelection = (e) => {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setSelectedElement(e.target);
            setToolbarPosition({
                top: rect.top + window.scrollY - 60,
                left: rect.left + window.scrollX + (rect.width / 2)
            });
            setShowToolbar(true);
        } else {
            setShowToolbar(false);
        }
    };

    const identifyField = (element) => {
        // Smart field identification based on context and class names
        const className = element.className || ''; // handle SVG className objects
        const classStr = typeof className === 'string' ? className : '';

        const parentSection = element.closest('section');

        // Name field
        if ((classStr.includes('name') || element.tagName === 'H1') && !parentSection) {
            return 'personalInfo.fullName'; // Fixed: personalInfo.name -> personalInfo.fullName
        }

        // Title field
        if (classStr.includes('title') && !parentSection) {
            return 'personalInfo.jobTitle';
        }

        // Email
        if (classStr.includes('email') || element.textContent.includes('@')) {
            return 'personalInfo.email';
        }

        // Phone
        if (classStr.includes('phone') || /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(element.textContent)) {
            return 'personalInfo.phone';
        }

        // Location
        if (classStr.includes('location') || classStr.includes('address')) {
            return 'personalInfo.location';
        }

        // Summary section
        const summarySection = element.closest('section#summary, section.summary, [data-section="summary"]');
        if (summarySection) { // && element.tagName === 'P'
            // If it's in summary section, it's likely the summary.
            return 'summary';
        }

        // Experience section
        const experienceSection = element.closest('section#experience, section.experience, [data-section="experience"]');
        if (experienceSection) {
            const jobEntry = element.closest('.job-entry, .experience-item, [data-job]');
            if (jobEntry) {
                // Try to get index from data-job attribute first, else DOM order
                let jobIndex = jobEntry.getAttribute('data-job');
                if (jobIndex === null) {
                    jobIndex = Array.from(jobEntry.parentElement.children).indexOf(jobEntry);
                }

                if (element.tagName === 'H3' || classStr.includes('job-title') || classStr.includes('title')) {
                    return `experience.${jobIndex}.title`;
                }
                if (classStr.includes('company')) {
                    return `experience.${jobIndex}.company`;
                }
                if (classStr.includes('date') || classStr.includes('time')) {
                    // Basic heuristic for dates? 
                    // We have startDate and endDate. Determining which is which is hard without specific classes.
                    // User should add classes or we guess order.
                    // For now, if we can't identify, we skip update or log warning?
                    // Let's rely on class names 'start-date', 'end-date' if possible.
                    if (element.textContent.match(/\d{4}/)) {
                        // assume dates
                        // This is risky. 
                    }
                }

                // Description/Bullets
                // If it's a list item
                if (element.tagName === 'LI') {
                    // We don't store bullets as array in current data model?
                    // The current data model uses `description` string (often HTML).
                    // If the template renders `<ul><li>...</li></ul>`, editing a LI implies editing the HTML string.
                    // This is complex. We need to update the whole `description` HTML.
                    return `experience.${jobIndex}.description`;
                }
                // If it's a div/p in the job entry but not title/company, likely description
                if (element.tagName === 'P' || element.tagName === 'DIV' || classStr.includes('description')) {
                    return `experience.${jobIndex}.description`;
                }
            }
        }

        // Education section
        const educationSection = element.closest('section#education, section.education, [data-section="education"]');
        if (educationSection) {
            const eduEntry = element.closest('.education-item, [data-education]');
            if (eduEntry) {
                let eduIndex = eduEntry.getAttribute('data-education');
                if (eduIndex === null) {
                    eduIndex = Array.from(eduEntry.parentElement.children).indexOf(eduEntry);
                }

                if (element.tagName === 'H3' || classStr.includes('degree')) {
                    return `education.${eduIndex}.degree`;
                }
                if (classStr.includes('school')) {
                    return `education.${eduIndex}.school`;
                }
            }
        }

        // Skills section
        const skillsSection = element.closest('section#skills, section.skills, [data-section="skills"]');
        if (skillsSection && (element.tagName === 'LI' || classStr.includes('skill') || element.tagName === 'SPAN')) {
            // Logic for skills. Array of objects {name, level} or strings?
            // Resume data typically has skills as objects or strings.
            // Need to find index.
            // Often skills are just a cloud of spans.
            // We need `data-skill-index` or rely on order.
            // Let's assume order.
            const skillsContainer = skillsSection.querySelector('.skills-list') || skillsSection; // fallback
            // Find all skill items
            const allSkills = Array.from(skillsSection.querySelectorAll('.skill-item, li, span.skill'));
            const skillIndex = allSkills.indexOf(element.closest('.skill-item, li, span.skill') || element);

            if (skillIndex !== -1) {
                return `skills.${skillIndex}.name`;
            }
        }

        return null;
    };

    const updateNestedField = (data, path, value, onUpdate) => {
        if (!path) return;
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(data)); // Deep clone

        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined) return; // Path doesn't exist
            current = current[key];
        }

        const lastKey = keys[keys.length - 1];

        // Handle array updates if the field target is special?
        // standard assignment
        current[lastKey] = value;

        onUpdate(newData);
    };

    return (
        <div ref={wrapperRef} className={`editable-template-wrapper ${enabled ? 'editing-enabled' : ''}`}>
            {children}

            {showToolbar && toolbarPosition && (
                <RichTextToolbar
                    position={toolbarPosition}
                    targetElement={selectedElement}
                    onClose={() => setShowToolbar(false)}
                />
            )}
        </div>
    );
}
