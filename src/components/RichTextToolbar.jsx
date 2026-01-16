import React, { useState, useEffect, useRef } from 'react';

export default function RichTextToolbar({ position, targetElement, onClose }) {
    const toolbarRef = useRef(null);

    useEffect(() => {
        if (toolbarRef.current && position) {
            toolbarRef.current.style.top = `${position.top}px`;
            toolbarRef.current.style.left = `${position.left}px`;
        }
    }, [position]);

    const applyFormat = (command, value = null) => {
        // Apply to current selection
        document.execCommand(command, false, value);

        // Trigger input event to save changes
        if (targetElement) {
            const event = new Event('input', { bubbles: true });
            targetElement.dispatchEvent(event);
        }
    };

    const toggleFormat = (command) => {
        const isActive = document.queryCommandState(command);
        applyFormat(command);
        return !isActive;
    };

    return (
        <div ref={toolbarRef} className="rich-text-toolbar">
            {/* Basic Formatting */}
            <button
                onClick={() => toggleFormat('bold')}
                className={`toolbar-btn ${document.queryCommandState('bold') ? 'active' : ''}`}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </button>

            <button
                onClick={() => toggleFormat('italic')}
                className={`toolbar-btn ${document.queryCommandState('italic') ? 'active' : ''}`}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </button>

            <button
                onClick={() => toggleFormat('underline')}
                className={`toolbar-btn ${document.queryCommandState('underline') ? 'active' : ''}`}
                title="Underline (Ctrl+U)"
            >
                <u>U</u>
            </button>

            <span className="toolbar-divider"></span>

            {/* Font Size */}
            <select
                onChange={(e) => applyFormat('fontSize', e.target.value)}
                className="toolbar-select"
                defaultValue=""
            >
                <option value="">Size</option>
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="7">X-Large</option>
            </select>

            <span className="toolbar-divider"></span>

            {/* Alignment */}
            <button
                onClick={() => applyFormat('justifyLeft')}
                className="toolbar-btn"
                title="Align Left"
            >
                ⬅️
            </button>

            <button
                onClick={() => applyFormat('justifyCenter')}
                className="toolbar-btn"
                title="Align Center"
            >
                ↔️
            </button>

            <button
                onClick={() => applyFormat('justifyRight')}
                className="toolbar-btn"
                title="Align Right"
            >
                ➡️
            </button>

            <span className="toolbar-divider"></span>

            {/* Lists */}
            <button
                onClick={() => applyFormat('insertUnorderedList')}
                className="toolbar-btn"
                title="Bullet List"
            >
                • List
            </button>

            <span className="toolbar-divider"></span>

            {/* Clear Formatting */}
            <button
                onClick={() => applyFormat('removeFormat')}
                className="toolbar-btn"
                title="Clear Formatting"
            >
                ✕
            </button>

            {/* Close */}
            <button
                onClick={onClose}
                className="toolbar-btn toolbar-close"
            >
                Done
            </button>
        </div>
    );
}
