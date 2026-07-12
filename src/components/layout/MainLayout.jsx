import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import useResumeStore from '../../store/useResumeStore';

const MainLayout = ({ children }) => {
    const { resumeData, setTheme } = useResumeStore();
    const theme = resumeData.theme || 'light';

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex flex-col font-sans text-gray-900 dark:text-[#c9c9d9] transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-[rgba(10,10,15,0.85)] dark:backdrop-blur-md border-b border-gray-200 dark:border-[rgba(108,99,255,0.1)] sticky top-0 z-50 transition-colors">
                <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/index.html" className="text-[22px] font-extrabold text-gray-900 dark:text-white tracking-tight">
                            CVDesignHub<span className="text-[#6c63ff]">.</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded border border-green-200 hidden md:block dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50">
                            Auto-Save Active
                        </span>
                        
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-[#c9c9d9] dark:hover:bg-[#12121a] transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <a 
                            href="/index.html" 
                            className="bg-[#6c63ff] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:shadow-[0_0_24px_rgba(108,99,255,0.4)] hover:scale-105 transition-all"
                        >
                            Home
                        </a>
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
