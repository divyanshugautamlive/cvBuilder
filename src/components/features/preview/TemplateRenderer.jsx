import React, { useRef, useState, useEffect } from 'react';
import useResumeStore from '../../../store/useResumeStore';
import EditableTemplate from '../../EditableTemplate';

// ATS-Approved Templates Only
import ClassicTemplate from '../../templates/ClassicTemplate';
import MinimalistTemplate from '../../templates/MinimalistTemplate';
import ModernTemplate from '../../templates/ModernTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import TechTemplate from '../../templates/TechTemplate';
import EntryLevelTemplate from '../../templates/EntryLevelTemplate';
import JupiterTemplate from '../../templates/JupiterTemplate';
import MarsTemplate from '../../templates/MarsTemplate';
import BlankTemplate from '../../templates/BlankTemplate';


const TemplateRenderer = ({ editable = false }) => {
    const { resumeData, setResumeData } = useResumeStore();
    const { selectedTemplate } = resumeData;
    
    const wrapperRef = useRef(null);
    const resumeRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    // Dynamic scaling logic
    useEffect(() => {
        const updateScale = () => {
            if (!wrapperRef.current) return;
            const parent = wrapperRef.current.parentElement;
            if (!parent) return;
            
            const parentWidth = parent.clientWidth;
            // 210mm in pixels at 96 DPI is approx 794px
            const targetWidth = 794;
            
            // Give some padding on mobile
            if (parentWidth < targetWidth + 16) {
                setScale((parentWidth - 16) / targetWidth);
            } else {
                setScale(1);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        
        let observer;
        if (typeof MutationObserver !== 'undefined' && wrapperRef.current.parentElement) {
            observer = new MutationObserver(updateScale);
            observer.observe(wrapperRef.current.parentElement, { attributes: true });
        }

        return () => {
            window.removeEventListener('resize', updateScale);
            if (observer) observer.disconnect();
        };
    }, []);

    // Page count observer logic
    useEffect(() => {
        if (!resumeRef.current) return;

        const updatePageCount = () => {
            const el = resumeRef.current;
            if (!el) return;
            const height = el.scrollHeight;
            // 297mm in pixels at 96 DPI is 1122.5px
            const pageHeightPx = 1122.5;
            const pages = Math.max(1, Math.ceil(height / pageHeightPx));
            setPageCount(pages);
        };

        let resizeObserver;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(updatePageCount);
            resizeObserver.observe(resumeRef.current);
        }
        
        updatePageCount();

        return () => {
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);

    const renderTemplate = () => {
        const props = {
            data: resumeData,
            templateSettings: resumeData.templateSettings || { accentColor: '', density: 'normal' },
            sectionOrder: resumeData.sectionOrder || ['summary', 'experience', 'education', 'skills', 'certifications'],
            onUpdateData: setResumeData,
            editable: false
        };

        const TemplateComponent = (() => {
            switch (selectedTemplate) {
                case 'classic': return ClassicTemplate;
                case 'minimalist': return MinimalistTemplate;
                case 'modern': return ModernTemplate;
                case 'executive': return ExecutiveTemplate;
                case 'tech': return TechTemplate;
                case 'entrylevel': return EntryLevelTemplate;
                case 'jupiter': return JupiterTemplate;
                case 'mars': return MarsTemplate;
                case 'blank': return BlankTemplate;
                default: return ExecutiveTemplate;
            }
        })();

        return <TemplateComponent {...props} />;
    };

    return (
        <div ref={wrapperRef} className="w-full flex justify-center items-start overflow-hidden print:overflow-visible">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '210mm',
                    minHeight: '297mm',
                    marginBottom: `calc(297mm * (${scale} - 1))`,
                    boxSizing: 'border-box',
                    transition: 'transform 0.15s ease-out'
                }}
                className="print:transform-none print:margin-0"
            >
                <div
                    ref={resumeRef}
                    id="resume-preview"
                    className="resume-section bg-white shadow-xl mx-auto print:shadow-none relative animate-in fade-in zoom-in-95 duration-300"
                    style={{
                        width: '100%',
                        minHeight: '297mm',
                        padding: '20mm',
                        boxSizing: 'border-box',
                        color: '#000000',
                        backgroundColor: '#ffffff'
                    }}
                >
                    {/* Visual Page Break Guides (Screen Only) */}
                    {Array.from({ length: pageCount - 1 }).map((_, idx) => {
                        const topPos = (idx + 1) * 297; // in mm
                        return (
                            <div
                                key={idx}
                                className="absolute left-0 right-0 border-t-2 border-dashed border-red-400/70 pointer-events-none flex items-center justify-end pr-8 print:hidden"
                                style={{
                                    top: `${topPos}mm`,
                                    transform: 'translateY(-50%)',
                                    zIndex: 40
                                }}
                            >
                                <span className="bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-md pointer-events-none select-none">
                                    Page {idx + 1} End (Print Cutoff)
                                </span>
                            </div>
                        );
                    })}

                    <EditableTemplate
                        resumeData={resumeData}
                        onUpdateData={setResumeData}
                        enabled={editable}
                    >
                        {renderTemplate()}
                    </EditableTemplate>
                </div>
            </div>
        </div>
    );
};

export default TemplateRenderer;
