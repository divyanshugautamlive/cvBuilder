import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer, FileText } from 'lucide-react';
import useResumeStore from '../../store/useResumeStore';
import { exportToDocx, exportToTxt } from '../../utils/export';

const ExportControls = ({ printRef }) => {
    const { resumeData } = useResumeStore();
    const [isExporting, setIsExporting] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_CV`,
        onAfterPrint: () => console.log('Printed successfully'),
    });

    const handleDownloadDocx = async () => {
        setIsExporting(true);
        try {
            await exportToDocx(resumeData);
        } catch (error) {
            console.error("Export failed", error);
        }
        setIsExporting(false);
    };

    const handleDownloadTxt = () => {
        exportToTxt(resumeData);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
            >
                <Printer size={18} /> PDF
            </button>
            <button
                onClick={handleDownloadDocx}
                disabled={isExporting}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
            >
                <Download size={18} /> {isExporting ? '...' : 'DOCX'}
            </button>
            <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
            >
                <FileText size={18} /> TXT
            </button>
        </div>
    );
};

export default ExportControls;
