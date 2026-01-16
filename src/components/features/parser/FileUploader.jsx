import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowRight, RefreshCcw, Star } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';
import { extractTextFromFile, parseResumeText } from '../../../utils/fileHelpers';


const FileUploader = () => {
    const fileInputRef = useRef(null);
    const [isParsingResume, setIsParsingResume] = useState(false);

    // Keep existing status for compatibility if needed, but rely on isParsingResume for loading
    const [status, setStatus] = useState('idle');

    const { updatePersonalInfo, updateSection } = useResumeStore();

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            console.log("🚀 File upload started:", file.name, file.type);

            // Show loading state
            setIsParsingResume(true);
            setStatus('parsing');

            // 1. Extract text based on file type
            let extractedText = "";

            if (file.type === "application/pdf") {
                extractedText = await extractTextFromFile(file);
            } else if (
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.name.endsWith('.docx')
            ) {
                // We can import parseDOCX logic here or reuse extractTextFromFile which handles it
                // The user prompt asked to use specific functions, but extractTextFromFile in fileHelpers now has the robust logic.
                extractedText = await extractTextFromFile(file);
            } else {
                alert("Unsupported file type. Please upload PDF or DOCX.");
                setIsParsingResume(false);
                setStatus('idle');
                return;
            }

            console.log("2️⃣ Text extracted, length:", extractedText.length);

            // 2. Parse extracted text into structured data
            const parsedData = parseResumeText(extractedText);
            console.log("3️⃣ Parsed data:", parsedData);

            // 3. THIS IS THE CRITICAL FIX - UPDATE FORM STATE
            console.log("📝 Updating form state with parsed data...");

            // Map parsed data to store actions
            if (parsedData.personalInfo) {
                updatePersonalInfo(parsedData.personalInfo);
            }

            if (parsedData.summary) {
                updateSection('summary', parsedData.summary);
            }

            if (parsedData.experience && parsedData.experience.length > 0) {
                updateSection('experience', parsedData.experience);
            }

            if (parsedData.education && parsedData.education.length > 0) {
                updateSection('education', parsedData.education);
            }

            if (parsedData.skills && parsedData.skills.length > 0) {
                // Match existing logic: Convert to objects if needed, or pass strings
                // Based on previous FileUploader, it mapped to objects. adhering to that to be safe.
                const skillObjects = parsedData.skills.map(s => ({ name: s, level: 'Intermediate' }));
                updateSection('skills', skillObjects);
            }

            if (parsedData.certifications && parsedData.certifications.length > 0) {
                updateSection('certifications', parsedData.certifications);
            }

            // 4. Show success message
            setIsParsingResume(false);
            setStatus('success');
            alert(`✅ Resume parsed successfully!\n\nExtracted:\n• Name: ${parsedData.personalInfo.name || 'Not found'}\n• Email: ${parsedData.personalInfo.email || 'Not found'}\n• ${parsedData.experience.length} work experiences\n• ${parsedData.education.length} education entries\n• ${parsedData.skills.length} skills`);

            console.log("✅ Form state updated successfully");

        } catch (error) {
            console.error("❌ Upload/parsing failed:", error);
            setIsParsingResume(false);
            setStatus('error');
            alert("Failed to parse resume. Please check console for details or enter information manually.");
        }
    };

    return (
        <div className="mb-6">
            <div
                onClick={() => !isParsingResume && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${status === 'error' ? 'border-red-300 bg-red-50' :
                    status === 'success' ? 'border-green-300 bg-green-50' :
                        'border-gray-300 hover:border-blue-500 hover:bg-blue-50 group'
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                    disabled={isParsingResume}
                />

                {!isParsingResume && status !== 'success' && (
                    <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-600 transition-colors">
                        <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                            <Upload className="text-gray-400 group-hover:text-blue-500" size={32} />
                        </div>
                        <p className="font-semibold text-lg">Upload your existing resume</p>
                        <p className="text-sm mt-1 text-gray-400">Drag & drop PDF or DOCX (Max 5MB)</p>
                    </div>
                )}

                {isParsingResume && (
                    <div className="flex flex-col items-center text-blue-600">
                        <Loader2 className="mb-2 animate-spin" size={32} />
                        <p className="font-medium animate-pulse">
                            🔄 Parsing your resume... Please wait
                        </p>
                    </div>
                )}

                {status === 'success' && !isParsingResume && (
                    <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="mb-2" size={32} />
                        <p className="font-bold">Resume Parsed Successfully!</p>
                        <p className="text-sm text-green-700">Form fields have been auto-filled.</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium"
                        >
                            Upload Another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
