import React from 'react';
import useResumeStore from '../../../store/useResumeStore';

/**
 * Quick Actions - Provides quick duplicate and other actions
 */
const QuickActions = () => {
    const { resumeData, updateSection } = useResumeStore();

    const quickDuplicate = () => {
        const name = prompt('Name for the copy:',
            `${resumeData.personalInfo?.fullName || 'Resume'} - Copy`);
        if (!name) return;

        // Create a copy with a new name
        const copy = {
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                fullName: name
            }
        };

        // Save to localStorage as a version
        const version = {
            id: `resume-version:${Date.now()}`,
            name,
            data: copy,
            createdAt: new Date().toISOString(),
            template: resumeData.selectedTemplate
        };

        try {
            localStorage.setItem(version.id, JSON.stringify(version));
            alert(`Created copy: ${name}\n\nYou can load it from the Versions menu.`);
        } catch (error) {
            console.error('Error duplicating:', error);
            alert('Failed to create copy');
        }
    };

    const resetResume = () => {
        if (confirm('Are you sure you want to clear all data and start fresh?')) {
            // Clear all sections
            updateSection('personalInfo', { fullName: '', email: '', phone: '', location: '', linkedin: '' });
            updateSection('summary', '');
            updateSection('experience', []);
            updateSection('education', []);
            updateSection('skills', []);
            updateSection('certifications', []);
            alert('Resume cleared. Start fresh!');
        }
    };

    return (
        <div className="quick-actions">
            <button onClick={quickDuplicate} className="quick-action-btn" title="Create a copy of this resume">
                📄 Quick Duplicate
            </button>
            <button onClick={resetResume} className="quick-action-btn danger" title="Clear all data">
                🗑️ Clear All
            </button>
        </div>
    );
};

export default QuickActions;
