
import React, { useState, useMemo, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, Customer, User } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { FilterIcon } from '../icons/FilterIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ListBulletIcon } from '../icons/ListBulletIcon';
import { Squares2X2Icon } from '../icons/Squares2X2Icon'; // Assuming you have this or similar icon
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { toShamsi } from '../../utils/date';

const statusColors: { [key in TaskStatus]: string } = {
  'معلق': 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  'در حال انجام': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  'در انتظار': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  'تکمیل شده': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  'لغو شده': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

const priorityColors: { [key in TaskPriority]: string } = {
    'فوری': 'border-red-500 text-red-600',
    'بالا': 'border-orange-500 text-orange-600',
    'متوسط': 'border-yellow-500 text-yellow-600',
    'پایین': 'border-gray-400 text-gray-600',
};

const ITEMS_PER_PAGE = 10;

interface TasksProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onOpenTaskModal: (task?: Task) => void;
    onOpenReminderModal?: (data: any) => void;
    currentUser: User;
}

type ViewMode = 'list' | 'kanban';
type FilterType = 'my_tasks' | 'delegated_tasks' | 'all';

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks, onOpenTaskModal, onOpenReminderModal, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [taskTypeFilter, setTaskTypeFilter] = useState<FilterType>('my_tasks'); // Default to my tasks

  // Effect to handle mobile defaults
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 768) {
              setViewMode('list');
          }
      };
      // Set initial
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredTasks = useMemo(() => 
    tasks.filter(task => {
      const matchesSearch = (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (task.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      let matchesType = true;
      if (taskTypeFilter === 'my_tasks') {
          matchesType = task.assignedTo.id === currentUser.id;
      } else if (taskTypeFilter === 'delegated_tasks') {
          matchesType = task.createdById === currentUser.id && task.assignedTo.id !== currentUser.id;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [searchTerm, statusFilter, priorityFilter, tasks, taskTypeFilter, currentUser]
  );

  // Pagination only for List View
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

  const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      const newStatus = destination.droppableId as TaskStatus;
      
      // Optimistic Update
      setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));
  };

  // Kanban Column Component defined inline to avoid key prop issues in map
  const KanbanColumn: React.FC<{ status: TaskStatus, tasks: Task[] }> = ({ status, tasks }) => (
        <Droppable droppableId={status}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-900/50 rounded-lg flex flex-col h-full ${snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                >
                    <div className={`p-3 border-b-2 font-semibold text-gray-700 dark:text-gray-300 flex justify-between items-center border-${statusColors[status].split(' ')[2]?.replace('border-', '') || 'gray-300'}`}>
                        <span>{status}</span>
                        <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">{tasks.length}</span>
                    </div>
                    <div className="p-2 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group ${snapshot.isDragging ? 'rotate-2' : ''}`}
                                        onClick={() => onOpenTaskModal(task)}
                                    >
                                        {/* Corrected padding: using pr-4 for RTL layout to add space from the right border */}
                                        <div className={`border-r-4 pr-4 ${priorityColors[task.priority].split(' ')[0]}`}>
                                            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1">{task.title}</h4>
                                            {task.customer && <p className="text-xs text-gray-500 mb-2">{task.customer.name}</p>}
                                            
                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex -space-x-2 overflow-hidden" title={`مسئول: ${task.assignedTo.name}`}>
                                                    {task.assignedTo.avatar ? 
                                                        <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800" src={task.assignedTo.avatar} alt=""/> : 
                                                        <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                                    }
                                                </div>
                                                <span className="text-[10px] text-gray-400">{task.dueDate ? toShamsi(task.dueDate) : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
        {/* Top Controls */}
        <div className="flex flex-wrap flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg whitespace-nowrap">
                    <button 
                        onClick={() => setTaskTypeFilter('my_tasks')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${taskTypeFilter === 'my_tasks' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        کارهای من
                    </button>
                    <button 
                        onClick={() => setTaskTypeFilter('delegated_tasks')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${taskTypeFilter === 'delegated_tasks' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        محول شده توسط من
                    </button>
                     <button 
                        onClick={() => setTaskTypeFilter('all')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${taskTypeFilter === 'all' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        همه
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
                <div className="relative w-full sm:w-48">
                    <input 
                        type="text" 
                        placeholder="جستجوی وظیفه..." 
                        value={searchTerm} 
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                        className="w-full pr-10 pl-4 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                
                {/* View Toggle (Hidden on mobile to enforce list view) */}
                <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                        <ListBulletIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>
                </div>

                <button onClick={() => onOpenTaskModal()} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto">
                    <PlusIcon className="w-4 h-4 ml-2" />
                    <span>وظیفه جدید</span>
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            {viewMode === 'list' ? (
                <div className="h-full overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-3">عنوان</th>
                                    <th scope="col" className="px-4 py-3 hidden sm:table-cell">مشتری</th>
                                    <th scope="col" className="px-4 py-3 hidden md:table-cell">مسئول</th>
                                    <th scope="col" className="px-4 py-3">اولویت</th>
                                    <th scope="col" className="px-4 py-3 hidden sm:table-cell">مهلت</th>
                                    <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                                    <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTasks.map((task) => (
                                    <tr key={task.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => onOpenTaskModal(task)}>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                            {task.title}
                                            <div className="sm:hidden text-xs text-gray-500 mt-1">{task.customer?.name}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">{task.customer?.name || '-'}</td>
                                        <td className="px-4 py-3 hidden md:table-cell flex items-center gap-2">
                                            {task.assignedTo.avatar && <img src={task.assignedTo.avatar} className="w-6 h-6 rounded-full" />}
                                            {task.assignedTo.name}
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${priorityColors[task.priority].split(' ')[1]}`}>{task.priority}</td>
                                        <td className="px-4 py-3 text-xs font-mono hidden sm:table-cell">{task.dueDate ? toShamsi(task.dueDate) : '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[task.status]}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => onOpenTaskModal(task)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleCreateReminder(task)} className="p-1 text-gray-500 hover:text-yellow-600"><ClockIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(task.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-4 p-4 border-t dark:border-gray-700">
                          <span className="text-sm text-gray-700 dark:text-gray-400">صفحه {currentPage} از {totalPages}</span>
                          <div className="flex gap-2">
                              <button onClick={() => setCurrentPage(c => Math.max(c - 1, 1))} disabled={currentPage === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRightIcon className="w-4 h-4" /></button>
                              <button onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeftIcon className="w-4 h-4" /></button>
                          </div>
                      </div>
                    )}
                </div>
            ) : (
                <div className="h-full overflow-x-auto overflow-y-hidden pb-2 hidden md:block">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex h-full gap-4 min-w-max px-1">
                            {Object.keys(statusColors).map(key => {
                                const status = key as TaskStatus;
                                const columnTasks = filteredTasks.filter(t => t.status === status);
                                return <KanbanColumn key={status} status={status} tasks={columnTasks} />;
                            })}
                        </div>
                    </DragDropContext>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
