import React, { useState } from 'react';
import { Printer } from 'lucide-react';

const ExportButtons = () => {
    const [loading, setLoading] = useState(false);

    const handlePrintPDF = () => {
        const preview = document.getElementById('resume-preview');
        if (!preview) return;

        setLoading(true);
        const clone = preview.cloneNode(true);
        clone.id = 'print-clone';
        clone.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 210mm; min-height: 297mm;
            margin: 0; padding: ${getComputedStyle(preview).padding};
            box-shadow: none; z-index: 999999;
            background: white; overflow: visible;
        `;
        const root = document.getElementById('root');
        root.style.display = 'none';
        document.body.appendChild(clone);
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.removeChild(clone);
                root.style.display = '';
                document.body.style.margin = '';
                document.body.style.padding = '';
                setLoading(false);
            }, 500);
        }, 200);
    };

    return (
        <button onClick={handlePrintPDF} disabled={loading}
            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition disabled:opacity-50 text-sm font-medium"
            title="Opens print dialog — select 'Save as PDF'"
        >
            <Printer size={16} />
            {loading ? 'Preparing...' : 'Download PDF'}
        </button>
    );
};

export default ExportButtons;
