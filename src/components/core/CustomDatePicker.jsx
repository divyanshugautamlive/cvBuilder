import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const parseDate = (val) => {
    if (!val) return { year: null, month: null, day: null };
    
    // YYYY-MM-DD
    let match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
        const y = parseInt(match[1]);
        const mIdx = parseInt(match[2]) - 1;
        const d = parseInt(match[3]);
        return { year: y, month: MONTHS[mIdx] || null, day: d };
    }

    // YYYY-MM
    match = val.match(/^(\d{4})-(\d{2})$/);
    if (match) {
        const y = parseInt(match[1]);
        const mIdx = parseInt(match[2]) - 1;
        return { year: y, month: MONTHS[mIdx] || null, day: null };
    }

    // YYYY
    match = val.match(/^(\d{4})$/);
    if (match) {
        return { year: parseInt(match[1]), month: null, day: null };
    }

    // "D MMM YYYY" (e.g. "13 Jul 2026")
    match = val.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
        const y = parseInt(match[3]);
        const m = match[2].substring(0, 3);
        const d = parseInt(match[1]);
        return { year: y, month: MONTHS.includes(m) ? m : null, day: d };
    }

    // "MMM YYYY" (e.g. "Jul 2026")
    match = val.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
        const y = parseInt(match[2]);
        const m = match[1].substring(0, 3);
        return { year: y, month: MONTHS.includes(m) ? m : null, day: null };
    }

    return { year: null, month: null, day: null };
};

const formatDate = (year, month, day) => {
    if (!year) return '';
    if (!month) return `${year}`;
    if (!day) return `${month} ${year}`;
    return `${day} ${month} ${year}`;
};

const getDaysInMonth = (year, monthName) => {
    const mIdx = MONTHS.indexOf(monthName);
    const firstDay = new Date(year, mIdx, 1).getDay(); // 0 = Sun, 1 = Mon...
    const numDays = new Date(year, mIdx + 1, 0).getDate();
    return { firstDay, numDays };
};

const CustomDatePicker = ({
    label,
    value,
    onChange,
    placeholder = "Select Date",
    isOpen,
    onOpen,
    onClose,
    disabled = false,
    headerRight
}) => {
    const containerRef = useRef(null);
    const [view, setView] = useState('year'); // 'year', 'month', 'day'
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    
    // Year pagination page start (12 years shown per page)
    const [yearPageStart, setYearPageStart] = useState(new Date().getFullYear() - 5);

    // Selected state
    const [tempYear, setTempYear] = useState(null);
    const [tempMonth, setTempMonth] = useState(null);
    const [tempDay, setTempDay] = useState(null);

    // Sync state on value change or opening
    useEffect(() => {
        const parsed = parseDate(value);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTempYear(parsed.year);
        setTempMonth(parsed.month);
        setTempDay(parsed.day);

        // Determine starting view based on current selection
        if (!parsed.year) {
            setView('year');
        } else if (!parsed.month) {
            setView('month');
        } else {
            setView('day');
        }
        
        if (parsed.year) {
            setYearPageStart(Math.floor(parsed.year / 12) * 12);
        }
    }, [value, isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                if (isOpen && onClose) onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSelectYear = (year) => {
        setTempYear(year);
        setTempMonth(null);
        setTempDay(null);
        setDirection(1);
        setView('month');
    };

    const handleSelectMonth = (month) => {
        setTempMonth(month);
        setTempDay(null);
        setDirection(1);
        setView('day');
    };

    const handleSelectDay = (day) => {
        setTempDay(day);
        const finalVal = formatDate(tempYear, tempMonth, day);
        onChange(finalVal);
        if (onClose) onClose();
    };

    const handleGoBack = () => {
        setDirection(-1);
        if (view === 'day') setView('month');
        else if (view === 'month') setView('year');
    };

    const handleConfirmPartial = () => {
        let finalVal = '';
        if (view === 'year' && tempYear) {
            finalVal = formatDate(tempYear, null, null);
        } else if (view === 'month' && tempYear && tempMonth) {
            finalVal = formatDate(tempYear, tempMonth, null);
        } else if (view === 'day' && tempYear && tempMonth) {
            finalVal = formatDate(tempYear, tempMonth, null);
        }
        onChange(finalVal);
        if (onClose) onClose();
    };

    const handleClear = () => {
        onChange('');
        setTempYear(null);
        setTempMonth(null);
        setTempDay(null);
        setView('year');
        if (onClose) onClose();
    };

    // Animation Config
    const slideVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 120 : -120,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir) => ({
            x: dir < 0 ? 120 : -120,
            opacity: 0
        })
    };

    // Render Years Page
    const years = Array.from({ length: 12 }, (_, i) => yearPageStart + i);

    const { firstDay, numDays } = tempYear && tempMonth 
        ? getDaysInMonth(tempYear, tempMonth) 
        : { firstDay: 0, numDays: 0 };

    return (
        <div className="flex flex-col relative w-full mb-4" ref={containerRef}>
            {(label || headerRight) && (
                <div className="flex items-center justify-between mb-1 gap-2">
                    {label ? (
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                        </label>
                    ) : <div />}
                    {headerRight}
                </div>
            )}

            {/* Input Trigger */}
            <div
                onClick={() => !disabled && onOpen && (isOpen ? onClose() : onOpen())}
                className={`w-full p-2 border rounded-md outline-none flex items-center justify-between transition-all select-none ${
                    disabled 
                        ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : isOpen 
                        ? 'border-blue-500 dark:border-[#6c63ff] ring-2 ring-blue-100 dark:ring-[#6c63ff]/20 bg-white dark:bg-transparent cursor-pointer'
                        : 'border-gray-300 dark:border-[#6c63ff]/30 hover:border-gray-400 dark:hover:border-[#6c63ff]/60 bg-white dark:bg-transparent text-gray-900 dark:text-white cursor-pointer'
                }`}
            >
                <span className={disabled && placeholder === 'Present' ? "text-gray-500 dark:text-gray-400 font-medium italic" : value ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}>
                    {value || placeholder}
                </span>
                <Calendar size={16} className="text-gray-400 dark:text-[#a0a0b8]" />
            </div>

            {/* Popover */}
            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-[calc(100%+4px)] left-0 z-[100] w-72 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-[#6c63ff]/20 rounded-lg shadow-xl p-4 flex flex-col transition-colors"
                    >
                        {/* Header Navigation */}
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#6c63ff]/10 pb-2 mb-3">
                            <div className="flex items-center gap-1">
                                {view !== 'year' ? (
                                    <button
                                        type="button"
                                        onClick={handleGoBack}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a2e] rounded text-gray-500 dark:text-gray-400 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setYearPageStart(prev => prev - 12)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a2e] rounded text-gray-500 dark:text-gray-400 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                            </div>

                            <span className="text-sm font-semibold text-gray-800 dark:text-white capitalize tracking-wide select-none">
                                {view === 'year' && `Select Year`}
                                {view === 'month' && `${tempYear}`}
                                {view === 'day' && `${tempMonth} ${tempYear}`}
                            </span>

                            <div className="flex items-center gap-1">
                                {view === 'year' ? (
                                    <button
                                        type="button"
                                        onClick={() => setYearPageStart(prev => prev + 12)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a2e] rounded text-gray-500 dark:text-gray-400 transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    // Empty placeholder to balance layout
                                    <div className="w-6 h-6" />
                                )}
                            </div>
                        </div>

                        {/* View Content Grid */}
                        <div className="h-52 overflow-hidden relative w-full mb-3 flex items-center justify-center">
                            <AnimatePresence mode="wait" custom={direction}>
                                {view === 'year' && (
                                    <motion.div
                                        key="years"
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                        className="grid grid-cols-3 gap-2 w-full h-full p-0.5"
                                    >
                                        {years.map(y => (
                                            <button
                                                key={y}
                                                type="button"
                                                onClick={() => handleSelectYear(y)}
                                                className={`py-2 text-sm rounded font-medium transition-all ${
                                                    tempYear === y
                                                        ? 'bg-blue-600 dark:bg-[#6c63ff] text-white'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a2e]'
                                                }`}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {view === 'month' && (
                                    <motion.div
                                        key="months"
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                        className="grid grid-cols-3 gap-2 w-full h-full p-0.5"
                                    >
                                        {MONTHS.map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => handleSelectMonth(m)}
                                                className={`py-2 text-sm rounded font-medium transition-all ${
                                                    tempMonth === m
                                                        ? 'bg-blue-600 dark:bg-[#6c63ff] text-white'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a2e]'
                                                }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {view === 'day' && (
                                    <motion.div
                                        key="days"
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                        className="w-full h-full flex flex-col p-0.5"
                                    >
                                        {/* Day Headers */}
                                        <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                                            {DAYS_OF_WEEK.map(d => (
                                                <span key={d} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase select-none">
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Day Buttons */}
                                        <div className="grid grid-cols-7 gap-1 overflow-y-auto max-h-[170px] custom-scrollbar">
                                            {/* Padding cells */}
                                            {Array.from({ length: firstDay }).map((_, idx) => (
                                                <div key={`empty-${idx}`} className="h-6 w-full" />
                                            ))}
                                            {/* Date buttons */}
                                            {Array.from({ length: numDays }).map((_, idx) => {
                                                const d = idx + 1;
                                                const isSelected = tempDay === d;
                                                return (
                                                    <button
                                                        key={`day-${d}`}
                                                        type="button"
                                                        onClick={() => handleSelectDay(d)}
                                                        className={`h-6 text-xs rounded font-medium transition-all flex items-center justify-center ${
                                                            isSelected
                                                                ? 'bg-blue-600 dark:bg-[#6c63ff] text-white'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a2e]'
                                                        }`}
                                                    >
                                                        {d}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-[#6c63ff]/10 pt-3 mt-1">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-[#ff6b6b] dark:hover:text-[#ff8585] transition-colors"
                            >
                                Clear
                            </button>

                            {/* Partial Confirm Action */}
                            {(view === 'year' && tempYear) || (view === 'month' && tempMonth) || (view === 'day') ? (
                                <button
                                    type="button"
                                    onClick={handleConfirmPartial}
                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-[#6c63ff]/10 dark:hover:bg-[#6c63ff]/20 text-blue-600 dark:text-[#6c63ff] text-xs font-bold rounded transition-colors"
                                >
                                    {view === 'year' && `Select Year Only`}
                                    {view === 'month' && `Select Month & Year`}
                                    {view === 'day' && `Select Month & Year`}
                                </button>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDatePicker;
