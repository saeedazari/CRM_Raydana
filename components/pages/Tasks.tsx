import React, { useState, useMemo, useEffect } from 'react';
import { Task, User, TaskStatus, TaskPriority, Customer } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { FilterIcon } from '../icons/FilterIcon';

// FIX: Removed 'email' property and added 'username' to align with the 'User' type definition.
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2' },
];

// FIX: Added required 'username' property to align with the 'Customer' type definition.
const mockCustomers: Customer[] = [
  { id: 'C1', companyName: 'شرکت آلفا', contactPerson: 'آقای الف', username: 'alpha', email: 'alpha@co.com', phone: '021-123', status: 'فعال' },
  { id: 'C2', companyName: 'تجارت بتا', contactPerson: 'خانم ب', username: 'beta', email: 'beta@co.com', phone: '021-456', status: 'فعال' },
];

const mockTasks: Task[] = [
    { id: 'TSK1', title: 'پیگیری تیکت #721', description: 'مشتری در مورد ورود به پنل کاربری مشکل دارد.', customer: mockCustomers[0], relatedTicketId: 'TKT-721', assignedTo: mockUsers[0], priority: 'بالا', status: 'در حال انجام', dueDate: '1403/05/10', createdAt: '1403/05/01' },
    { id: 'TSK2', title: 'آماده‌سازی پیش‌فاکتور برای تجارت بتا', description: '', customer: mockCustomers[1], assignedTo: mockUsers[0], priority: 'متوسط', status: 'معلق', dueDate: '1403/05/15', createdAt: '1403/05/02' },
    { id: 'TSK3', title: 'جلسه دمو با مشتری جدید', description: 'معرفی ویژگی‌های جدید محصول', assignedTo: mockUsers[1], priority: 'فوری', status: 'تکمیل شده', dueDate: '1403/04/30', createdAt: '1403/04/28' },
];

const statusColors: { [key in TaskStatus]: string } = {
  'معلق': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
  'در حال انجام': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'در انتظار': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'تکمیل شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'لغو شده': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityColors: { [key in TaskPriority]: string } = {
    'فوری': 'border-red-500',
    'بالا': 'border-orange-500',
    'متوسط': 'border-yellow-500',
    'پایین': 'border-gray-400',
};

const ITEMS_PER_PAGE = 8;

const initialNewTaskState: Omit<Task, 'id' | 'assignedTo' | 'customer' | 'createdAt'> & { assignedToId: string, customerId: string } = {
    title: '',
    description: '',
    customerId: '',
    relatedTicketId: '',
    assignedToId: '',
    priority: 'متوسط',
    status: 'معلق',
    dueDate: '',
};

interface TasksProps {
    initialParams?: any;
    customers: Customer[];
}

const Tasks: React.FC<TasksProps> = ({ initialParams, customers }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFormData, setTaskFormData] = useState(initialNewTaskState);

  useEffect(() => {
    if (initialParams?.action === 'create' && initialParams?.prefill) {
      setTaskFormData(prev => ({ ...prev, ...initialParams.prefill, }));
      openPanel();
    }
  }, [initialParams]);
  
  useEffect(() => {
    if (editingTask) {
        setTaskFormData({
            ...editingTask,
            assignedToId: editingTask.assignedTo.id,
            customerId: editingTask.customer?.id || '',
        });
    } else {
        const prefilledState = initialParams?.action === 'create' && initialParams?.prefill
            ? { ...initialNewTaskState, ...initialParams.prefill }
            : initialNewTaskState;
        setTaskFormData(prefilledState);
    }
  }, [editingTask, isPanelOpen]);

  const filteredTasks = useMemo(() => 
    tasks.filter(task =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (task.customer?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || task.status === statusFilter) &&
      (priorityFilter === 'all' || task.priority === priorityFilter)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [searchTerm, statusFilter, priorityFilter, tasks]
  );

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTo = users.find(u => u.id === taskFormData.assignedToId);
    const customer = customers.find(c => c.id === taskFormData.customerId);
    if (!assignedTo) {
        alert("لطفا یک کاربر را برای تخصیص انتخاب کنید.");
        return;
    }

    if (editingTask) {
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskFormData, assignedTo, customer } : t));
    } else {
        const newTask: Task = {
            id: `TSK-${Date.now()}`,
            ...initialNewTaskState,
            ...taskFormData,
            assignedTo,
            customer,
            createdAt: new Date().toISOString(),
        };
        setTasks(prev => [newTask, ...prev]);
    }
    closePanel();
  };
  
  const handleDelete = (taskId: string) => {
    if (window.confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
       setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const openPanel = (task: Task | null = null) => {
      setEditingTask(task);
      setIsPanelOpen(true);
  };

  const closePanel = () => {
      setIsPanelOpen(false);
      setEditingTask(null);
      if(initialParams) initialParams.prefill = null; 
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-auto flex flex-wrap flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-auto">
                <input type="text" placeholder="جستجوی وظیفه..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full sm:w-56 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
                </div>
                <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">همه وضعیت‌ها</option>
                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={priorityFilter} onChange={e => {setPriorityFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">همه اولویت‌ها</option>
                    <option value="فوری">فوری</option>
                    <option value="بالا">بالا</option>
                    <option value="متوسط">متوسط</option>
                    <option value="پایین">پایین</option>
                </select>
                <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all');}} className="p-2 text-gray-500 hover:text-indigo-600" aria-label="Reset filters">
                    <FilterIcon className="w-5 h-5" />
                </button>
            </div>
            <button onClick={() => openPanel()} className="flex-shrink-0 flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <PlusIcon className="w-5 h-5 ml-2" />
                <span>وظیفه جدید</span>
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">عنوان وظیفه</th>
                        <th scope="col" className="px-4 py-3">مشتری</th>
                        <th scope="col" className="px-4 py-3">کارشناس</th>
                        <th scope="col" className="px-4 py-3">مهلت انجام</th>
                        <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                        <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTasks.map((task) => (
                        <tr key={task.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className={`px-4 py-3 font-medium text-gray-900 dark:text-white border-r-4 ${priorityColors[task.priority]}`}>{task.title}</td>
                            <td className="px-4 py-3">{task.customer?.companyName || '-'}</td>
                            <td className="px-4 py-3">{task.assignedTo?.name || '-'}</td>
                            <td className="px-4 py-3">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fa-IR') : '-'}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <button onClick={() => openPanel(task)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(task.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
        <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-semibold">{editingTask ? 'ویرایش وظیفه' : 'ایجاد وظیفه'}</h3>
            <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleFormSubmit} className="flex flex-col overflow-hidden flex-grow">
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">عنوان</label>
                    <input type="text" name="title" id="title" value={taskFormData.title} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium">شرح وظیفه</label>
                    <textarea name="description" id="description" value={taskFormData.description || ''} onChange={handleInputChange} rows={4} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="customerId" className="block mb-2 text-sm font-medium">مشتری مرتبط</label>
                        <select name="customerId" id="customerId" value={taskFormData.customerId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700">
                            <option value="">هیچکدام</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="relatedTicketId" className="block mb-2 text-sm font-medium">تیکت مرتبط</label>
                        <input type="text" name="relatedTicketId" id="relatedTicketId" value={taskFormData.relatedTicketId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="assignedToId" className="block mb-2 text-sm font-medium">اختصاص به</label>
                        <select name="assignedToId" id="assignedToId" value={taskFormData.assignedToId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required>
                        <option value="">یک کاربر را انتخاب کنید</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block mb-2 text-sm font-medium">مهلت انجام</label>
                        <input type="text" placeholder="مثلا: 1403/05/10" name="dueDate" id="dueDate" value={taskFormData.dueDate?.split('T')[0] || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="priority" className="block mb-2 text-sm font-medium">اولویت</label>
                        <select name="priority" id="priority" value={taskFormData.priority} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700">
                            {['پایین', 'متوسط', 'بالا', 'فوری'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium">وضعیت</label>
                        <select name="status" id="status" value={taskFormData.status} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700">
                            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 space-i-3 flex-shrink-0">
              <button type="button" onClick={closePanel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400">انصراف</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ذخیره</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Tasks;