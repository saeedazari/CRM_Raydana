
import React, { useState, useMemo } from 'react';
import { Task, Reminder, Invoice } from '../../types';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { ClipboardDocumentCheckIcon } from '../icons/ClipboardDocumentCheckIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';

interface CalendarProps {
    tasks: Task[];
    reminders: Reminder[];
    invoices: Invoice[];
    onOpenTaskModal: (task: Task) => void;
    onOpenReminderModal: (reminder: Reminder) => void;
    onViewInvoice: (invoice: Invoice) => void;
}

type EventType = 'task' | 'reminder' | 'invoice';

interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    type: EventType;
    data: any;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, reminders, invoices, onOpenTaskModal, onOpenReminderModal, onViewInvoice }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to normalize dates to midnight for comparison
    const normalizeDate = (dateStr: string) => {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const events = useMemo(() => {
        const allEvents: CalendarEvent[] = [];

        tasks.forEach(task => {
            if (task.dueDate) {
                allEvents.push({
                    id: task.id,
                    date: normalizeDate(task.dueDate),
                    title: task.title,
                    type: 'task',
                    data: task
                });
            }
        });

        reminders.forEach(reminder => {
            if (reminder.dueDateTime) {
                allEvents.push({
                    id: reminder.id,
                    date: normalizeDate(reminder.dueDateTime),
                    title: reminder.title,
                    type: 'reminder',
                    data: reminder
                });
            }
        });

        invoices.forEach(invoice => {
            if (invoice.dueDate) {
                const d = new Date(invoice.dueDate);
                // Simple check to ensure valid date object
                if (!isNaN(d.getTime())) {
                     allEvents.push({
                        id: invoice.id,
                        date: normalizeDate(invoice.dueDate),
                        title: `فاکتور ${invoice.customerName}`,
                        type: 'invoice',
                        data: invoice
                    });
                }
            }
        });

        return allEvents;
    }, [tasks, reminders, invoices]);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const startDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    // Adjust for Saturday start (Saturday = 0 in our grid logic, but Date.getDay() returns 6 for Sat)
    // Map: Sat(6)->0, Sun(0)->1, Mon(1)->2, ... Fri(5)->6
    // (day + 1) % 7
    const offset = (startDay + 1) % 7; 

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < offset; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

    const getEventColor = (type: EventType) => {
        switch (type) {
            case 'task': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
            case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
            case 'invoice': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    const getEventIcon = (type: EventType) => {
         switch (type) {
            case 'task': return <ClipboardDocumentCheckIcon className="w-3 h-3 mr-1 inline" />;
            case 'reminder': return <ClockIcon className="w-3 h-3 mr-1 inline" />;
            case 'invoice': return <CreditCardIcon className="w-3 h-3 mr-1 inline" />;
            default: return null;
        }
    };

    const handleEventClick = (event: CalendarEvent) => {
        if (event.type === 'task') onOpenTaskModal(event.data);
        if (event.type === 'reminder') onOpenReminderModal(event.data);
        if (event.type === 'invoice') onViewInvoice(event.data);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    {currentDate.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2">
                    <button onClick={goToToday} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">امروز</button>
                    <div className="flex rounded-md shadow-sm" role="group">
                        <button onClick={prevMonth} type="button" className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600">
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                        <button onClick={nextMonth} type="button" className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-t border-b border-l border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600">
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {weekDays.map(day => (
                    <div key={day} className="p-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-grow auto-rows-fr">
                {days.map((date, index) => {
                    if (!date) return <div key={`empty-${index}`} className="border-b border-l dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30"></div>;
                    
                    const dayEvents = events.filter(e => 
                        e.date.getDate() === date.getDate() && 
                        e.date.getMonth() === date.getMonth() && 
                        e.date.getFullYear() === date.getFullYear()
                    );
                    
                    const isToday = new Date().setHours(0,0,0,0) === date.getTime();

                    return (
                        <div key={index} className={`border-b border-l dark:border-gray-700 p-2 min-h-[100px] overflow-hidden relative group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                            <span className={`text-sm font-medium inline-block w-7 h-7 leading-7 text-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {date.getDate().toLocaleString('fa-IR')}
                            </span>
                            <div className="mt-1 space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                                {dayEvents.map(event => (
                                    <button 
                                        key={event.id}
                                        onClick={() => handleEventClick(event)}
                                        className={`block w-full text-right text-xs px-1.5 py-1 rounded border truncate ${getEventColor(event.type)}`}
                                        title={event.title}
                                    >
                                        {getEventIcon(event.type)}
                                        {event.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
