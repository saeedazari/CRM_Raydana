import React, { useState, useMemo, useEffect } from 'react';
import { Task, User, TaskStatus, TaskPriority } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { FilterIcon } from '../icons/FilterIcon';

// Mock Data
const mockTasks: (users: User[]) => Task[] = (users) => [
    { id: 'TASK-001', title: 'آماده‌سازی پیش‌فاکتور برای شرکت ABC', customer: 'شرکت ABC', assignedTo: users.find(u => u.name === 'علی رضایی')!, priority: 'بالا', status: 'در حال انجام', dueDate: '1403/08/20', createdAt: '1403/08/18', relatedTicketId: 'TKT-00123' },
    { id: 'TASK-002', title: 'پیگیری درخواست فیچر جدید', customer: 'شرکت XYZ', assignedTo: users.find(u => u.name === 'مریم احمدی')!, priority: 'متوسط', status: 'معلق', dueDate: '1403/08/25', createdAt: '1403/08/17' },
    { id: 'TASK-003', title: 'بررسی گزارش باگ داشبورد', customer: 'داده پردازان', assignedTo: users.find(u => u.name === 'زهرا محمدی')!, priority: 'فوری', status: 'در حال انجام', dueDate: '1403/08/19', createdAt: '1403/08/16' },
    { id: 'TASK-004', title: 'تماس با مشتری جهت تمدید اشتراک', customer: 'پتروشیمی زاگرس', assignedTo: users.find(u => u.name === 'علی رضایی')!, priority: 'متوسط', status: 'تکمیل شده', dueDate: '1403/08/15', createdAt: '1403/08/14' },
    { id: 'TASK-005', title: 'رفع مشکل پرداخت آنلاین', customer: 'گروه صنعتی بهاران', assignedTo: users.find(u => u.name === 'زهرا محمدی')!, priority: 'فوری', status: 'در انتظار', dueDate: '1403/08/22', createdAt: '1403/08/15' },
    { id: 'TASK-006', title: 'بررسی و پاسخ به تیکت امنیتی', customer: 'فولاد مبارکه', assignedTo: users.find(u => u.name === 'زهرا محمدی')!, priority: 'فوری', status: 'معلق', dueDate: '1403/08/18', createdAt: '1403/08/16' },
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

const initialNewTaskState: Omit<Task, 'id' | 'assignedTo'> & { assignedTo: string } = {
    title: '',
    customer: '',
    relatedTicketId: '',
    assignedTo: '',
    priority: 'متوسط',
    status: 'معلق',
    dueDate: '',
    createdAt: new Date().toLocaleDateString('fa-IR-u-nu-latn').replace(/\//g, '/'),
};

interface TasksProps {
    initialParams?: any;
    users: User[];
}

const Tasks: React.FC<TasksProps> = ({ initialParams, users }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks(users));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newTask, setNewTask] = useState(initialNewTaskState);

  useEffect(() => {
    if (initialParams?.action === 'create' && initialParams?.prefill) {
      setNewTask(prev => ({
        ...prev,
        ...initialParams.prefill,
      }));
      openPanel();
    }
  }, [initialParams]);

  const filteredTasks = useMemo(() => 
    tasks.filter(task =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (task.customer || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || task.status === statusFilter) &&
      (priorityFilter === 'all' || task.priority === priorityFilter)
    ).sort((a, b) => new Date(b.createdAt.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')).getTime() - new Date(a.createdAt.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')).getTime()),
    [searchTerm, statusFilter, priorityFilter, tasks]
  );

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = users.find(u => u.id === newTask.assignedTo);
    if (!assignedUser) {
        alert('کاربر انتخاب شده معتبر نیست.');
        return;
    }
    const newTaskWithId: Task = {
      id: `TASK-${String(Date.now()).slice(-5)}`,
      title: newTask.title,
      customer: newTask.customer,
      relatedTicketId: newTask.relatedTicketId,
      assignedTo: assignedUser,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate,
      createdAt: newTask.createdAt,
    };
    setTasks(prev => [newTaskWithId, ...prev]);
    closePanel();
  };
  
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => {
      setIsPanelOpen(false);
      setNewTask(initialNewTaskState);
  };

  const resetFilters = () => {
      setSearchTerm('');
      setStatusFilter('all');
      setPriorityFilter('all');
      setCurrentPage(1);
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-auto flex flex-wrap flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-auto">
                <input type="text" placeholder="جستجوی وظیفه..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full sm:w-56 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
                </div>
                <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="all">همه وضعیت‌ها</option>
                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={priorityFilter} onChange={e => {setPriorityFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="all">همه اولویت‌ها</option>
                    <option value="فوری">فوری</option>
                    <option value="بالا">بالا</option>
                    <option value="متوسط">متوسط</option>
                    <option value="پایین">پایین</option>
                </select>
                <button onClick={resetFilters} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Reset filters">
                    <FilterIcon className="w-5 h-5" />
                </button>
            </div>
            <button onClick={openPanel} className="flex-shrink-0 flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
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
                            <td className="px-4 py-3">{task.customer || '-'}</td>
                            <td className="px-4 py-3">{task.assignedTo.name}</td>
                            <td className="px-4 py-3">{task.dueDate}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <button className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Edit"><PencilIcon className="w-5 h-5" /></button>
                                    <button className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add Task Panel */}
      <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
        <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-semibold">ایجاد/ویرایش وظیفه</h3>
            <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleAddTask} className="flex flex-col overflow-hidden flex-grow">
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">عنوان</label>
                    <input type="text" name="title" id="title" value={newTask.title} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="customer" className="block mb-2 text-sm font-medium">مشتری مرتبط</label>
                        <input type="text" name="customer" id="customer" value={newTask.customer} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="relatedTicketId" className="block mb-2 text-sm font-medium">تیکت مرتبط</label>
                        <input type="text" name="relatedTicketId" id="relatedTicketId" value={newTask.relatedTicketId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="assignedTo" className="block mb-2 text-sm font-medium">اختصاص به</label>
                        <select name="assignedTo" id="assignedTo" value={newTask.assignedTo} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                        <option value="">یک کاربر را انتخاب کنید</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block mb-2 text-sm font-medium">مهلت انجام</label>
                        <input type="text" name="dueDate" id="dueDate" placeholder="مثال: 1403/09/01" value={newTask.dueDate} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="priority" className="block mb-2 text-sm font-medium">اولویت</label>
                        <select name="priority" id="priority" value={newTask.priority} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        {['پایین', 'متوسط', 'بالا', 'فوری'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium">وضعیت</label>
                        <select name="status" id="status" value={newTask.status} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 space-i-3 flex-shrink-0">
              <button type="button" onClick={closePanel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">انصراف</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">ذخیره وظیفه</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Tasks;