
import React, { useState, useMemo } from 'react';
import { Reminder } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { ClipboardDocumentCheckIcon } from '../icons/ClipboardDocumentCheckIcon';

interface RemindersPageProps {
    reminders: Reminder[];
    onAddReminder: () => void;
    onEditReminder: (reminder: Reminder) => void;
    onDeleteReminder: (id: string) => void;
    onToggleComplete: (id: string) => void;
}

const Reminders: React.FC<RemindersPageProps> = ({ reminders, onAddReminder, onEditReminder, onDeleteReminder, onToggleComplete }) => {
    const [filter, setFilter] = useState<'upcoming' | 'past' | 'completed'>('upcoming');

    const filteredReminders = useMemo(() => {
        const now = new Date();
        return reminders.filter(r => {
            const dueDate = new Date(r.dueDateTime);
            if (filter === 'completed') return r.isCompleted;
            if (r.isCompleted) return false; 
            
            if (filter === 'upcoming') return dueDate >= now;
            if (filter === 'past') return dueDate < now;
            return true;
        }).sort((a, b) => new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime());
    }, [reminders, filter]);

    const getSourceIcon = (type: Reminder['sourceType']) => {
        switch (type) {
            case 'chat': return <ChatBubbleLeftRightIcon className="w-4 h-4 text-indigo-500" />;
            case 'interaction': return <ClipboardDocumentListIcon className="w-4 h-4 text-blue-500" />;
            case 'task': return <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />;
            default: return <ClockIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        
        const timeStr = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });

        return (
            <div className="flex flex-col items-end">
                <span className={`font-bold text-lg ${date < now && !isToday ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>{timeStr}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{isToday ? 'امروز' : dateStr}</span>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ClockIcon className="w-6 h-6 text-indigo-600" />
                    یادآورهای من
                </h2>
                <button onClick={onAddReminder} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>یادآور جدید</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button 
                    onClick={() => setFilter('upcoming')} 
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${filter === 'upcoming' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    پیش رو
                </button>
                <button 
                    onClick={() => setFilter('past')} 
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${filter === 'past' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    گذشته (انجام نشده)
                </button>
                <button 
                    onClick={() => setFilter('completed')} 
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${filter === 'completed' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    انجام شده
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-4">
                {filteredReminders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">هیچ یادآوری در این بخش وجود ندارد.</div>
                ) : (
                    filteredReminders.map(reminder => (
                        <div key={reminder.id} className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow ${reminder.isCompleted ? 'bg-gray-50 dark:bg-gray-900/50 opacity-75' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex items-start gap-4 flex-1">
                                <button 
                                    onClick={() => onToggleComplete(reminder.id)}
                                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${reminder.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-500 text-transparent hover:text-green-500'}`}
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-semibold text-gray-900 dark:text-white ${reminder.isCompleted ? 'line-through text-gray-500' : ''}`}>{reminder.title}</h3>
                                        {reminder.sourceType !== 'manual' && (
                                            <span title={`ایجاد شده از ${reminder.sourceType === 'chat' ? 'چت' : reminder.sourceType === 'task' ? 'وظیفه' : 'تعاملات'}`} className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                                                {getSourceIcon(reminder.sourceType)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{reminder.description}</p>
                                    {reminder.sourcePreview && (
                                        <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded border-r-2 border-indigo-400 text-gray-500 italic truncate max-w-md">
                                            "{reminder.sourcePreview}"
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mr-4">
                                {formatDate(reminder.dueDateTime)}
                                <div className="flex flex-col gap-1 border-r pr-3 dark:border-gray-600">
                                    <button onClick={() => onEditReminder(reminder)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded transition-colors">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDeleteReminder(reminder.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reminders;