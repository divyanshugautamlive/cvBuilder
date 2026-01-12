import React from 'react';
import { FileText } from 'lucide-react';
import VersionManager from '../features/versions/VersionManager';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">
                            <span className="text-blue-600">ATS</span> Resume Builder
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <VersionManager />
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded border border-green-200 hidden md:block">
                            Auto-Save Active
                        </span>
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Help</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
