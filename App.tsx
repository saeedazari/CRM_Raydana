
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    ... (Same as before)
*/
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/pages/Customers';
import Tickets from './components/pages/Tickets';
import Tasks from './components/pages/Tasks';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import Chat from './components/pages/Chat';
import Opportunities from './components/pages/Opportunities';
import Leads from './components/pages/Leads';
import Products from './components/pages/Products';
import Quotes from './components/pages/Quotes';
import Invoices from './components/pages/Invoices';
import Reminders from './components/pages/Reminders';
import Calendar from './components/pages/Calendar';
import ReminderModal from './components/ReminderModal';
import TaskModal from './components/TaskModal';
import NotificationToast from './components/NotificationToast';
import HeaderNotifications from './components/HeaderNotifications';
import { User, Customer, Ticket, Interaction, Lead, Opportunity, Product, Quote, Invoice, Role, KnowledgeBaseCategory, KnowledgeBaseArticle, Contact, Reminder, Task, Vendor, PurchaseOrder, Payment, InvoiceStatus, CompanyInfo, InventoryTransaction, InventoryTransactionType } from './types';
import { HamburgerIcon } from './components/icons/HamburgerIcon';
import CustomerInteractions from './components/pages/CustomerInteractions';
import UserProfile from './components/UserProfile';
import ThemeToggle from './components/ThemeToggle';
import LoginPage from './components/LoginPage';
import CustomerPortal from './components/portals/CustomerPortal';
import KnowledgeBase from './components/pages/KnowledgeBase';
import VendorsList from './components/purchasing/VendorsList';
import PurchaseOrdersList from './components/purchasing/PurchaseOrdersList';
import PurchaseOrderEditor from './components/purchasing/PurchaseOrderEditor';
import PaymentsList from './components/finance/PaymentsList';
import PaymentModal from './components/finance/PaymentModal';
import GlobalSearch from './components/GlobalSearch';
import Inventory from './components/pages/Inventory';

// --- MOCK DATA AGGREGATION ---
// ... (Existing mock roles/users/customers/tickets/kb data from previous version)
const mockRoles: Role[] = [
    { id: 'R1', name: 'مدیر کل', permissions: 'view_customers,create_customers,edit_customers,delete_customers,view_tickets,create_tickets,edit_tickets,delete_tickets,view_sales,create_sales,edit_sales,delete_sales,view_reports,manage_users,manage_roles' },
    { id: 'R2', name: 'کارشناس پشتیبانی', permissions: 'view_customers,view_tickets,create_tickets,edit_tickets' },
    { id: 'R3', name: 'کارشناس فروش', permissions: 'view_customers,create_customers,view_sales,create_sales,edit_sales' },
];

const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2' },
  { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R3', avatar: 'https://i.pravatar.cc/40?u=U3' },
];

const mockContacts: Record<string, Contact[]> = {
    C1: [
        { id: 'P1', name: 'آقای الف', phone: '09121112233', position: 'مدیرعامل', isPrimary: true },
        { id: 'P2', name: 'خانم ب', phone: '09122223344', position: 'مدیر فنی', isPrimary: false },
    ],
    C2: [
        { id: 'P3', name: 'خانم ب', phone: '09123334455', position: 'رابط اصلی', isPrimary: true },
    ],
    C3: [
        { id: 'P4', name: 'آقای ج', phone: '09124445566', position: 'مدیر فروش', isPrimary: true },
    ],
    C4: [
        { id: 'P5', name: 'خانم د', phone: '09125556677', position: 'مدیر مالی', isPrimary: true },
    ]
}

const mockCustomers: Customer[] = [
  { id: 'C1', name: 'شرکت آلفا', contacts: mockContacts.C1, username: 'alpha', email: 'info@alpha.com', phone: '021-12345678', status: 'فعال', portalToken: 'alpha-secret-token-xyz', supportEndDate: '1404/05/01', economicCode: '123456', nationalId: '10101010' },
  { id: 'C2', name: 'تجارت بتا', contacts: mockContacts.C2, username: 'beta', email: 'contact@beta.com', phone: '021-87654321', status: 'غیرفعال', portalToken: 'beta-secret-token-abc', supportEndDate: '1403/10/01' },
  { id: 'C3', name: 'صنایع گاما', contacts: mockContacts.C3, username: 'gamma', email: 'office@gamma.com', phone: '021-11223344', status: 'فعال' },
  { id: 'C4', name: 'راهکارهای دلتا', contacts: mockContacts.C4, username: 'delta', email: 'sales@delta.com', phone: '021-55667788', status: 'معلق' },
];

const mockTicketsData: Ticket[] = [
    { id: 'TKT-721', subject: 'مشکل در ورود به پنل کاربری', description: 'کاربر اعلام کرده نمی‌تواند وارد پنل شود.', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[0], assigneeId: 'U1', status: 'در حال بررسی', priority: 'بالا', createdAt: '1403/05/01', category: 'فنی', replies: [
        {id: 'R1', authorId: 'U1', authorType: 'User', authorName: 'علی رضایی', authorAvatar: mockUsers[0].avatar, text: 'در حال بررسی مشکل هستیم.', isInternal: false, createdAt: '1403/05/01 10:30'},
        {id: 'R2', authorType: 'Customer', authorName: 'شرکت آلفا', text: 'ممنون از پیگیری شما.', isInternal: false, createdAt: '1403/05/01 10:35'},
        {id: 'R3', authorId: 'U1', authorType: 'User', authorName: 'علی رضایی', authorAvatar: mockUsers[0].avatar, text: 'مشکل از سمت سرور بود، لطفا مجدد تست کنید.', isInternal: true, createdAt: '1403/05/01 11:00'},
    ]},
    { id: 'TKT-720', subject: 'سوال در مورد صورتحساب', customer: mockCustomers[1], customerId: 'C2', assignee: mockUsers[1], assigneeId: 'U2', status: 'جدید', priority: 'متوسط', createdAt: '1403/05/01', category: 'مالی' },
    { id: 'TKT-719', subject: 'گزارش باگ در ماژول گزارشات', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[0], assigneeId: 'U1', status: 'حل شده', priority: 'بالا', createdAt: '1403/04/31', category: 'فنی', surveySubmitted: false },
    { id: 'TKT-718', subject: 'درخواست افزودن ویژگی جدید', customer: mockCustomers[1], customerId: 'C2', status: 'در انتظار مشتری', priority: 'کم', createdAt: '1403/04/30', category: 'عمومی' },
    { id: 'TKT-722', subject: 'نحوه کار با API', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[1], assigneeId: 'U2', status: 'بسته شده', priority: 'متوسط', createdAt: '1403/04/28', category: 'فنی', surveySubmitted: true, rating: 5, feedbackTags: ['پاسخ سریع', 'دانش فنی بالا'] },
];

const mockKbCategories: KnowledgeBaseCategory[] = [
    { id: 'KBC1', name: 'راهنمای شروع' },
    { id: 'KBC2', name: 'عیب‌یابی فنی' },
    { id: 'KBC3', name: 'سوالات متداول فروش' },
    { id: 'KBC4', name: 'سیاست‌های داخلی' },
];

const mockKbArticles: KnowledgeBaseArticle[] = [
    { id: 'KBA1', title: 'چگونه یک تیکت جدید ثبت کنیم؟', content: 'برای ثبت تیکت جدید، از منوی پورتال مشتریان گزینه تیکت‌ها را انتخاب کرده و روی دکمه <b>"تیکت جدید"</b> کلیک کنید... <br/> <img src="https://via.placeholder.com/400x200.png?text=Ticket+Example" alt="Example"/>', categoryId: 'KBC1', tags: ['تیکت', 'مشتری'], authorId: 'U1', createdAt: '1403/04/15', visibility: 'public' },
    { id: 'KBA2', title: 'خطای 500 هنگام ورود به پنل', content: 'این خطا معمولا به دلیل مشکلات سمت سرور است. لطفاً ابتدا کش مرورگر خود را پاک کرده و مجددا تلاش کنید. در صورت عدم رفع مشکل، با <a href="mailto:support@example.com">پشتیبانی</a> تماس بگیرید.', categoryId: 'KBC2', tags: ['خطا', 'ورود', 'فنی'], authorId: 'U2', createdAt: '1403/04/20', visibility: 'public' },
    { id: 'KBA3', title: 'راهنمای قیمت‌گذاری سرویس‌ها', content: 'این یک سند داخلی است و نباید در دسترس مشتری قرار گیرد. پلن‌های قیمت‌گذاری به شرح زیر است...', categoryId: 'KBC3', tags: ['قیمت', 'فروش'], authorId: 'U3', createdAt: '1403/05/01', visibility: 'internal' },
    { id: 'KBA4', title: 'سیاست مرخصی کارکنان', content: 'هر کارمند در سال مجاز به استفاده از ۲۴ روز مرخصی با حقوق است...', categoryId: 'KBC4', tags: ['منابع انسانی', 'داخلی'], authorId: 'U1', createdAt: '1403/01/10', visibility: 'internal' },
];

const mockTasksData: Task[] = [
    { id: 'TSK1', title: 'پیگیری تیکت #721', description: 'مشتری در مورد ورود به پنل کاربری مشکل دارد.', customer: mockCustomers[0], relatedTicketId: 'TKT-721', assignedTo: mockUsers[0], priority: 'بالا', status: 'در حال انجام', dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'TSK2', title: 'آماده‌سازی پیش‌فاکتور برای تجارت بتا', description: '', customer: mockCustomers[1], assignedTo: mockUsers[0], priority: 'متوسط', status: 'معلق', dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'TSK3', title: 'جلسه دمو با مشتری جدید', description: 'معرفی ویژگی‌های جدید محصول', assignedTo: mockUsers[1], priority: 'فوری', status: 'تکمیل شده', dueDate: new Date(Date.now() - 3 * 86400000).toISOString(), createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const mockQuotes: Quote[] = [
    { id: 'Q-123', quoteNumber: '1001', version: 1, customerId: 'C1', customerName: 'شرکت آلفا', issueDate: '1403/05/01', expiryDate: '1403/05/15', status: 'تایید شده', items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, totalPrice: 10000000, discountType: 'percent', discount: 10, totalAfterDiscount: 9000000, tax: 9, totalWithTax: 9810000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000 },
    { id: 'Q-124', quoteNumber: '1002', version: 1, customerId: 'C2', customerName: 'تجارت بتا', issueDate: '1403/04/25', expiryDate: '1403/05/10', status: 'ارسال شده', items: [{ productId: 'P2', productName: 'سرویس پشتیبانی نقره‌ای', quantity: 2, unitPrice: 5000000, totalPrice: 10000000, discountType: 'amount', discount: 0, totalAfterDiscount: 10000000, tax: 9, totalWithTax: 10900000 }], subtotal: 10000000, discountAmount: 0, taxAmount: 900000, totalAmount: 10900000 },
];

const mockInvoices: Invoice[] = [
    { id: 'INV-001', isOfficial: true, quoteId: 'Q-123', customerId: 'C1', customerName: 'شرکت آلفا', issueDate: '1403/05/02', dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'ارسال شده', items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, totalPrice: 10000000, discountType: 'percent', discount: 10, totalAfterDiscount: 9000000, tax: 9, totalWithTax: 9810000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000, amountPaid: 0 },
];

const mockVendors: Vendor[] = [
    { id: 'V1', name: 'فروشگاه سخت‌افزار ایران', contactName: 'آقای محمدی', email: 'sales@iranhw.com', phone: '021-33445566', status: 'فعال' },
    { id: 'V2', name: 'خدمات ابری پارس', contactName: 'خانم رضایی', email: 'support@parscloud.ir', phone: '021-88997766', status: 'فعال' },
];

const mockLeads: Lead[] = [
    { id: 'L1', contactName: 'سارا محمدی', companyName: 'فروشگاه سارا', email: 'sara@shop.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 85, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: '1403/05/01', converted: false },
    { id: 'L2', contactName: 'رضا قاسمی', companyName: 'خدمات رضا', email: 'reza@service.com', phone: '09124445566', source: 'ارجاعی', status: 'واجد شرایط', score: 70, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: '1403/04/28', converted: false },
];

const initialCompanyInfo: CompanyInfo = {
    name: 'شرکت فناوری اطلاعات CRM Pro',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه تلاش، پلاک ۱',
    phone: '۰۲۱-۸۸۸۸۸۸۸۸',
    email: 'info@crmpro.ir',
    website: 'www.crmpro.ir',
    logoUrl: '',
    economicCode: '',
    nationalId: ''
};

interface PageState {
  name: string;
  params?: any;
}

const MainApp: React.FC<{ 
    user: User, 
    customers: Customer[], 
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>, 
    kbCategories: KnowledgeBaseCategory[],
    setKbCategories: React.Dispatch<React.SetStateAction<KnowledgeBaseCategory[]>>,
    kbArticles: KnowledgeBaseArticle[],
    setKbArticles: React.Dispatch<React.SetStateAction<KnowledgeBaseArticle[]>>,
    reminders: Reminder[],
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>,
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    quotes: Quote[],
    setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>,
    invoices: Invoice[],
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>,
    vendors: Vendor[],
    setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>,
    purchaseOrders: PurchaseOrder[],
    setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>,
    payments: Payment[],
    setPayments: React.Dispatch<React.SetStateAction<Payment[]>>,
    companyInfo: CompanyInfo,
    setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>,
    products: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    inventoryTransactions: InventoryTransaction[],
    setInventoryTransactions: React.Dispatch<React.SetStateAction<InventoryTransaction[]>>,
    onLogout: () => void 
}> = ({ user, customers, setCustomers, kbCategories, setKbCategories, kbArticles, setKbArticles, reminders, setReminders, tasks, setTasks, quotes, setQuotes, invoices, setInvoices, vendors, setVendors, purchaseOrders, setPurchaseOrders, payments, setPayments, companyInfo, setCompanyInfo, products, setProducts, inventoryTransactions, setInventoryTransactions, onLogout }) => {
  const [activePage, setActivePage] = useState<PageState>({ name: 'dashboard' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Reminder Modal State
  const [activeReminderModal, setActiveReminderModal] = useState<{ isOpen: boolean, prefill?: any, editingReminder?: Reminder }>({ isOpen: false });
  const [activeNotification, setActiveNotification] = useState<Reminder | null>(null);

  // Task Modal State
  const [activeTaskModal, setActiveTaskModal] = useState<{ isOpen: boolean, prefill?: any, editingTask?: Task }>({ isOpen: false });
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Global Ticket State needs to be accessible for CustomerInteractions
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  
  // Leads
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const handleSetActivePage = (name: string, params: any = {}) => {
    setActivePage({ name, params });
    setIsSidebarOpen(false);
  };

  // --- INVENTORY LOGIC ---
  const registerInventoryMovement = (
      productId: string, 
      quantity: number, 
      type: InventoryTransactionType, 
      referenceId: string = '', 
      description: string = ''
  ) => {
      const product = products.find(p => p.id === productId);
      
      // Check if product exists and is of type 'product' (not service)
      if (!product || product.type !== 'product') return;

      // Calculate new stock based on type
      let change = 0;
      if (['receipt', 'sales_return'].includes(type)) {
          change = quantity;
      } else if (['issue', 'purchase_return'].includes(type)) {
          change = -quantity;
      }

      const newStock = (product.stock || 0) + change;

      // Update Product
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));

      // Log Transaction
      const transaction: InventoryTransaction = {
          id: `INV-${Date.now()}`,
          productId,
          productName: product.name,
          type,
          quantity,
          date: new Date().toISOString(),
          referenceId,
          description,
          userId: user.id
      };
      setInventoryTransactions(prev => [transaction, ...prev]);
  };

  const handleManualInventoryTransaction = (transactionData: Omit<InventoryTransaction, 'id' | 'productName' | 'userId'>) => {
      registerInventoryMovement(
          transactionData.productId,
          transactionData.quantity,
          transactionData.type,
          transactionData.referenceId,
          transactionData.description
      );
  };


  // --- REMINDER LOGIC ---
  useEffect(() => {
      const checkReminders = () => {
          const now = new Date();
          const remindersToNotify = reminders.filter(reminder => {
               const dueDate = new Date(reminder.dueDateTime);
               return dueDate <= now && !reminder.isNotified && !reminder.isCompleted;
          });

          if (remindersToNotify.length > 0) {
              setActiveNotification(remindersToNotify[0]);
              setReminders(prev => prev.map(r => {
                  if (remindersToNotify.find(rtn => rtn.id === r.id)) {
                      return { ...r, isNotified: true };
                  }
                  return r;
              }));
          }
      };
      const interval = setInterval(checkReminders, 10000);
      return () => clearInterval(interval);
  }, [reminders, setReminders]);

  const handleAddReminder = (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'isCompleted' | 'isRead'>) => {
      const newReminder: Reminder = {
          id: `REM-${Date.now()}`,
          userId: user.id,
          createdAt: new Date().toISOString(),
          isCompleted: false,
          isRead: false,
          isNotified: false,
          ...reminderData
      };
      setReminders(prev => [...prev, newReminder]);
  };

  const handleUpdateReminder = (reminder: Reminder) => {
      setReminders(prev => prev.map(r => r.id === reminder.id ? reminder : r));
  };

  const handleDeleteReminder = (id: string) => {
      if(window.confirm('آیا از حذف این یادآور اطمینان دارید؟')) {
          setReminders(prev => prev.filter(r => r.id !== id));
      }
  };

  const handleToggleCompleteReminder = (id: string) => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };
  
  const handleMarkAsRead = (id: string) => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, isRead: true } : r));
  };

  const openReminderModal = (prefill?: any, editingReminder?: Reminder) => {
      setActiveReminderModal({ isOpen: true, prefill, editingReminder });
  };

  const closeReminderModal = () => {
      setActiveReminderModal({ isOpen: false, prefill: undefined, editingReminder: undefined });
  };

  const saveReminderFromModal = (data: any) => {
      if (activeReminderModal.editingReminder) {
          handleUpdateReminder({ ...activeReminderModal.editingReminder, ...data });
      } else {
          handleAddReminder(data);
      }
  };

  // --- TASK LOGIC ---
  const openTaskModal = (prefill?: any, editingTask?: Task) => {
      setActiveTaskModal({ isOpen: true, prefill, editingTask });
  };

  const closeTaskModal = () => {
      setActiveTaskModal({ isOpen: false, prefill: undefined, editingTask: undefined });
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
       const newTask: Task = {
            id: `TSK-${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...taskData
        };
        setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (task: Task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  };

  const saveTaskFromModal = (data: Omit<Task, 'id' | 'createdAt'>) => {
      if (activeTaskModal.editingTask) {
          handleUpdateTask({ ...activeTaskModal.editingTask, ...data });
      } else {
          handleAddTask(data);
      }
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleCreateTaskFromTicket = (ticketId: string, ticketSubject: string, priority: string, customerId: string) => {
      openTaskModal({
          title: `رسیدگی به تیکت: ${ticketSubject}`,
          customerId: customerId,
          relatedTicketId: ticketId,
          priority: priority === 'حیاتی' ? 'فوری' : priority === 'کم' ? 'پایین' : priority,
      });
  };
  
  const handleCreateTaskFromMessage = (messageText: string, authorName: string) => {
      openTaskModal({
          title: `وظیفه از چت: ${messageText.substring(0, 30)}...`,
          description: `ایجاد شده از پیام کاربر ${authorName}:\n\n"${messageText}"`,
          assignedToId: user.id,
      });
  };

  const handleCreateInvoiceFromQuote = (quoteId: string, customerId: string) => {
    handleSetActivePage('invoices', {
      action: 'create',
      prefill: {
        quoteId,
        customerId,
      }
    })
  }
  
  const handleViewQuote = (quote: Quote) => {
      handleSetActivePage('quotes', { action: 'edit', entityId: quote.id });
  }
  
  const handleViewInvoice = (invoice: Invoice) => {
      handleSetActivePage('invoices', { action: 'edit', entityId: invoice.id });
  }

  // --- FINANCE & PURCHASING LOGIC ---
  const handleSavePO = (po: Omit<PurchaseOrder, 'id'> | PurchaseOrder) => {
      const isEditing = 'id' in po;
        let savedPo: PurchaseOrder;

        if (isEditing) {
            savedPo = po as PurchaseOrder;
            setPurchaseOrders(prev => prev.map(p => p.id === po.id ? savedPo : p));
        } else {
            savedPo = {
                id: `PO-${Date.now()}`,
                ...(po as Omit<PurchaseOrder, 'id'>),
                amountPaid: 0
            };
            setPurchaseOrders(prev => [...prev, savedPo]);
        }
        
        // Integration: If PO is "Received", add items to stock (if they are physical products)
        if (savedPo.status === 'دریافت شده' && (!isEditing || purchaseOrders.find(p => p.id === savedPo.id)?.status !== 'دریافت شده')) {
             savedPo.items.forEach(item => {
                 const product = products.find(p => p.id === item.productId);
                 if (product && product.type === 'product') {
                    registerInventoryMovement(item.productId, item.quantity, 'receipt', savedPo.id, 'ورود خودکار از طریق سفارش خرید');
                 }
             });
        }

        handleSetActivePage('purchaseOrders');
  };
  
  const handleSaveInvoice = (invoice: Omit<Invoice, 'id'> | Invoice) => {
      const isEditing = 'id' in invoice;
      let savedInvoice: Invoice;

      if (isEditing) {
          savedInvoice = invoice as Invoice;
          setInvoices(prev => prev.map(i => i.id === invoice.id ? savedInvoice : i));
      } else {
          savedInvoice = {
              id: `INV-${Date.now()}`,
              ...(invoice as Omit<Invoice, 'id'>)
          };
          setInvoices(prev => [...prev, savedInvoice]);
      }
      
      // Integration: If Invoice is "Sent" (implies goods left), deduct stock (if physical product)
      if (savedInvoice.status === 'ارسال شده' && (!isEditing || invoices.find(i => i.id === savedInvoice.id)?.status !== 'ارسال شده')) {
           savedInvoice.items.forEach(item => {
               const product = products.find(p => p.id === item.productId);
               if (product && product.type === 'product') {
                   registerInventoryMovement(item.productId, item.quantity, 'issue', savedInvoice.id, 'خروج خودکار با فاکتور فروش');
               }
           });
      }
  };
  
  const handleRegisterPayment = (paymentData: Omit<Payment, 'id'>) => {
      const newPayment: Payment = {
          id: `PAY-${Date.now()}`,
          ...paymentData
      };
      setPayments(prev => [newPayment, ...prev]);
      
      // Update Invoice or PO status based on payment
      if (paymentData.referenceType === 'invoice' && paymentData.referenceId) {
          setInvoices(prev => prev.map(inv => {
              if (inv.id === paymentData.referenceId) {
                  const newAmountPaid = (inv.amountPaid || 0) + paymentData.amount;
                  const newStatus: InvoiceStatus = newAmountPaid >= inv.totalAmount ? 'پرداخت شده' : 'پرداخت جزئی';
                  return { ...inv, amountPaid: newAmountPaid, status: newStatus };
              }
              return inv;
          }));
      } else if (paymentData.referenceType === 'purchaseOrder' && paymentData.referenceId) {
          setPurchaseOrders(prev => prev.map(po => {
              if (po.id === paymentData.referenceId) {
                   const newAmountPaid = (po.amountPaid || 0) + paymentData.amount;
                   return { ...po, amountPaid: newAmountPaid };
              }
              return po;
          }))
      }
  };


  const pageTitles: { [key: string]: string } = {
    dashboard: 'داشبورد مدیریتی',
    calendar: 'تقویم کاری',
    customers: 'مدیریت مشتریان',
    customerInteractions: 'تعاملات با مشتری',
    tickets: 'مدیریت تیکت‌ها',
    tasks: 'مدیریت وظایف',
    reminders: 'یادآورها',
    opportunities: 'فرصت‌های فروش',
    leads: 'سرنخ‌ها',
    products: 'کالاها و خدمات',
    quotes: 'پیش‌فاکتورها',
    invoices: 'فاکتورها',
    inventory: 'انبار و موجودی',
    payments: 'امور مالی (دریافت و پرداخت)',
    vendors: 'تامین‌کنندگان',
    purchaseOrders: 'سفارشات خرید',
    chat: 'چت تیمی',
    reports: 'گزارش‌ها',
    settings: 'تنظیمات',
    knowledgeBase: 'پایگاه دانش',
  };

  const renderPage = () => {
    switch (activePage.name) {
      case 'customers':
        return <Customers 
            customers={customers}
            setCustomers={setCustomers}
            onViewInteractions={(customerId) => handleSetActivePage('customerInteractions', { customerId })}
        />;
      case 'customerInteractions': {
            if (!activePage.params.customerId) return <div>مشتری یافت نشد.</div>;
            return <CustomerInteractions 
                customerId={activePage.params.customerId}
                customers={customers}
                currentUser={user}
                tickets={tickets}
                quotes={quotes}
                invoices={invoices}
                payments={payments}
                onUpdateTicket={handleUpdateTicket}
                onBack={() => handleSetActivePage('customers')}
                onOpenReminderModal={openReminderModal}
                onViewQuote={handleViewQuote}
                onViewInvoice={handleViewInvoice}
            />;
        }
      case 'tickets':
        return <Tickets 
            customers={customers}
            onCreateTaskFromTicket={handleCreateTaskFromTicket} 
        />;
      case 'tasks':
        return <Tasks 
            tasks={tasks}
            setTasks={setTasks}
            onOpenTaskModal={(task) => openTaskModal(undefined, task)}
            onOpenReminderModal={openReminderModal}
        />;
      case 'reminders':
        return <Reminders 
            reminders={reminders} 
            onAddReminder={() => openReminderModal()}
            onEditReminder={(r) => openReminderModal(undefined, r)}
            onDeleteReminder={handleDeleteReminder}
            onToggleComplete={handleToggleCompleteReminder}
        />;
      case 'calendar':
          return <Calendar 
            tasks={tasks} 
            reminders={reminders} 
            invoices={invoices}
            onOpenTaskModal={(task) => openTaskModal(undefined, task)}
            onOpenReminderModal={(reminder) => openReminderModal(undefined, reminder)}
            onViewInvoice={handleViewInvoice}
          />;
      case 'opportunities':
        return <Opportunities />;
      case 'leads':
        return <Leads />;
      case 'products':
        return <Products />;
      case 'quotes':
        return <Quotes 
            customers={customers} 
            onCreateInvoiceFromQuote={handleCreateInvoiceFromQuote}
            quotes={quotes}
            setQuotes={setQuotes}
            initialParams={activePage.params}
            companyInfo={companyInfo}
        />;
      case 'invoices':
        return <Invoices 
            initialParams={activePage.params} 
            customers={customers} 
            invoices={invoices}
            setInvoices={setInvoices}
            quotes={quotes}
            companyInfo={companyInfo}
            // We need to pass the custom handler that triggers stock updates
        />;
      case 'inventory':
          return <Inventory 
             products={products}
             transactions={inventoryTransactions}
             onAddTransaction={handleManualInventoryTransaction}
          />;
      case 'vendors':
          return <VendorsList vendors={vendors} setVendors={setVendors} />;
      case 'purchaseOrders': {
           if (activePage.params?.action === 'create' || activePage.params?.action === 'edit') {
               const editingPO = activePage.params.entityId ? purchaseOrders.find(p => p.id === activePage.params.entityId) : undefined;
               return <PurchaseOrderEditor 
                   poData={editingPO}
                   vendors={vendors}
                   products={products} 
                   onSave={handleSavePO}
                   onCancel={() => handleSetActivePage('purchaseOrders')}
                   companyInfo={companyInfo}
               />
           }
           return <PurchaseOrdersList 
               purchaseOrders={purchaseOrders}
               onCreateNew={() => handleSetActivePage('purchaseOrders', { action: 'create' })}
               onEdit={(po) => handleSetActivePage('purchaseOrders', { action: 'edit', entityId: po.id })}
               companyInfo={companyInfo}
           />;
      }
      case 'payments':
          return <PaymentsList payments={payments} onRegisterPayment={() => setIsPaymentModalOpen(true)} />;
      case 'chat':
        return <Chat 
            currentUser={user}
            onCreateTask={handleCreateTaskFromMessage}
            onOpenReminderModal={openReminderModal}
        />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings 
            customers={customers} 
            setCustomers={setCustomers} 
            companyInfo={companyInfo} 
            setCompanyInfo={setCompanyInfo} 
        />;
      case 'knowledgeBase':
        return <KnowledgeBase 
            articles={kbArticles} 
            setArticles={setKbArticles}
            categories={kbCategories}
            setCategories={setKbCategories}
            currentUser={user}
        />;
      case 'dashboard':
      default:
        return <Dashboard customers={customers} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans overflow-hidden">
      <Sidebar 
        activePage={activePage.name} 
        setActivePage={handleSetActivePage} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
           <div className="flex items-center flex-1">
             <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1 ml-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              aria-label="Open sidebar"
            >
              <HamburgerIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold flex-shrink-0">{pageTitles[activePage.name] || 'CRM'}</h1>
            <GlobalSearch 
                customers={customers}
                tickets={tickets}
                leads={leads}
                tasks={tasks}
                products={products}
                quotes={quotes}
                invoices={invoices}
                purchaseOrders={purchaseOrders}
                onNavigate={handleSetActivePage}
            />
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <HeaderNotifications reminders={reminders} onMarkAsRead={handleMarkAsRead} />
            <UserProfile user={user} onLogout={onLogout} />
            <ThemeToggle />
          </div>
        </header>
        <div className={`flex-1 overflow-x-hidden overflow-y-auto ${!['chat', 'opportunities', 'customerInteractions', 'knowledgeBase'].includes(activePage.name) ? 'p-6' : ''}`}>
          {renderPage()}
        </div>

        <ReminderModal 
            isOpen={activeReminderModal.isOpen} 
            onClose={closeReminderModal} 
            onSave={saveReminderFromModal}
            initialData={activeReminderModal.editingReminder || activeReminderModal.prefill}
            isEditing={!!activeReminderModal.editingReminder}
        />

        <TaskModal
            isOpen={activeTaskModal.isOpen}
            onClose={closeTaskModal}
            onSave={saveTaskFromModal}
            initialData={activeTaskModal.editingTask || activeTaskModal.prefill}
            isEditing={!!activeTaskModal.editingTask}
            users={mockUsers} 
            customers={customers}
        />
        
        <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSave={handleRegisterPayment}
            customers={customers}
            vendors={vendors}
            invoices={invoices}
            purchaseOrders={purchaseOrders}
            currentUser={user}
        />

        <NotificationToast 
            reminder={activeNotification} 
            onClose={() => setActiveNotification(null)} 
            onAction={(reminder) => {
                setActiveNotification(null);
                handleSetActivePage('reminders');
            }}
        />
      </main>
    </div>
  );
}


const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [auth, setAuth] = useState<{ type: 'user' | 'customer' | null, entity: User | Customer | null }>({ type: null, entity: null });

  // State Definitions
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [kbCategories, setKbCategories] = useState<KnowledgeBaseCategory[]>(mockKbCategories);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>(mockKbArticles);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [tasks, setTasks] = useState<Task[]>(mockTasksData); 
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes); 
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  
  // Products State (Shared for PO and Quotes, now with Stock)
  const [products, setProducts] = useState<Product[]>([
    { id: 'P1', name: 'سرویس پشتیبانی طلایی', price: 10000000, code: 'SRV-001', stock: 0, type: 'service' }, 
    { id: 'P2', name: 'سرویس پشتیبانی نقره‌ای', price: 5000000, code: 'SRV-002', stock: 0, type: 'service' }, 
    { id: 'P3', name: 'لایسنس تک کاربره', price: 2000000, code: 'LIC-001', stock: 5, type: 'product' }
  ]);
  
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
        if (auth.type === 'user') {
            // Initial Data Fetching Logic
            setReminders([
                { id: 'R1', userId: auth.entity!.id, title: 'تماس با شرکت آلفا', description: 'پیگیری قرارداد جدید', dueDateTime: new Date(Date.now() + 3600000).toISOString(), isCompleted: false, isRead: false, isNotified: false, sourceType: 'manual', createdAt: new Date().toISOString() },
                 { id: 'R2', userId: auth.entity!.id, title: 'ارسال فاکتور بتا', description: '', dueDateTime: new Date(Date.now() - 86400000).toISOString(), isCompleted: false, isRead: false, isNotified: true, sourceType: 'manual', createdAt: new Date().toISOString() }
            ]);
        }
    }, [auth]);

  const handleLogin = (type: 'user' | 'customer', username: string, pass: string) => {
    if (pass === '1234') {
        if (type === 'user') {
            const user = mockUsers.find(u => u.username === username);
            if (user) {
                setAuth({ type: 'user', entity: user });
                return true;
            }
        } else {
            const customer = customers.find(c => c.username === username);
            if (customer) {
                setAuth({ type: 'customer', entity: customer });
                return true;
            }
        }
    }
    return false;
  };
  
  const handleLogout = () => {
      setAuth({ type: null, entity: null });
  };
  
  const handleAddTicket = (ticketData: Omit<Ticket, 'id'|'customer'|'assignee'|'assigneeId'>) => {
      const customer = auth.entity as Customer;
      const newTicket: Ticket = {
          ...ticketData,
          id: `TKT-${Date.now()}`,
          customer,
      };
      setTickets(prev => [newTicket, ...prev]);
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };
  
  const handleSurveySubmit = (ticketId: string, rating: number, feedback: string, tags: string[]) => {
      setTickets(prev => prev.map(t => 
          t.id === ticketId ? { ...t, rating, feedbackTags: tags, surveySubmitted: true } : t
      ));
  };

  if (!auth.type || !auth.entity) {
      return <LoginPage onLogin={handleLogin} />;
  }

  if (auth.type === 'customer') {
      const customerTickets = tickets.filter(t => t.customerId === auth.entity!.id);
      const publicKbArticles = kbArticles.filter(a => a.visibility === 'public');
      return <CustomerPortal 
          customer={auth.entity as Customer} 
          onLogout={handleLogout}
          tickets={customerTickets}
          onAddTicket={handleAddTicket}
          onUpdateTicket={handleUpdateTicket}
          onSurveySubmit={handleSurveySubmit}
          kbArticles={publicKbArticles}
          kbCategories={kbCategories}
      />;
  }
  
  return <MainApp 
            user={auth.entity as User} 
            customers={customers} 
            setCustomers={setCustomers} 
            kbCategories={kbCategories}
            setKbCategories={setKbCategories}
            kbArticles={kbArticles}
            setKbArticles={setKbArticles}
            reminders={reminders}
            setReminders={setReminders}
            tasks={tasks}
            setTasks={setTasks}
            quotes={quotes}
            setQuotes={setQuotes}
            invoices={invoices}
            setInvoices={setInvoices}
            vendors={vendors}
            setVendors={setVendors}
            purchaseOrders={purchaseOrders}
            setPurchaseOrders={setPurchaseOrders}
            payments={payments}
            setPayments={setPayments}
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
            products={products}
            setProducts={setProducts}
            inventoryTransactions={inventoryTransactions}
            setInventoryTransactions={setInventoryTransactions}
            onLogout={handleLogout} 
        />;
};

export default App;