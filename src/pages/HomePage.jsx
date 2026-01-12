import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Wand2, Download } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
                Build Your <span className="text-blue-600">ATS-Friendly</span> Resume
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Create professional, optimized resumes in minutes. Our AI-powered builder ensures your resume gets past applicant tracking systems.
            </p>

            <div className="flex justify-center gap-6 mb-20">
                <Link to="/builder" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg">
                    Create Resume Now
                </Link>
                <button className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition">
                    Import Resume
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {[
                    { icon: <FileText size={32} />, title: "ATS Optimized", desc: "Templates designed to pass scanning systems." },
                    { icon: <Wand2 size={32} />, title: "AI Assistant", desc: "Get smart suggestions for your content." },
                    { icon: <Download size={32} />, title: "Instant Export", desc: "Download as PDF or DOCX in one click." }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
