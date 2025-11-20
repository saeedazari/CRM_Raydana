
import React, { useState, useRef, useEffect } from 'react';
import { Reminder } from '../types';
import { BellIcon } from './icons/BellIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClockIcon } from './icons/ClockIcon';

interface HeaderNotificationsProps {
    reminders: Reminder[];
    onMarkAsRead: (id: string) => void;
}

const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({ reminders, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter reminders that are due, not completed, and not read
    const activeReminders = reminders.filter(r => {
        const dueDate = new Date(r.dueDateTime);
        return dueDate <= new Date() && !r.isCompleted && !r.isRead;
    }).sort((a, b) => new Date(b.dueDateTime).getTime() - new Date(a.dueDateTime).getTime());

    const unreadCount = activeReminders.length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                title="اعلان‌ها"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">اعلان‌ها ({unreadCount})</h3>
                    </div>
                    {activeReminders.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            اعلان جدیدی ندارید.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            {activeReminders.map((reminder) => (
                                <li key={reminder.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 pl-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{reminder.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{reminder.description}</p>
                                            <div className="flex items-center mt-2 text-xs text-indigo-500 dark:text-indigo-400">
                                                <ClockIcon className="w-3 h-3 mr-1" />
                                                {new Date(reminder.dueDateTime).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMarkAsRead(reminder.id);
                                            }}
                                            title="علامت به عنوان خوانده شده"
                                            className="text-gray-300 hover:text-green-600 dark:text-gray-600 dark:hover:text-green-400 transition-colors"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderNotifications;
