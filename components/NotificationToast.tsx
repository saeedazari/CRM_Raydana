
import React, { useEffect } from 'react';
import { BellIcon } from './icons/BellIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { Reminder } from '../types';
import { formatTime } from '../utils/date';

interface NotificationToastProps {
    reminder: Reminder | null;
    onClose: () => void;
    onAction: (reminder: Reminder) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ reminder, onClose, onAction }) => {
    useEffect(() => {
        if (reminder) {
            // Play sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Short notification sound
            audio.play().catch(e => console.log("Audio play failed", e));

            const timer = setTimeout(() => {
                onClose();
            }, 10000); // Auto close after 10 seconds
            return () => clearTimeout(timer);
        }
    }, [reminder, onClose]);

    if (!reminder) return null;

    return (
        <div className="fixed top-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-[60] md:w-full md:max-w-sm p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4 border-indigo-600 animate-bounce-in">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
                        <BellIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">یادآوری!</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{reminder.title}</p>
                    {reminder.dueDateTime && (
                        <p className="mt-1 text-xs text-gray-400">
                            {formatTime(reminder.dueDateTime)}
                        </p>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
             <div className="mt-3 flex gap-2">
                <button onClick={() => onAction(reminder)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                    مشاهده جزئیات
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
