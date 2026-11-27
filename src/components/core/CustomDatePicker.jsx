import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const normalizeMonth = (rawMonth) => {
    if (!rawMonth) return null;
    const prefix = rawMonth.trim().substring(0, 3).toLowerCase();
    return MONTHS.find((m) => m.toLowerCase() === prefix) || null;
};

const parseDate = (val) => {
    if (!val || typeof val !== 'string') return { year: null, month: null, day: null };
    const trimmed = val.trim();

    // YYYY-MM-DD
    let match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
        const y = parseInt(match[1], 10);
        const mIdx = parseInt(match[2], 10) - 1;
        const d = parseInt(match[3], 10);
        return { year: y, month: MONTHS[mIdx] || null, day: d };
    }

    // DD/MM/YYYY or DD-MM-YYYY
    match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (match) {
        const d = parseInt(match[1], 10);
        const mIdx = parseInt(match[2], 10) - 1;
        const y = parseInt(match[3], 10);
        return { year: y, month: MONTHS[mIdx] || null, day: d };
    }

    // YYYY-MM or YYYY/MM
    match = trimmed.match(/^(\d{4})[/-](\d{1,2})$/);
    if (match) {
        const y = parseInt(match[1], 10);
        const mIdx = parseInt(match[2], 10) - 1;
        return { year: y, month: MONTHS[mIdx] || null, day: null };
    }

    // MM/YYYY or MM-YYYY
    match = trimmed.match(/^(\d{1,2})[/-](\d{4})$/);
    if (match) {
        const mIdx = parseInt(match[1], 10) - 1;
        const y = parseInt(match[2], 10);
        return { year: y, month: MONTHS[mIdx] || null, day: null };
    }

    // YYYY
    match = trimmed.match(/^(\d{4})$/);
    if (match) {
        return { year: parseInt(match[1], 10), month: null, day: null };
    }

    // "D MMM YYYY" or "D Month YYYY" (e.g. "13 Jul 2026")
    match = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
        const y = parseInt(match[3], 10);
        const m = normalizeMonth(match[2]);
        const d = parseInt(match[1], 10);
        return { year: y, month: m, day: d };
    }

    // "MMM YYYY" or "Month YYYY" (e.g. "Jul 2026")
    match = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
        const y = parseInt(match[2], 10);
        const m = normalizeMonth(match[1]);
        return { year: y, month: m, day: null };
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

const POPOVER_WIDTH = 288; // w-72
const POPOVER_ESTIMATED_HEIGHT = 360;

const CustomDatePicker = ({
    label,
    value,
    onChange,
    placeholder = "Select Date (YYYY, MMM YYYY, or DD MMM YYYY)",
    isOpen,
    onOpen,
    onClose,
    disabled = false,
    headerRight
}) => {
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const wasOpenRef = useRef(false);

    const [view, setView] = useState('year'); // 'year', 'month', 'day'
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const [yearPageStart, setYearPageStart] = useState(new Date().getFullYear() - 5);
    const [popoverStyle, setPopoverStyle] = useState({ top: 0, left: 0, placement: 'bottom' });

    // Selected state
    const [tempYear, setTempYear] = useState(null);
    const [tempMonth, setTempMonth] = useState(null);
    const [tempDay, setTempDay] = useState(null);

    const updatePopoverPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const openUpward = spaceBelow < POPOVER_ESTIMATED_HEIGHT && spaceAbove > spaceBelow;

        const left = Math.max(8, Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8));

        if (openUpward) {
            setPopoverStyle({
                bottom: window.innerHeight - rect.top + 4,
                left,
                placement: 'top'
            });
        } else {
            setPopoverStyle({
                top: rect.bottom + 4,
                left,
                placement: 'bottom'
            });
        }
    }, []);

    // Sync parsed state when value changes or popover opens
    useEffect(() => {
        const parsed = parseDate(value);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTempYear(parsed.year);
        setTempMonth(parsed.month);
        setTempDay(parsed.day);

        if (parsed.year) {
            setYearPageStart(Math.floor(parsed.year / 12) * 12);
        }

        // Only reset initial view when transitioning to open
        if (isOpen && !wasOpenRef.current) {
            if (!parsed.year) {
                setView('year');
            } else if (!parsed.month) {
                setView('month');
            } else {
                setView('day');
            }
        }
        wasOpenRef.current = !!isOpen;
    }, [value, isOpen]);

    // Position popover and keep it aligned on scroll/resize
    useEffect(() => {
        if (!isOpen || disabled) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updatePopoverPosition();

        window.addEventListener('scroll', updatePopoverPosition, true);
        window.addEventListener('resize', updatePopoverPosition);
        return () => {
            window.removeEventListener('scroll', updatePopoverPosition, true);
            window.removeEventListener('resize', updatePopoverPosition);
        };
    }, [isOpen, disabled, updatePopoverPosition]);

    // Close on click outside (checking both trigger container and portaled popover)
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedInsideTrigger = containerRef.current && containerRef.current.contains(e.target);
            const clickedInsidePopover = popoverRef.current && popoverRef.current.contains(e.target);
            if (!clickedInsideTrigger && !clickedInsidePopover) {
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
        if ((view === 'year' || view === 'month') && tempYear) {
            finalVal = formatDate(tempYear, null, null);
        } else if (view === 'day' && tempYear && tempMonth) {
            finalVal = formatDate(tempYear, tempMonth, null);
        }
        if (finalVal) {
            onChange(finalVal);
        }
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

    const showPartialButton =
        (view === 'year' && Boolean(tempYear)) ||
        (view === 'month' && Boolean(tempYear)) ||
        (view === 'day' && Boolean(tempYear && tempMonth));

    const partialButtonLabel =
        view === 'day'
            ? `Use ${tempMonth} ${tempYear}`
            : `Use ${tempYear} Only`;

    const popoverContent = (
        <AnimatePresence>
            {isOpen && !disabled && (
                <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, y: popoverStyle.placement === 'top' ? -8 : 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: popoverStyle.placement === 'top' ? -8 : 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        top: popoverStyle.top,
                        bottom: popoverStyle.bottom,
                        left: popoverStyle.left,
                        zIndex: 9999
                    }}
                    className="w-72 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-[#6c63ff]/20 rounded-lg shadow-2xl p-4 flex flex-col transition-colors"
                >
                    {/* Header Navigation */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#6c63ff]/10 pb-2 mb-3">
                        <div className="flex items-center gap-1">
                            {view !== 'year' ? (
                                <button
                                    type="button"
                                    onClick={handleGoBack}
                                    aria-label="Back"
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a2e] rounded text-gray-500 dark:text-gray-400 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setYearPageStart(prev => prev - 12)}
                                    aria-label="Previous Years"
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a2e] rounded text-gray-500 dark:text-gray-400 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            )}
                        </div>

                        {view === 'year' ? (
                            <span className="text-sm font-semibold text-gray-800 dark:text-white tracking-wide select-none">
                                Select Year
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="text-sm font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-[#6c63ff] tracking-wide select-none transition-colors"
                                title={view === 'month' ? 'Change year' : 'Change month'}
                            >
                                {view === 'month' && `${tempYear}`}
                                {view === 'day' && `${tempMonth} ${tempYear}`}
                            </button>
                        )}

                        <div className="flex items-center gap-1">
                            {view === 'year' ? (
                                <button
                                    type="button"
                                    onClick={() => setYearPageStart(prev => prev + 12)}
                                    aria-label="Next Years"
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a2e] rounded text-gray-500 dark:text-gray-400 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
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

                        {showPartialButton && (
                            <button
                                type="button"
                                onClick={handleConfirmPartial}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-[#6c63ff]/10 dark:hover:bg-[#6c63ff]/20 text-blue-600 dark:text-[#6c63ff] text-xs font-bold rounded transition-colors"
                            >
                                {partialButtonLabel}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

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

            {/* Input Trigger (supports direct typing + calendar picker) */}
            <div
                ref={triggerRef}
                onClick={() => !disabled && onOpen && !isOpen && onOpen()}
                className={`w-full px-2 py-1.5 border rounded-md outline-none flex items-center justify-between gap-2 transition-all ${
                    disabled
                        ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed py-2'
                        : isOpen
                        ? 'border-blue-500 dark:border-[#6c63ff] ring-2 ring-blue-100 dark:ring-[#6c63ff]/20 bg-white dark:bg-transparent'
                        : 'border-gray-300 dark:border-[#6c63ff]/30 hover:border-gray-400 dark:hover:border-[#6c63ff]/60 bg-white dark:bg-transparent text-gray-900 dark:text-white'
                }`}
            >
                {disabled ? (
                    <span className={placeholder === 'Present' ? "text-gray-500 dark:text-gray-400 font-medium italic select-none" : "text-gray-400 dark:text-gray-500 select-none"}>
                        {value || placeholder}
                    </span>
                ) : (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => onOpen && !isOpen && onOpen()}
                        placeholder={placeholder}
                        aria-label={label || placeholder}
                        className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                )}
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Toggle ${label || 'date'} calendar`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (disabled) return;
                        if (isOpen) {
                            onClose && onClose();
                        } else {
                            onOpen && onOpen();
                        }
                    }}
                    className={`p-0.5 rounded transition-colors shrink-0 ${
                        disabled
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-400 dark:text-[#a0a0b8] hover:text-gray-600 dark:hover:text-white cursor-pointer'
                    }`}
                >
                    <Calendar size={16} />
                </button>
            </div>

            {typeof document !== 'undefined' ? createPortal(popoverContent, document.body) : popoverContent}
        </div>
    );
};

export default CustomDatePicker;
