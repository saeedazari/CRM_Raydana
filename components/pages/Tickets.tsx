import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Ticket, User, TicketStatus, TicketReply, Customer } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { FilterIcon } from '../icons/FilterIcon';
import { ClipboardDocumentCheckIcon } from '../icons/ClipboardDocumentCheckIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';

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

const mockTickets: Ticket[] = [
    { id: 'TKT-721', subject: 'مشکل در ورود به پنل کاربری', description: 'کاربر اعلام کرده نمی‌تواند وارد پنل شود.', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[0], assigneeId: 'U1', status: 'در حال بررسی', priority: 'بالا', createdAt: '1403/05/01', category: 'فنی', replies: [
        {id: 'R1', authorId: 'U1', authorType: 'User', authorName: 'علی رضایی', text: 'در حال بررسی مشکل هستیم.', isInternal: false, createdAt: '1403/05/01 10:30', authorAvatar: mockUsers[0].avatar},
        {id: 'R2', authorType: 'Customer', authorName: 'شرکت آلفا', text: 'ممنون از پیگیری شما.', isInternal: false, createdAt: '1403/05/01 10:35'},
        {id: 'R3', authorId: 'U1', authorType: 'User', authorName: 'علی رضایی', text: 'مشکل از سمت سرور بود، لطفا مجدد تست کنید.', isInternal: true, createdAt: '1403/05/01 11:00', authorAvatar: mockUsers[0].avatar},
    ]},
    { id: 'TKT-720', subject: 'سوال در مورد صورتحساب', customer: mockCustomers[1], customerId: 'C2', assignee: mockUsers[1], assigneeId: 'U2', status: 'جدید', priority: 'متوسط', createdAt: '1403/05/01', category: 'مالی' },
    { id: 'TKT-719', subject: 'گزارش باگ در ماژول گزارشات', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[0], assigneeId: 'U1', status: 'حل شده', priority: 'بالا', createdAt: '1403/04/31', category: 'فنی', surveySubmitted: false },
    { id: 'TKT-718', subject: 'درخواست افزودن ویژگی جدید', customer: mockCustomers[1], customerId: 'C2', status: 'در انتظار مشتری', priority: 'کم', createdAt: '1403/04/30', category: 'عمومی' },
];


const statusColors: { [key in TicketStatus]: string } = {
  'جدید': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'در حال بررسی': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'در انتظار مشتری': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'حل شده': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'بسته شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'بازگشایی شده': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

const priorityColors: { [key in Ticket['priority']]: string } = {
    'حیاتی': 'border-red-500',
    'بالا': 'border-orange-500',
    'متوسط': 'border-yellow-500',
    'کم': 'border-gray-400',
};

const ITEMS_PER_PAGE = 8;

const initialNewTicketState: { subject: string; description: string; customerId: string; priority: Ticket['priority']; category: Ticket['category'] } = {
    subject: '',
    description: '',
    customerId: '',
    priority: 'متوسط',
    category: 'عمومی',
};

interface TicketsProps {
    customers: Customer[];
    onCreateTaskFromTicket: (ticketId: string, ticketSubject: string, priority: string, customerId: string) => void;
}

const TicketDetailView: React.FC<{ ticket: Ticket; onBack: () => void; users: User[], currentUser: User, onUpdate: (ticket: Ticket) => void }> = ({ ticket, onBack, users, currentUser, onUpdate }) => {
    const [newReply, setNewReply] = useState('');
    const [isInternalNote, setIsInternalNote] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.replies]);

    const handleUpdate = (updates: Partial<Ticket>) => {
        onUpdate({ ...ticket, ...updates });
    };
    
    const handleSendReply = () => {
        if (newReply.trim() === '' || !ticket) return;
        
        const reply: TicketReply = {
            id: `R-${Date.now()}`,
            text: newReply,
            isInternal: isInternalNote,
            authorId: currentUser.id,
            authorType: 'User',
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            createdAt: new Date().toLocaleString('fa-IR'),
        };
        const updatedTicket = { ...ticket, replies: [...(ticket.replies || []), reply] };
        onUpdate(updatedTicket);

        setNewReply('');
        setIsInternalNote(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center">
                     <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-4">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">{ticket.subject}</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">شناسه: {ticket.id}</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                    <div className="space-y-4">
                         {ticket.replies?.map(reply => (
                            <div key={reply.id} className={`flex items-end gap-3 ${reply.authorType === 'Customer' ? 'justify-end' : ''}`}>
                                {reply.authorType === 'User' && <img src={users.find(u => u.id === reply.authorId)?.avatar} alt={reply.authorName} className="w-8 h-8 rounded-full order-2" />}
                                <div className={`w-fit max-w-lg rounded-xl px-4 py-3 ${
                                    reply.isInternal 
                                        ? 'bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 order-1'
                                        : reply.authorType === 'Customer'
                                        ? 'bg-gray-200 dark:bg-gray-700 order-1' 
                                        : 'bg-indigo-100 dark:bg-indigo-900/50 order-2'
                                }`}>
                                     <div className="flex items-center gap-3 mb-1">
                                         <p className="font-semibold text-sm">{reply.authorName || (reply.authorType === 'Customer' ? ticket.customer.companyName : 'کاربر حذف شده')}</p>
                                         {reply.isInternal && <LockClosedIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                                     </div>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{reply.text}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-left">{new Date(reply.createdAt).toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                {reply.authorType === 'Customer' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold text-sm order-2">{ticket.customer.companyName.charAt(0)}</div>}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>
                </div>
                <div className="w-full md:w-80 border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-700 p-4 space-y-6 flex-shrink-0 overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium">وضعیت</label>
                         <select value={ticket.status} onChange={(e) => handleUpdate({ status: e.target.value as TicketStatus })} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div className="text-sm space-y-3">
                        <div className="flex justify-between"><span>مشتری:</span><span className="font-semibold">{ticket.customer.companyName}</span></div>
                        <div className="flex justify-between"><span>کارشناس:</span><span className="font-semibold">{ticket.assignee?.name || 'تخصیص نیافته'}</span></div>
                        <div className="flex justify-between"><span>اولویت:</span><span className="font-semibold">{ticket.priority}</span></div>
                        <div className="flex justify-between"><span>دسته‌بندی:</span><span className="font-semibold">{ticket.category}</span></div>
                        <div className="flex justify-between"><span>تاریخ ایجاد:</span><span className="font-semibold">{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span></div>
                    </div>
                    <div className="border-t pt-4 space-y-3">
                         <h3 className="font-semibold">پاسخ به تیکت</h3>
                        <textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} rows={5} placeholder="پاسخ خود را اینجا بنویسید..." className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                            <span>ثبت به عنوان یادداشت داخلی (مخفی از مشتری)</span>
                        </label>
                        <button onClick={handleSendReply} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">ارسال پاسخ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Tickets: React.FC<TicketsProps> = ({ customers, onCreateTaskFromTicket }) => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState(initialNewTicketState);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => 
    tickets.filter(ticket =>
      (ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ticket.customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || ticket.status === statusFilter) &&
      (priorityFilter === 'all' || ticket.priority === priorityFilter)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [searchTerm, statusFilter, priorityFilter, tickets]
  );

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === newTicketData.customerId);
    if(!customer) {
        alert("لطفا یک مشتری انتخاب کنید.");
        return;
    }
    const newTicket: Ticket = {
        id: `TKT-${Date.now()}`,
        status: 'جدید',
        ...newTicketData,
        customer,
        createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    setTickets(prev => [newTicket, ...prev]);
    closePanel();
  };
  
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => {
      setIsPanelOpen(false);
      setNewTicketData(initialNewTicketState);
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      if (viewingTicket?.id === updatedTicket.id) {
          setViewingTicket(updatedTicket);
      }
  };

  const handleAssigneeChange = (ticketId: string, assigneeId: string) => {
      const assignee = users.find(u => u.id === assigneeId);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignee, assigneeId } : t));
  };
  
  const currentUser = users[0] || null;

  if (viewingTicket) {
    return <TicketDetailView ticket={viewingTicket} onBack={() => setViewingTicket(null)} users={users} currentUser={currentUser} onUpdate={handleUpdateTicket} />;
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 flex-wrap">
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="relative w-full sm:w-auto">
              <input type="text" placeholder="جستجوی تیکت..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full sm:w-56 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
            </div>
            <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">همه وضعیت‌ها</option>
                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={priorityFilter} onChange={e => {setPriorityFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">همه اولویت‌ها</option>
                <option value="حیاتی">حیاتی</option>
                <option value="بالا">بالا</option>
                <option value="متوسط">متوسط</option>
                <option value="کم">کم</option>
            </select>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); }} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Reset filters">
                <FilterIcon className="w-5 h-5" />
            </button>
          </div>
          <button onClick={openPanel} className="flex-shrink-0 flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
            <PlusIcon className="w-5 h-5 ml-2" />
            <span>تیکت جدید</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-4 py-3">شناسه</th>
                      <th scope="col" className="px-4 py-3">موضوع</th>
                      <th scope="col" className="px-4 py-3">مشتری</th>
                      <th scope="col" className="px-4 py-3">کارشناس</th>
                      <th scope="col" className="px-4 py-3">تاریخ</th>
                      <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                      <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                  </tr>
              </thead>
              <tbody>
                  {paginatedTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className={`px-4 py-3 font-medium text-gray-900 dark:text-white border-r-4 ${priorityColors[ticket.priority]}`}>{ticket.id}</td>
                          <td className="px-4 py-3">{ticket.subject}</td>
                          <td className="px-4 py-3">{ticket.customer.companyName}</td>
                          <td className="px-4 py-3">
                            <select value={ticket.assignee?.id || ''} onChange={(e) => handleAssigneeChange(ticket.id, e.target.value)} className="w-full p-1.5 border-0 bg-transparent rounded-lg dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">تخصیص نیافته</option>
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</td>
                          <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                                <button onClick={() => setViewingTicket(ticket)} className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" aria-label="View Ticket"><EyeIcon className="w-5 h-5" /></button>
                                <button onClick={() => onCreateTaskFromTicket(ticket.id, ticket.subject, ticket.priority, ticket.customerId)} className="p-1 text-gray-500 hover:text-green-600 dark:hover:text-green-400" aria-label="Create Task"><ClipboardDocumentCheckIcon className="w-5 h-5" /></button>
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
       <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
        <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-semibold">ثبت تیکت جدید</h3>
            <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleAddTicket} className="flex flex-col overflow-hidden flex-grow">
            <div className="p-6 space-y-4 overflow-y-auto flex-grow">
              <div><label htmlFor="customerId" className="block mb-2 text-sm font-medium">مشتری</label>
                <select name="customerId" id="customerId" value={newTicketData.customerId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                    <option value="">انتخاب کنید...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
              <div><label htmlFor="subject" className="block mb-2 text-sm font-medium">موضوع</label><input type="text" name="subject" id="subject" value={newTicketData.subject} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required /></div>
              <div><label htmlFor="description" className="block mb-2 text-sm font-medium">شرح مشکل</label><textarea name="description" id="description" value={newTicketData.description} onChange={handleInputChange} rows={5} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label htmlFor="priority" className="block mb-2 text-sm font-medium">اولویت</label><select name="priority" id="priority" value={newTicketData.priority} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"><option value="کم">کم</option><option value="متوسط">متوسط</option><option value="بالا">بالا</option><option value="حیاتی">حیاتی</option></select></div>
                   <div><label htmlFor="category" className="block mb-2 text-sm font-medium">دسته‌بندی</label><select name="category" id="category" value={newTicketData.category} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"><option value="عمومی">عمومی</option><option value="فنی">فنی</option><option value="مالی">مالی</option><option value="پشتیبانی">پشتیبانی</option></select></div>
              </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 space-i-3 flex-shrink-0">
              <button type="button" onClick={closePanel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">انصراف</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">ثبت تیکت</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Tickets;