import { useEffect, useRef } from 'react';
import useResumeStore from '../store/useResumeStore';
import { storage } from '../utils/storage';

const useAutoSave = (interval = 30000) => {
    const { resumeData } = useResumeStore();
    const lastSavedData = useRef(JSON.stringify(resumeData));

    useEffect(() => {
        const timer = setInterval(() => {
            const currentDataStr = JSON.stringify(resumeData);

            // Only save if data has changed
            if (currentDataStr !== lastSavedData.current) {
                console.log('Auto-saving data...');
                storage.set('resume_data', resumeData);
                lastSavedData.current = currentDataStr;

                // Optional: Dispatch a custom event or toast for "Saved" state
            }
        }, interval);

        return () => clearInterval(timer);
    }, [resumeData, interval]);
};

export default useAutoSave;
