import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Ticket, TicketStatus, TicketReply, Customer } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { StarIcon } from '../icons/StarIcon';
import SatisfactionSurvey from './SatisfactionSurvey';

// Re-defining colors here to keep component self-contained
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

const initialNewTicketState: Omit<Ticket, 'id' | 'assignee' | 'date' | 'customer' > = {
    subject: '',
    description: '',
    category: 'عمومی',
    priority: 'متوسط',
    status: 'جدید',
};

interface CustomerTicketsProps {
    customer: Customer;
    tickets: Ticket[];
    onAddTicket: (ticket: Omit<Ticket, 'id' | 'assignee' | 'date' >) => void;
    onUpdateTicket: (ticket: Ticket) => void;
    onSurveySubmit: (ticketId: string, rating: number, feedback: string, tags: string[]) => void;
}

// --- Detail View Component ---
const TicketDetailView: React.FC<{ ticket: Ticket; onBack: () => void; onUpdate: (ticket: Ticket) }> = ({ ticket, onBack, onUpdate }) => {
    const [newReply, setNewReply] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket.history]);

    const handleSendReply = () => {
        if (newReply.trim() === '') return;
        const reply: TicketReply = {
            id: `TR-${Date.now()}`,
            author: ticket.customer,
            text: newReply,
            timestamp: new Date().toLocaleDateString('fa-IR-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
            isInternal: false,
        };
        const updatedHistory = [...(ticket.history || []), reply];
        onUpdate({ ...ticket, history: updatedHistory, status: 'در انتظار مشتری' });
        setNewReply('');
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
                        {ticket.history?.filter(r => !r.isInternal).map(reply => (
                            <div key={reply.id} className={`flex items-end gap-3 ${!reply.authorId ? 'justify-end' : ''}`}>
                                {reply.authorId && <img src={reply.authorAvatar} alt={reply.author} className="w-8 h-8 rounded-full order-2" />}
                                <div className={`w-fit max-w-lg rounded-xl px-4 py-3 ${
                                    !reply.authorId 
                                    ? 'bg-gray-200 dark:bg-gray-700 order-1' 
                                    : 'bg-indigo-100 dark:bg-indigo-900/50 order-2'
                                }`}>
                                    <p className="font-semibold text-sm mb-1">{reply.author}</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{reply.text}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-left">{reply.timestamp}</p>
                                </div>
                                {!reply.authorId && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold text-sm order-2">{ticket.customer.charAt(0)}</div>}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>
                </div>
                <div className="w-full md:w-80 border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-700 p-4 space-y-4 flex-shrink-0 overflow-y-auto">
                    <div className="text-sm space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between"><span>وضعیت:</span><span className="font-semibold">{ticket.status}</span></div>
                        <div className="flex justify-between"><span>کارشناس:</span><span className="font-semibold">{ticket.assignee}</span></div>
                        <div className="flex justify-between"><span>اولویت:</span><span className="font-semibold">{ticket.priority}</span></div>
                    </div>
                    {ticket.rating && (
                        <div className="text-sm p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
                           <div className="flex justify-between items-center">
                             <span>امتیاز شما:</span>
                             <div className="flex">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < ticket.rating! ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                             </div>
                           </div>
                        </div>
                    )}
                    <div className="border-t pt-4 space-y-3">
                         <h3 className="font-semibold">ارسال پاسخ</h3>
                        <textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} rows={5} placeholder="پاسخ خود را اینجا بنویسید..." className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                        <button onClick={handleSendReply} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">ارسال</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---
const CustomerTickets: React.FC<CustomerTicketsProps> = ({ customer, tickets, onAddTicket, onUpdateTicket, onSurveySubmit }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newTicket, setNewTicket] = useState(initialNewTicketState);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState<Ticket | null>(null);

  useEffect(() => {
    if (viewingTicket && ['حل شده', 'بسته شده'].includes(viewingTicket.status) && !viewingTicket.surveySubmitted) {
        setShowSurveyModal(viewingTicket);
    }
  }, [viewingTicket]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTicket({ ...newTicket, customer: customer.companyName });
    closePanel();
  };
  
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => {
      setIsPanelOpen(false);
      setNewTicket(initialNewTicketState);
  };
  
  const handleSurvey = (rating: number, feedback: string, tags: string[]) => {
      if (showSurveyModal) {
          onSurveySubmit(showSurveyModal.id, rating, feedback, tags);
          // Also update the viewing ticket to reflect the change immediately
          setViewingTicket(prev => prev ? {...prev, surveySubmitted: true, rating: rating, feedbackTags: tags} : null);
          setShowSurveyModal(null);
      }
  };

  if (viewingTicket) {
    return (
      <>
        <TicketDetailView ticket={viewingTicket} onBack={() => setViewingTicket(null)} onUpdate={onUpdateTicket} />
        {showSurveyModal && (
            <SatisfactionSurvey 
                ticket={showSurveyModal}
                onClose={() => setShowSurveyModal(null)}
                onSubmit={handleSurvey}
            />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">تیکت‌های من</h2>
          <button onClick={openPanel} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
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
                      <th scope="col" className="px-4 py-3">تاریخ</th>
                      <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                      <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                  </tr>
              </thead>
              <tbody>
                  {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className={`px-4 py-3 font-medium text-gray-900 dark:text-white border-r-4 ${priorityColors[ticket.priority]}`}>{ticket.id}</td>
                          <td className="px-4 py-3">{ticket.subject}</td>
                          <td className="px-4 py-3">{ticket.date}</td>
                          <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => setViewingTicket(ticket)} className="flex items-center justify-center mx-auto px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                <EyeIcon className="w-4 h-4 ml-1" />
                                مشاهده
                            </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {tickets.length === 0 && <p className="text-center py-8 text-gray-500">شما هنوز هیچ تیکتی ثبت نکرده‌اید.</p>}
        </div>
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
              <div><label className="block mb-2 text-sm font-medium">موضوع</label><input type="text" name="subject" value={newTicket.subject} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required /></div>
              <div><label className="block mb-2 text-sm font-medium">شرح مشکل</label><textarea name="description" value={newTicket.description} onChange={handleInputChange} rows={8} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700"></textarea></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block mb-2 text-sm font-medium">اولویت</label><select name="priority" value={newTicket.priority} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700"><option value="کم">کم</option><option value="متوسط">متوسط</option><option value="بالا">بالا</option><option value="حیاتی">حیاتی</option></select></div>
                   <div><label className="block mb-2 text-sm font-medium">دسته‌بندی</label><select name="category" value={newTicket.category} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700"><option value="عمومی">عمومی</option><option value="فنی">فنی</option><option value="مالی">مالی</option></select></div>
              </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 flex-shrink-0">
              <button type="button" onClick={closePanel} className="px-4 py-2 text-sm">انصراف</button>
              <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg">ثبت تیکت</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomerTickets;