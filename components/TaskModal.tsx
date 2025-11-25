
import React, { useState, useEffect, useRef } from 'react';
import { Task, User, Customer, TaskStatus, TaskComment } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { PaperClipIcon } from './icons/PaperClipIcon'; // Optional if we add attachments later
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toIsoDate, toShamsi } from '../utils/date';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    initialData?: Partial<Task>;
    isEditing?: boolean;
    users: User[];
    customers: Customer[];
    currentUser: User;
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
    comments: [],
};

const statusColors: { [key in TaskStatus]: string } = {
  'معلق': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
  'در حال انجام': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'در انتظار': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'تکمیل شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'لغو شده': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

type Tab = 'details' | 'comments';

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData, isEditing, users, customers, currentUser }) => {
    const [taskFormData, setTaskFormData] = useState(initialTaskState);
    const [activeTab, setActiveTab] = useState<Tab>('details');
    const [newComment, setNewComment] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                 setTaskFormData({
                    ...initialTaskState,
                    ...initialData,
                    assignedToId: initialData.assignedTo?.id || (initialData as any).assignedToId || '',
                    customerId: initialData.customer?.id || (initialData as any).customerId || '',
                    dueDate: initialData.dueDate || '',
                    comments: initialData.comments || [],
                });
            } else {
                setTaskFormData(initialTaskState);
            }
            setActiveTab('details'); // Reset tab
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (activeTab === 'comments') {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeTab, taskFormData.comments]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveTask();
    };

    const saveTask = () => {
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
        if(!isEditing) onClose(); // Close only if creating new, keep open if editing to allow continued work
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: TaskComment = {
            id: `TC-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            text: newComment,
            createdAt: new Date().toISOString()
        };

        setTaskFormData(prev => ({
            ...prev,
            comments: [...(prev.comments || []), comment]
        }));
        setNewComment('');
        // We save immediately when a comment is added to persist state
        // In a real app, this would be a separate API call or batched with save
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
                        {isEditing ? 'جزئیات وظیفه' : 'ایجاد وظیفه جدید'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                {isEditing && (
                    <div className="flex border-b dark:border-gray-700">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            <ClipboardDocumentListIcon className="w-4 h-4 inline-block ml-2" />
                            اطلاعات
                        </button>
                        <button 
                            onClick={() => setActiveTab('comments')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 inline-block ml-2" />
                            گفتگو و نظرات ({taskFormData.comments?.length || 0})
                        </button>
                    </div>
                )}

                <div className="flex-grow flex flex-col overflow-hidden">
                    {activeTab === 'details' ? (
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                                <div>
                                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">عنوان</label>
                                    <input type="text" name="title" id="title" value={taskFormData.title} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                </div>
                                
                                {/* Quick Status Change for Edit Mode */}
                                {isEditing && (
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">وضعیت فعلی</label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(statusColors).map((status) => (
                                                <button
                                                    type="button"
                                                    key={status}
                                                    onClick={() => setTaskFormData(prev => ({ ...prev, status: status as TaskStatus }))}
                                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                                        taskFormData.status === status 
                                                            ? `${statusColors[status as TaskStatus]} ring-2 ring-offset-1 ring-indigo-500`
                                                            : 'bg-white dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                    {/* Status also here as fallback */}
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
                                    بستن
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">
                                    ذخیره تغییرات
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Comments List */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                                {taskFormData.comments?.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8 text-sm">هنوز هیچ نظری ثبت نشده است.</div>
                                ) : (
                                    taskFormData.comments?.map(comment => (
                                        <div key={comment.id} className={`flex items-start gap-3 ${comment.userId === currentUser.id ? 'flex-row-reverse' : ''}`}>
                                            <img src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.userName}`} alt={comment.userName} className="w-8 h-8 rounded-full" />
                                            <div className={`max-w-[80%] rounded-lg p-3 ${comment.userId === currentUser.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border dark:border-gray-600'}`}>
                                                <div className="flex justify-between items-baseline mb-1 gap-4">
                                                    <span className="text-xs font-bold">{comment.userName}</span>
                                                    <span className="text-[10px] opacity-70" dir="ltr">{toShamsi(comment.createdAt, "YYYY/MM/DD HH:mm")}</span>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={chatEndRef}></div>
                            </div>
                            
                            {/* Add Comment Input */}
                            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                                <form onSubmit={handleAddComment} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newComment} 
                                        onChange={e => setNewComment(e.target.value)} 
                                        placeholder="نوشتن نظر یا پیام..." 
                                        className="flex-grow p-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">ارسال</button>
                                </form>
                                <div className="mt-2 flex justify-end">
                                     {/* Save button also in comments tab to ensure user saves state if they modified details then switched tabs */}
                                     <button type="button" onClick={handleSubmit} className="text-xs text-indigo-600 hover:underline">ذخیره کل تغییرات</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
