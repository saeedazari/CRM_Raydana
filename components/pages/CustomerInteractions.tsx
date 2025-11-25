
import React, { useState, useRef, useEffect } from 'react';
import { Customer, Interaction, User, Contact, Ticket, TicketReply, Quote, Invoice, Attachment, Payment, TicketStatus } from '../../types';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { EnvelopeIcon } from '../icons/EnvelopeIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { TicketsIcon } from '../icons/TicketsIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { DocumentIcon } from '../icons/DocumentIcon';
import { BanknotesIcon } from '../icons/BanknotesIcon';
import { EyeIcon } from '../icons/EyeIcon';
import QuotationsList from '../sales/QuotationsList';
import InvoicesList from '../sales/InvoicesList';
import PaymentsList from '../finance/PaymentsList';
import FileUploader from '../FileUploader';
import AttachmentList from '../AttachmentList';
import { toShamsi } from '../../utils/date';

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


interface CustomerInteractionsProps {
    customerId: string;
    customers: Customer[];
    currentUser: User;
    tickets?: Ticket[];
    quotes?: Quote[];
    invoices?: Invoice[];
    payments?: Payment[];
    interactions: Interaction[];
    setInteractions: React.Dispatch<React.SetStateAction<Interaction[]>>;
    onUpdateTicket?: (ticket: Ticket) => void;
    onBack: () => void;
    onOpenReminderModal?: (data: any) => void;
    onViewQuote: (quote: Quote) => void;
    onViewInvoice: (invoice: Invoice) => void;
}

const interactionIcons: Record<Interaction['type'], React.ReactNode> = {
    'یادداشت': <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />,
    'تماس': <PhoneIcon className="w-5 h-5 text-blue-500" />,
    'ایمیل': <EnvelopeIcon className="w-5 h-5 text-green-500" />,
    'جلسه': <UsersIcon className="w-5 h-5 text-purple-500" />,
};

// Custom Radio Component to ensure consistent styling
const InteractionTypeRadio = ({ label, value, checked, onChange }: { label: string, value: string, checked: boolean, onChange: (e: any) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
        <div className="relative flex items-center justify-center">
            <input 
                type="radio" 
                name="type" 
                value={value} 
                checked={checked} 
                onChange={onChange} 
                className="peer sr-only" 
            />
            <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity transform scale-0 peer-checked:scale-100"></div>
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{label}</span>
    </label>
);

const TicketDetailEmbedded: React.FC<{ ticket: Ticket; onBack: () => void; currentUser: User; onUpdate: (ticket: Ticket) => void }> = ({ ticket, onBack, currentUser, onUpdate }) => {
    const [newReply, setNewReply] = useState('');
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket.replies]);

    const handleSendReply = () => {
        if (newReply.trim() === '' && attachments.length === 0) return;

        const reply: TicketReply = {
            id: `R-${Date.now()}`,
            text: newReply,
            isInternal: isInternalNote,
            authorId: currentUser.id,
            authorType: 'User',
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            createdAt: new Date().toISOString(),
            attachments: attachments
        };
        const updatedTicket = { ...ticket, replies: [...(ticket.replies || []), reply] };
        onUpdate(updatedTicket);

        setNewReply('');
        setAttachments([]);
        setIsInternalNote(false);
    };

    return (
        <div className="flex flex-col h-full">
             <div className="flex items-center justify-between mb-4 border-b dark:border-gray-700 pb-2">
                <button onClick={onBack} className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                    بازگشت به لیست
                </button>
                <span className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[200px] md:max-w-none">تیکت #{ticket.id}: {ticket.subject}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border dark:border-gray-700">
                 {ticket.replies?.map(reply => (
                    <div key={reply.id} className={`flex items-end gap-2 md:gap-3 ${reply.authorType === 'Customer' ? 'justify-end' : ''}`}>
                        {reply.authorType === 'User' && <img src={reply.authorAvatar} alt={reply.authorName} className="w-8 h-8 rounded-full order-2" />}
                        <div className={`w-fit max-w-[85%] md:max-w-lg rounded-xl px-3 py-2 md:px-4 md:py-3 ${
                            reply.isInternal 
                                ? 'bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 order-1'
                                : reply.authorType === 'Customer'
                                ? 'bg-gray-200 dark:bg-gray-700 order-1' 
                                : 'bg-indigo-100 dark:bg-indigo-900/50 order-2'
                        }`}>
                             <div className="flex items-center gap-2 mb-1">
                                 <p className="font-semibold text-xs md:text-sm">{reply.authorName}</p>
                                 {reply.isInternal && <LockClosedIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                             </div>
                            <p className="text-xs md:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{reply.text}</p>
                            {reply.attachments && reply.attachments.length > 0 && (
                                <div className="mt-2">
                                    <AttachmentList attachments={reply.attachments} readonly={true} />
                                </div>
                            )}
                            <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-2 text-left">{toShamsi(reply.createdAt, "YYYY/MM/DD HH:mm")}</p>
                        </div>
                        {reply.authorType === 'Customer' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold text-xs md:text-sm order-2">{ticket.customer.name.charAt(0)}</div>}
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>
             <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} rows={3} placeholder="پاسخ خود را اینجا بنویسید..." className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 mb-2"></textarea>
                <div className="mb-3">
                    <FileUploader onUpload={(files) => setAttachments(prev => [...prev, ...files])} compact={false} />
                    <AttachmentList attachments={attachments} onRemove={(id) => setAttachments(prev => prev.filter(a => a.id !== id))} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                        <span>یادداشت داخلی</span>
                    </label>
                    <button onClick={handleSendReply} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">ارسال پاسخ</button>
                </div>
            </div>
        </div>
    );
}

const CustomerInteractions: React.FC<CustomerInteractionsProps> = ({ customerId, customers, currentUser, tickets = [], quotes = [], invoices = [], payments = [], interactions, setInteractions, onUpdateTicket, onBack, onOpenReminderModal, onViewQuote, onViewInvoice }) => {
    const [customer, setCustomer] = useState<Customer | null>(() => customers.find(c => c.id === customerId) || null);
    const [activeTab, setActiveTab] = useState<'interactions' | 'tickets' | 'quotes' | 'invoices' | 'payments' | 'documents'>('interactions');
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

    const [newInteractionText, setNewInteractionText] = useState('');
    const [newInteractionType, setNewInteractionType] = useState<Interaction['type']>('یادداشت');
    const [selectedContactId, setSelectedContactId] = useState<string>('');
    const [editingInteraction, setEditingInteraction] = useState<{ id: string; text: string } | null>(null);
    
    // Documents State
    const [documents, setDocuments] = useState<Attachment[]>(customer?.documents || []);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const customerTickets = tickets.filter(t => t.customerId === customerId);
    const customerQuotes = quotes.filter(q => q.customerId === customerId);
    const customerInvoices = invoices.filter(i => i.customerId === customerId);
    const customerPayments = payments.filter(p => p.partyId === customerId);
    const customerInteractions = interactions.filter(i => i.customerId === customerId);

    const hasPermission = (permission: string) => {
      if (!permission) return true;
      if (!currentUser.role || !currentUser.role.permissions) return false;
      const perms = currentUser.role.permissions.split(',');
      return perms.includes(permission);
    };

    const hasSalesAccess = hasPermission('view_sales');
    const hasTicketAccess = hasPermission('view_tickets');
    const hasFinanceAccess = hasPermission('view_finance');
    // Explicit check for invoices if separate, otherwise fallback to sales/finance
    const hasInvoiceAccess = hasPermission('view_invoices') || hasSalesAccess || hasFinanceAccess;


    useEffect(() => {
        if (scrollContainerRef.current && activeTab === 'interactions') {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [customerInteractions, activeTab]);

    const handleAddInteraction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newInteractionText.trim() === '' || !customer) return;

        const selectedContact = customer.contacts.find(c => c.id === selectedContactId);

        const newInteraction: Interaction = {
            id: `INT-${Date.now()}`,
            customerId: customer.id,
            contactId: selectedContact?.id,
            contactName: selectedContact?.name,
            userId: currentUser.id,
            user: currentUser,
            text: newInteractionText,
            type: newInteractionType,
            createdAt: new Date().toISOString(),
        };

        setInteractions(prev => [...prev, newInteraction]);
        setNewInteractionText('');
        setNewInteractionType('یادداشت');
        setSelectedContactId('');
    };
    
    const handleDeleteInteraction = (interactionId: string) => {
        if (window.confirm('آیا از حذف این تعامل اطمینان دارید؟')) {
            setInteractions(prev => prev.filter(i => i.id !== interactionId));
        }
    };

    const handleUpdateInteraction = () => {
        if (!editingInteraction) return;
        setInteractions(prev => prev.map(i => 
            i.id === editingInteraction.id ? { ...i, text: editingInteraction.text } : i
        ));
        setEditingInteraction(null);
    };

    const handleStartEditing = (interaction: Interaction) => {
        setEditingInteraction({ id: interaction.id, text: interaction.text });
    };
    
    const handleCreateReminder = (interaction: Interaction) => {
        if (onOpenReminderModal) {
            onOpenReminderModal({
                title: `یادآوری تعامل با ${customer?.name}`,
                description: `پیرو تعامل: ${interaction.text.substring(0, 100)}...`,
                sourceType: 'interaction',
                sourceId: interaction.id,
                sourcePreview: interaction.text.substring(0, 60) + '...'
            });
        }
    };
    
    const handleTicketClick = (ticket: Ticket) => {
        setViewingTicket(ticket);
    };
    
    const handleUploadDocument = (newFiles: Attachment[]) => {
        setDocuments(prev => [...prev, ...newFiles]);
        // In a real app, you would update the customer object via API here
        if (customer) {
            const updatedCustomer = { ...customer, documents: [...documents, ...newFiles] };
            setCustomer(updatedCustomer);
        }
    };
    
    const handleDeleteDocument = (fileId: string) => {
        if (window.confirm('آیا از حذف این سند اطمینان دارید؟')) {
            setDocuments(prev => prev.filter(d => d.id !== fileId));
             if (customer) {
                const updatedCustomer = { ...customer, documents: documents.filter(d => d.id !== fileId) };
                setCustomer(updatedCustomer);
            }
        }
    };

    if (!customer) return <div className="p-8 text-center">مشتری یافت نشد.</div>

    return (
        <div className="bg-white dark:bg-gray-800 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col border-b dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between p-3 md:p-4">
                    <div className="flex items-center w-full">
                         <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-2 md:ml-4 flex-shrink-0">
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold truncate">
                            پروفایل <span className="text-indigo-600 dark:text-indigo-400">{customer.name}</span>
                        </h2>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex px-2 md:px-4 space-i-8 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('interactions')} 
                        className={`flex items-center whitespace-nowrap pb-3 px-2 border-b-2 transition-colors font-medium text-sm ${activeTab === 'interactions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        <ClipboardDocumentListIcon className="w-4 h-4 ml-2"/>
                        تاریخچه تعاملات
                    </button>
                    
                    {hasTicketAccess && (
                        <button 
                            onClick={() => setActiveTab('tickets')} 
                            className={`flex items-center whitespace-nowrap pb-3 px-2 border-b-2 transition-colors font-medium text-sm ${activeTab === 'tickets' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <TicketsIcon className="w-4 h-4 ml-2"/>
                            تیکت‌ها ({customerTickets.length})
                        </button>
                    )}

                    {hasSalesAccess && (
                        <button 
                            onClick={() => setActiveTab('quotes')} 
                            className={`flex items-center whitespace-nowrap pb-3 px-2 border-b-2 transition-colors font-medium text-sm ${activeTab === 'quotes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <DocumentDuplicateIcon className="w-4 h-4 ml-2"/>
                            پیش‌فاکتورها ({customerQuotes.length})
                        </button>
                    )}

                    {hasInvoiceAccess && (
                        <button 
                            onClick={() => setActiveTab('invoices')} 
                            className={`flex items-center whitespace-nowrap pb-3 px-2 border-b-2 transition-colors font-medium text-sm ${activeTab === 'invoices' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <CreditCardIcon className="w-4 h-4 ml-2"/>
                            فاکتورها ({customerInvoices.length})
                        </button>
                    )}

                    {hasFinanceAccess && (
                        <button 
                            onClick={() => setActiveTab('payments')} 
                            className={`flex items-center whitespace-nowrap pb-3 px-2 border-b-2 transition-colors font-medium text-sm ${activeTab === 'payments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <BanknotesIcon className="w-4 h-4 ml-2"/>
                            تراکنش‌ها ({customerPayments.length})
                        </button>
                    )}

                    <button 
                        onClick={() => setActiveTab('documents')} 
                        className={`flex items-center whitespace-nowrap pb-3 px-2 border-b-2 transition-colors font-medium text-sm ${activeTab === 'documents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        <DocumentIcon className="w-4 h-4 ml-2"/>
                        اسناد ({documents.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                {activeTab === 'interactions' && (
                    <>
                         {/* Timeline */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollContainerRef}>
                            <div className="relative border-r-2 border-gray-200 dark:border-gray-700 mr-2 md:mr-4 pr-4">
                                {customerInteractions.map((interaction) => {
                                    const isEditing = editingInteraction?.id === interaction.id;
                                    const canEdit = interaction.userId === currentUser.id;
                                    return (
                                        <div key={interaction.id} className="mb-6 md:mb-8 flex items-start">
                                            {/* Timeline Dot: Adjusted positioning for mobile */}
                                            <div className="absolute -right-[0.4rem] md:-right-[0.55rem] top-4 md:top-5 h-3 w-3 md:h-4 md:w-4 rounded-full bg-gray-200 dark:bg-gray-700 border-2 md:border-4 border-white dark:border-gray-800"></div>

                                            <div className="mr-4 md:mr-8 flex-1 group min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                                                        <img src={interaction.user.avatar} alt={interaction.user.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{interaction.user.name}</p>
                                                                {interactionIcons[interaction.type]}
                                                            </div>
                                                            <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 truncate">
                                                                {toShamsi(interaction.createdAt, "YYYY/MM/DD HH:mm")}
                                                                {interaction.contactName && <span className="text-gray-500 dark:text-gray-400 hidden sm:inline"> در ارتباط با <span className="font-medium">{interaction.contactName}</span></span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleCreateReminder(interaction)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400" aria-label="ایجاد یادآور" title="ایجاد یادآور">
                                                            <ClockIcon className="w-4 h-4" />
                                                        </button>
                                                        {canEdit && !isEditing && (
                                                            <>
                                                                <button onClick={() => handleStartEditing(interaction)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400" aria-label="ویرایش">
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDeleteInteraction(interaction.id)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500" aria-label="حذف">
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                                                     {isEditing ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                value={editingInteraction.text}
                                                                onChange={(e) => setEditingInteraction({ ...editingInteraction, text: e.target.value })}
                                                                className="w-full p-2 text-sm bg-white dark:bg-gray-700 border rounded-lg"
                                                                rows={4}
                                                                autoFocus
                                                            />
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => setEditingInteraction(null)} className="px-3 py-1 text-sm rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                                    انصراف
                                                                </button>
                                                                <button onClick={handleUpdateInteraction} className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                                                    ذخیره
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{interaction.text}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                 {customerInteractions.length === 0 && (
                                    <div className="text-center text-gray-500 py-10">
                                        هیچ تعاملی برای این مشتری ثبت نشده است.
                                    </div>
                                )}
                            </div>
                        </div>
                         {/* Add Interaction Form */}
                        <div className="p-4 border-t dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-900/50">
                            <form onSubmit={handleAddInteraction} className="flex flex-col sm:flex-row items-start gap-4">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full mt-2 hidden sm:block" />
                                <div className="flex-1 w-full">
                                    <textarea
                                        value={newInteractionText}
                                        onChange={(e) => setNewInteractionText(e.target.value)}
                                        rows={3}
                                        placeholder="یادداشت خود را اینجا بنویسید..."
                                        className="w-full p-2.5 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    ></textarea>
                                    <div className="flex flex-col gap-3 mt-3">
                                        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-1">
                                            <InteractionTypeRadio 
                                                label="یادداشت" 
                                                value="یادداشت" 
                                                checked={newInteractionType === 'یادداشت'} 
                                                onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} 
                                            />
                                            <InteractionTypeRadio 
                                                label="تماس" 
                                                value="تماس" 
                                                checked={newInteractionType === 'تماس'} 
                                                onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} 
                                            />
                                            <InteractionTypeRadio 
                                                label="ایمیل" 
                                                value="ایمیل" 
                                                checked={newInteractionType === 'ایمیل'} 
                                                onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} 
                                            />
                                            <InteractionTypeRadio 
                                                label="جلسه" 
                                                value="جلسه" 
                                                checked={newInteractionType === 'جلسه'} 
                                                onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <select value={selectedContactId} onChange={e => setSelectedContactId(e.target.value)} className="flex-1 sm:flex-none sm:w-40 p-2 text-sm bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                                <option value="">عمومی (شرکت)</option>
                                                {customer.contacts.map(contact => (
                                                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                                                ))}
                                            </select>
                                            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">
                                                ثبت
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}
                {activeTab === 'tickets' && hasTicketAccess && (
                    <div className="flex-1 overflow-y-auto p-2 md:p-4">
                        {viewingTicket ? (
                             <TicketDetailEmbedded 
                                ticket={viewingTicket} 
                                onBack={() => setViewingTicket(null)} 
                                currentUser={currentUser} 
                                onUpdate={onUpdateTicket || (() => {})} 
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-2 py-2 md:px-4 md:py-3">موضوع</th>
                                            <th scope="col" className="px-2 py-2 md:px-4 md:py-3">اولویت</th>
                                            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 hidden sm:table-cell">دسته‌بندی</th>
                                            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 hidden sm:table-cell">تاریخ</th>
                                            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 text-center">وضعیت</th>
                                            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 text-center">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerTickets.map((ticket) => (
                                            <tr key={ticket.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className={`px-2 py-2 md:px-4 md:py-3 font-medium text-gray-900 dark:text-white border-r-4 ${priorityColors[ticket.priority]}`}>{ticket.subject}</td>
                                                <td className="px-2 py-2 md:px-4 md:py-3">{ticket.priority}</td>
                                                <td className="px-2 py-2 md:px-4 md:py-3 hidden sm:table-cell">{ticket.category}</td>
                                                <td className="px-2 py-2 md:px-4 md:py-3 hidden sm:table-cell">{toShamsi(ticket.createdAt)}</td>
                                                <td className="px-2 py-2 md:px-4 md:py-3 text-center">
                                                    <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-3 text-center">
                                                    <button onClick={() => handleTicketClick(ticket)} className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" aria-label="View Ticket"><EyeIcon className="w-5 h-5" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {customerTickets.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center">هیچ تیکتی یافت نشد.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'quotes' && hasSalesAccess && (
                     <div className="flex-1 overflow-y-auto p-2 md:p-4">
                        <QuotationsList 
                            quotes={customerQuotes} 
                            onEdit={onViewQuote}
                            onCreateInvoiceFromQuote={() => {}}
                            hideControls={true}
                            companyInfo={{name: '', address: '', phone: '', email: '', website: ''}}
                        />
                     </div>
                )}
                {activeTab === 'invoices' && hasInvoiceAccess && (
                     <div className="flex-1 overflow-y-auto p-2 md:p-4">
                        <InvoicesList 
                            invoices={customerInvoices} 
                            onEdit={onViewInvoice}
                            hideControls={true}
                            companyInfo={{name: '', address: '', phone: '', email: '', website: ''}}
                        />
                     </div>
                )}
                {activeTab === 'payments' && hasFinanceAccess && (
                     <div className="flex-1 overflow-y-auto p-2 md:p-4">
                        <PaymentsList 
                            payments={customerPayments}
                            hideControls={true}
                        />
                     </div>
                )}
                {activeTab === 'documents' && (
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-4">آپلود سند جدید</h3>
                            <FileUploader onUpload={handleUploadDocument} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">اسناد ذخیره شده</h3>
                            {documents.length > 0 ? (
                                <AttachmentList attachments={documents} onRemove={handleDeleteDocument} />
                            ) : (
                                <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed dark:border-gray-700">
                                    هیچ سندی برای این مشتری آپلود نشده است.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerInteractions;
