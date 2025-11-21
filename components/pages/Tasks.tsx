import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, Customer } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { FilterIcon } from '../icons/FilterIcon';
import { ClockIcon } from '../icons/ClockIcon';

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

interface TasksProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onOpenTaskModal: (task?: Task) => void;
    onOpenReminderModal?: (data: any) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks, onOpenTaskModal, onOpenReminderModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = useMemo(() => 
    tasks.filter(task =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (task.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
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
  
  const handleDelete = (taskId: string) => {
    if (window.confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
       setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };
  
  const handleCreateReminder = (task: Task) => {
      if (onOpenReminderModal) {
          onOpenReminderModal({
              title: `یادآوری وظیفه: ${task.title}`,
              description: task.description || '',
              sourceType: 'task',
              sourceId: task.id,
              sourcePreview: task.title
          });
      }
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
            <button onClick={() => onOpenTaskModal()} className="flex-shrink-0 flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
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
                            <td className="px-4 py-3">{task.customer?.name || '-'}</td>
                            <td className="px-4 py-3">{task.assignedTo?.name || '-'}</td>
                            <td className="px-4 py-3">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fa-IR') : '-'}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <button onClick={() => handleCreateReminder(task)} className="p-1 text-gray-500 hover:text-indigo-600" title="ایجاد یادآور"><ClockIcon className="w-5 h-5" /></button>
                                    <button onClick={() => onOpenTaskModal(task)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(task.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
              <div><span className="text-sm text-gray-700 dark:text-gray-400">صفحه <span className="font-semibold">{currentPage}</span> از <span className="font-semibold">{totalPages}</span></span></div>
              <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center justify-center p-2 text-gray-500 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon className="w-5 h-5" /></button>
                  <button onClick={() => setCurrentPage(c => Math.max(c - 1, 1))} disabled={currentPage === 1} className="flex items-center justify-center p-2 text-gray-500 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="w-5 h-5" /></button>
              </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;