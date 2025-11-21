
import React, { useState, useEffect } from 'react';
import { Task, User, Customer, TaskStatus, TaskPriority } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toIsoDate } from '../utils/date';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    initialData?: Partial<Task>;
    isEditing?: boolean;
    users: User[];
    customers: Customer[];
}

const initialTaskState: Omit<Task, 'id' | 'assignedTo' | 'customer' | 'createdAt'> & { assignedToId: string, customerId: string } = {
    title: '',
    description: '',
    customerId: '',
    relatedTicketId: '',
    assignedToId: '',
    priority: 'متوسط',
    status: 'معلق',
    dueDate: '',
};

const statusColors: { [key in TaskStatus]: string } = {
  'معلق': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
  'در حال انجام': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'در انتظار': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'تکمیل شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'لغو شده': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData, isEditing, users, customers }) => {
    const [taskFormData, setTaskFormData] = useState(initialTaskState);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                 setTaskFormData({
                    ...initialTaskState,
                    ...initialData,
                    assignedToId: initialData.assignedTo?.id || (initialData as any).assignedToId || '',
                    customerId: initialData.customer?.id || (initialData as any).customerId || '',
                    dueDate: initialData.dueDate || '',
                });
            } else {
                setTaskFormData(initialTaskState);
            }
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const assignedTo = users.find(u => u.id === taskFormData.assignedToId);
        const customer = customers.find(c => c.id === taskFormData.customerId);

        if (!assignedTo) {
            alert("لطفا یک کاربر را برای تخصیص انتخاب کنید.");
            return;
        }

        onSave({
            ...taskFormData,
            assignedTo,
            customer,
            dueDate: taskFormData.dueDate,
        } as any);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} 
                onClick={onClose}
            ></div>
            
            <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isEditing ? 'ویرایش وظیفه' : 'ایجاد وظیفه جدید'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-grow">
                    <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">عنوان</label>
                            <input type="text" name="title" id="title" value={taskFormData.title} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">شرح وظیفه</label>
                            <textarea name="description" id="description" value={taskFormData.description || ''} onChange={handleInputChange} rows={4} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="customerId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">مشتری مرتبط</label>
                                <select name="customerId" id="customerId" value={taskFormData.customerId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="">هیچکدام</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="relatedTicketId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">شناسه تیکت مرتبط</label>
                                <input type="text" name="relatedTicketId" id="relatedTicketId" value={taskFormData.relatedTicketId || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="مثلا TKT-123" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="assignedToId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">اختصاص به</label>
                                <select name="assignedToId" id="assignedToId" value={taskFormData.assignedToId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                <option value="">یک کاربر را انتخاب کنید</option>
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">مهلت انجام</label>
                                <DatePicker 
                                    value={taskFormData.dueDate ? new Date(taskFormData.dueDate) : null}
                                    onChange={(date) => setTaskFormData(prev => ({...prev, dueDate: toIsoDate(date)}))}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    inputClass="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">اولویت</label>
                                <select name="priority" id="priority" value={taskFormData.priority} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {['پایین', 'متوسط', 'بالا', 'فوری'].map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">وضعیت</label>
                                <select name="status" id="status" value={taskFormData.status} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
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

export default TaskModal;
