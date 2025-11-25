
import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

interface ReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reminder: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'isCompleted' | 'isRead'>) => void;
    initialData?: Partial<Reminder>;
    isEditing?: boolean;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSave, initialData, isEditing }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDateTime, setDueDateTime] = useState<Date | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || '');
            setDescription(initialData?.description || '');
            
            if (initialData?.dueDateTime) {
                setDueDateTime(new Date(initialData.dueDateTime));
            } else {
                // Default to 1 hour from now
                const now = new Date();
                now.setHours(now.getHours() + 1);
                setDueDateTime(now);
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dueDateTime) {
            alert('لطفا تاریخ و زمان را انتخاب کنید.');
            return;
        }

        // Convert date object (which react-multi-date-picker manages) to ISO string
        const dateToSave = new Date(dueDateTime);

        onSave({
            title,
            description,
            dueDateTime: dateToSave.toISOString(),
            sourceType: initialData?.sourceType || 'manual',
            sourceId: initialData?.sourceId,
            sourcePreview: initialData?.sourcePreview
        });
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
            {/* Overlay */}
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} 
                onClick={onClose}
            ></div>
            
            {/* Sliding Panel (Left Side) */}
            <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full md:w-auto md:min-w-[20rem] md:max-w-md shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isEditing ? 'ویرایش یادآور' : 'افزودن یادآور جدید'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                        {initialData?.sourcePreview && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                <span className="font-semibold block mb-1">مرتبط با:</span>
                                "{initialData.sourcePreview}"
                            </div>
                        )}
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">عنوان</label>
                            <input 
                                type="text" 
                                id="title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                                required 
                                placeholder="مثلا: پیگیری قرارداد..."
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">زمان یادآوری</label>
                            <div className="relative">
                                <DatePicker 
                                    value={dueDateTime}
                                    onChange={(date: any) => {
                                        // react-multi-date-picker returns a generic object, need to convert to standard JS Date
                                        if (date) {
                                            setDueDateTime(date.toDate ? date.toDate() : new Date(date));
                                        } else {
                                            setDueDateTime(null);
                                        }
                                    }}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    format="YYYY/MM/DD HH:mm"
                                    plugins={[
                                        <TimePicker position="bottom" />
                                    ]}
                                    inputClass="w-full p-2.5 pl-10 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    containerClassName="w-full"
                                    placeholder="انتخاب تاریخ و ساعت"
                                />
                                <div className="absolute left-3 top-3 pointer-events-none">
                                    <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">توضیحات (اختیاری)</label>
                            <textarea 
                                id="description" 
                                rows={5} 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="جزئیات بیشتر..."
                            ></textarea>
                        </div>
                    </div>
                    
                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            انصراف
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">
                            ذخیره
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReminderModal;
