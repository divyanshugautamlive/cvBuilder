import React from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        try {
            localStorage.removeItem('resume_data');
            localStorage.removeItem('cover_letter_data');
        } catch (e) {
            console.error('Failed to clear storage:', e);
        }
        window.location.href = '/app.html';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center p-6 text-gray-900 dark:text-gray-100">
                    <div className="max-w-md w-full bg-white dark:bg-[#12121a] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            We encountered an unexpected error while loading the editor. You can reload the page or reset the saved session if corrupted data caused this.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                            >
                                <RotateCcw size={16} /> Reload Page
                            </button>
                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <Trash2 size={16} /> Reset Editor
                            </button>
                        </div>
                        {this.state.error?.message && (
                            <details className="mt-6 text-left text-xs text-gray-500 bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-800 overflow-x-auto">
                                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">Technical Details</summary>
                                <pre className="mt-2 whitespace-pre-wrap">{String(this.state.error.stack || this.state.error.message)}</pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
