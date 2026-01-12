import React, { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';
import { exportToPDF, exportToDOCX, exportToTXT } from '../../../utils/exportHelpers';

const ExportButtons = () => {
    const { resumeData } = useResumeStore();
    const [loading, setLoading] = useState(false);

    const handleExport = async (type) => {
        setLoading(true);
        try {
            if (type === 'pdf') {
                await exportToPDF('resume-preview');
            } else if (type === 'docx') {
                await exportToDOCX(resumeData);
            } else if (type === 'txt') {
                exportToTXT(resumeData);
            }
        } catch (e) {
            console.error(e);
            alert('Export failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleExport('pdf')}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
            >
                <FileText size={18} /> PDF
            </button>
            <button
                onClick={() => handleExport('docx')}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition"
            >
                <FileText size={18} /> DOCX
            </button>
            <button
                onClick={() => handleExport('txt')}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
            >
                <File size={18} /> TXT
            </button>
        </div>
    );
};

export default ExportButtons;
