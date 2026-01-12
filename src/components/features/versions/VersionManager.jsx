import React, { useState, useEffect } from 'react';
import useResumeStore from '../../../store/useResumeStore';
import '../../../styles/version-manager.css';

/**
 * Version Manager - Save, load, and manage multiple resume versions
 */
const VersionManager = () => {
    const { resumeData, updateSection } = useResumeStore();
    const [versions, setVersions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [versionName, setVersionName] = useState('');

    useEffect(() => {
        loadVersions();
    }, []);

    const loadVersions = () => {
        try {
            // Load all versions from localStorage
            const savedVersions = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('resume-version:')) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        savedVersions.push(JSON.parse(data));
                    }
                }
            }
            // Sort by date, newest first
            savedVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setVersions(savedVersions);
        } catch (error) {
            console.error('Error loading versions:', error);
        }
    };

    const saveVersion = () => {
        const name = versionName.trim() || `Version ${versions.length + 1}`;
        const version = {
            id: `resume-version:${Date.now()}`,
            name,
            data: { ...resumeData },
            createdAt: new Date().toISOString(),
            template: resumeData.selectedTemplate
        };

        try {
            localStorage.setItem(version.id, JSON.stringify(version));
            loadVersions();
            setVersionName('');
            alert(`Saved: ${name}`);
        } catch (error) {
            console.error('Error saving version:', error);
            alert('Failed to save version');
        }
    };

    const loadVersion = (versionId) => {
        try {
            const data = localStorage.getItem(versionId);
            if (data) {
                const version = JSON.parse(data);
                // Update all resume sections
                Object.keys(version.data).forEach(key => {
                    updateSection(key, version.data[key]);
                });
                setShowModal(false);
                alert(`Loaded: ${version.name}`);
            }
        } catch (error) {
            console.error('Error loading version:', error);
            alert('Failed to load version');
        }
    };

    const deleteVersion = (versionId, versionName) => {
        if (confirm(`Delete "${versionName}"?`)) {
            try {
                localStorage.removeItem(versionId);
                loadVersions();
            } catch (error) {
                console.error('Error deleting version:', error);
            }
        }
    };

    const duplicateResume = () => {
        const name = prompt('Name for duplicated resume:',
            `${resumeData.personalInfo?.fullName || 'Resume'} - Copy`);
        if (!name) return;

        const version = {
            id: `resume-version:${Date.now()}`,
            name,
            data: { ...resumeData },
            createdAt: new Date().toISOString(),
            template: resumeData.selectedTemplate
        };

        try {
            localStorage.setItem(version.id, JSON.stringify(version));
            loadVersions();
            alert(`Duplicated as: ${name}`);
        } catch (error) {
            console.error('Error duplicating:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <button onClick={() => setShowModal(true)} className="version-button">
                📚 Versions ({versions.length})
            </button>

            {showModal && (
                <>
                    <div className="version-overlay" onClick={() => setShowModal(false)} />
                    <div className="version-modal">
                        <div className="version-modal-header">
                            <h3>📚 Resume Versions</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="version-close-btn"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Save New Version */}
                        <div className="version-save-section">
                            <input
                                type="text"
                                value={versionName}
                                onChange={(e) => setVersionName(e.target.value)}
                                placeholder="Version name (e.g., Google Application)"
                                className="version-name-input"
                            />
                            <button onClick={saveVersion} className="version-save-btn">
                                💾 Save Current
                            </button>
                            <button onClick={duplicateResume} className="version-duplicate-btn">
                                📄 Duplicate
                            </button>
                        </div>

                        {/* Versions List */}
                        <div className="versions-list">
                            {versions.length === 0 ? (
                                <div className="no-versions">
                                    <p>No saved versions yet</p>
                                    <p className="no-versions-hint">Save versions to track different resume variations</p>
                                </div>
                            ) : (
                                versions.map((version) => (
                                    <div key={version.id} className="version-card">
                                        <div className="version-info">
                                            <h4>{version.name}</h4>
                                            <p className="version-date">{formatDate(version.createdAt)}</p>
                                            <p className="version-template">Template: {version.template}</p>
                                        </div>
                                        <div className="version-actions">
                                            <button
                                                onClick={() => loadVersion(version.id)}
                                                className="version-load-btn"
                                            >
                                                Load
                                            </button>
                                            <button
                                                onClick={() => deleteVersion(version.id, version.name)}
                                                className="version-delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default VersionManager;
