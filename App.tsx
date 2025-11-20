
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    این کامپوننت App.tsx نقطه ورود اصلی برنامه است و مسئولیت‌های زیر را بر عهده دارد:
    1. احراز هویت (ورود کاربر/مشتری)
    2. Fetch کردن داده‌های اولیه برنامه (مشتریان، تیکت‌ها، مقالات پایگاه دانش و دسته‌بندی‌ها)
    3. مدیریت State کلی برنامه و پاس دادن آن به کامپوننت‌های فرزند.

    API های مورد نیاز:

    1. احراز هویت کاربر (User Login)
    - Route: /api/auth/login/user
    - Method: POST
    - Expected Body JSON Schema: { "username": "string", "password": "string" }
    - Response JSON Schema: { "token": "string", "user": { "id": "string", "name": "string", "username": "string", "roleId": "string", "avatar": "string" } }
    - توضیح منطق بکند مورد نیاز: بررسی نام کاربری و رمز عبور در دیتابیس کاربران. در صورت موفقیت، یک توکن JWT صادر کرده و اطلاعات کاربر را بازگرداند.
    - Dependencies: نیاز به Auth Token ندارد.
    - نکات امنیتی: رمز عبور باید هش شده مقایسه شود. از HTTPS استفاده شود.

    2. احراز هویت مشتری (Customer Login)
    - Route: /api/auth/login/customer
    - Method: POST
    - Expected Body JSON Schema: { "username": "string", "password": "string" }
    - Response JSON Schema: { "token": "string", "customer": { "id": "string", "companyName": "string", ... } }
    - توضیح منطق بکند مورد نیاز: مشابه ورود کاربر، اما برای جدول مشتریان.
    - Dependencies: نیاز به Auth Token ندارد.

    3. دریافت داده‌های اولیه (Initial Data Fetch)
    - توضیح: پس از ورود موفق کاربر، برنامه باید داده‌های اصلی را از سرور دریافت کند. می‌توان این‌ها را در یک endpoint تکی یا چند endpoint جداگانه قرار داد.
    - Route (Example for separate endpoints): 
        - /api/customers
        - /api/tickets
        - /api/kb/articles
        - /api/kb/categories
    - Method: GET
    - Expected Query Params:
        - برای تیکت‌ها و مشتریان ممکن است نیاز به pagination باشد (e.g., ?page=1&limit=20)
    - Response JSON Schema:
        - /api/customers -> { "data": [Customer], "totalPages": number }
        - /api/tickets -> { "data": [Ticket], "totalPages": number }
        - ...
    - توضیح منطق بکند مورد نیاز: کنترلرهای جداگانه برای هر موجودیت (Customer, Ticket, etc.) که داده‌ها را از دیتابیس خوانده و برمی‌گردانند. باید شامل اطلاعات مرتبط (populated fields) مانند اطلاعات کاربر تخصیص داده شده به تیکت باشد.
    - Dependencies: نیاز به Auth Token در هدر Authorization دارد.

    4. عملیات روی تیکت‌ها (از پورتال مشتری)
    - Route (Add Ticket): /api/portal/tickets
    - Method: POST
    - Expected Body JSON Schema: Omit<Ticket, 'id'|'customer'|'assignee'|'assigneeId'>
    - Response JSON Schema: Ticket (the created ticket)
    - ---
    - Route (Update Ticket - e.g., add reply): /api/portal/tickets/:ticketId/reply
    - Method: POST
    - Expected Body JSON Schema: { "text": "string" }
    - Response JSON Schema: Ticket (the updated ticket)
    - ---
    - Route (Submit Survey): /api/portal/tickets/:ticketId/survey
    - Method: POST
    - Expected Body JSON Schema: { "rating": number, "feedback": "string", "tags": ["string"] }
    - Response JSON Schema: { "success": true }

    - نحوه هندل‌کردن خطا: پاسخ‌های 401 برای خطای احراز هویت، 400 برای ورودی نامعتبر و 500 برای خطاهای سرور.
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
import ReminderModal from './components/ReminderModal';
import NotificationToast from './components/NotificationToast';
import HeaderNotifications from './components/HeaderNotifications';
import { User, Customer, Ticket, Interaction, Lead, Opportunity, Product, Quote, Invoice, Role, KnowledgeBaseCategory, KnowledgeBaseArticle, Contact, Reminder } from './types';
import { HamburgerIcon } from './components/icons/HamburgerIcon';
import CustomerInteractions from './components/pages/CustomerInteractions';
import UserProfile from './components/UserProfile';
import ThemeToggle from './components/ThemeToggle';
import LoginPage from './components/LoginPage';
import CustomerPortal from './components/portals/CustomerPortal';
import KnowledgeBase from './components/pages/KnowledgeBase';

// --- MOCK DATA AGGREGATION ---
/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API برای نقش‌ها: GET /api/roles -> { "data": [Role] }
    {
        "id": "string",
        "name": "string",
        "permissions": "string" // Comma-separated
    }
*/
const mockRoles: Role[] = [
    { id: 'R1', name: 'مدیر کل', permissions: 'view_customers,create_customers,edit_customers,delete_customers,view_tickets,create_tickets,edit_tickets,delete_tickets,view_sales,create_sales,edit_sales,delete_sales,view_reports,manage_users,manage_roles' },
    { id: 'R2', name: 'کارشناس پشتیبانی', permissions: 'view_customers,view_tickets,create_tickets,edit_tickets' },
    { id: 'R3', name: 'کارشناس فروش', permissions: 'view_customers,create_customers,view_sales,create_sales,edit_sales' },
];

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API برای کاربران: GET /api/users -> { "data": [User] }
*/
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2' },
  { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R3', avatar: 'https://i.pravatar.cc/40?u=U3' },
];

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API برای مشتریان: GET /api/customers -> { "data": [Customer] }
*/
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
  { id: 'C1', name: 'شرکت آلفا', contacts: mockContacts.C1, username: 'alpha', email: 'info@alpha.com', phone: '021-12345678', status: 'فعال', portalToken: 'alpha-secret-token-xyz', supportEndDate: '1404/05/01' },
  { id: 'C2', name: 'تجارت بتا', contacts: mockContacts.C2, username: 'beta', email: 'contact@beta.com', phone: '021-87654321', status: 'غیرفعال', portalToken: 'beta-secret-token-abc', supportEndDate: '1403/10/01' },
  { id: 'C3', name: 'صنایع گاما', contacts: mockContacts.C3, username: 'gamma', email: 'office@gamma.com', phone: '021-11223344', status: 'فعال' },
  { id: 'C4', name: 'راهکارهای دلتا', contacts: mockContacts.C4, username: 'delta', email: 'sales@delta.com', phone: '021-55667788', status: 'معلق' },
];

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API برای تیکت‌ها: GET /api/tickets -> { "data": [Ticket] }
*/
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

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API: GET /api/kb/categories -> { "data": [KnowledgeBaseCategory] }
*/
const mockKbCategories: KnowledgeBaseCategory[] = [
    { id: 'KBC1', name: 'راهنمای شروع' },
    { id: 'KBC2', name: 'عیب‌یابی فنی' },
    { id: 'KBC3', name: 'سوالات متداول فروش' },
    { id: 'KBC4', name: 'سیاست‌های داخلی' },
];

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API: GET /api/kb/articles -> { "data": [KnowledgeBaseArticle] }
*/
const mockKbArticles: KnowledgeBaseArticle[] = [
    { id: 'KBA1', title: 'چگونه یک تیکت جدید ثبت کنیم؟', content: 'برای ثبت تیکت جدید، از منوی پورتال مشتریان گزینه تیکت‌ها را انتخاب کرده و روی دکمه <b>"تیکت جدید"</b> کلیک کنید... <br/> <img src="https://via.placeholder.com/400x200.png?text=Ticket+Example" alt="Example"/>', categoryId: 'KBC1', tags: ['تیکت', 'مشتری'], authorId: 'U1', createdAt: '1403/04/15', visibility: 'public' },
    { id: 'KBA2', title: 'خطای 500 هنگام ورود به پنل', content: 'این خطا معمولا به دلیل مشکلات سمت سرور است. لطفاً ابتدا کش مرورگر خود را پاک کرده و مجددا تلاش کنید. در صورت عدم رفع مشکل، با <a href="mailto:support@example.com">پشتیبانی</a> تماس بگیرید.', categoryId: 'KBC2', tags: ['خطا', 'ورود', 'فنی'], authorId: 'U2', createdAt: '1403/04/20', visibility: 'public' },
    { id: 'KBA3', title: 'راهنمای قیمت‌گذاری سرویس‌ها', content: 'این یک سند داخلی است و نباید در دسترس مشتری قرار گیرد. پلن‌های قیمت‌گذاری به شرح زیر است...', categoryId: 'KBC3', tags: ['قیمت', 'فروش'], authorId: 'U3', createdAt: '1403/05/01', visibility: 'internal' },
    { id: 'KBA4', title: 'سیاست مرخصی کارکنان', content: 'هر کارمند در سال مجاز به استفاده از ۲۴ روز مرخصی با حقوق است...', categoryId: 'KBC4', tags: ['منابع انسانی', 'داخلی'], authorId: 'U1', createdAt: '1403/01/10', visibility: 'internal' },
];


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
    onLogout: () => void 
}> = ({ user, customers, setCustomers, kbCategories, setKbCategories, kbArticles, setKbArticles, reminders, setReminders, onLogout }) => {
  const [activePage, setActivePage] = useState<PageState>({ name: 'dashboard' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeReminderModal, setActiveReminderModal] = useState<{ isOpen: boolean, prefill?: any, editingReminder?: Reminder }>({ isOpen: false });
  const [activeNotification, setActiveNotification] = useState<Reminder | null>(null);
  
  // Global Ticket State needs to be accessible for CustomerInteractions
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  
  const handleSetActivePage = (name: string, params: any = {}) => {
    setActivePage({ name, params });
    setIsSidebarOpen(false);
  };

  // --- REMINDER LOGIC ---
  useEffect(() => {
      const checkReminders = () => {
          const now = new Date();
          // Check for reminders that are due, not completed, and NOT notified yet (Toast not shown)
          const remindersToNotify = reminders.filter(reminder => {
               const dueDate = new Date(reminder.dueDateTime);
               return dueDate <= now && !reminder.isNotified && !reminder.isCompleted;
          });

          if (remindersToNotify.length > 0) {
              // Show notification for the first one found
              setActiveNotification(remindersToNotify[0]);
              
              // Mark them as notified so they don't trigger toast again, but KEEP isRead false so red dot stays
              setReminders(prev => prev.map(r => {
                  if (remindersToNotify.find(rtn => rtn.id === r.id)) {
                      return { ...r, isNotified: true };
                  }
                  return r;
              }));
          }
      };

      const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
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
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleCreateTaskFromTicket = (ticketId: string, ticketSubject: string, priority: string, customerId: string) => {
      handleSetActivePage('tasks', { 
          action: 'create', 
          prefill: {
              title: `رسیدگی به تیکت: ${ticketSubject}`,
              customerId: customerId,
              relatedTicketId: ticketId,
              priority: priority === 'حیاتی' ? 'فوری' : priority === 'کم' ? 'پایین' : priority,
          }
      });
  };
  
  const handleCreateTaskFromMessage = (messageText: string, authorName: string) => {
      handleSetActivePage('tasks', { 
          action: 'create', 
          prefill: {
              title: `وظیفه از چت: ${messageText.substring(0, 30)}...`,
              description: `ایجاد شده از پیام کاربر ${authorName}:\n\n"${messageText}"`,
              assignedToId: user.id,
          }
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

  const pageTitles: { [key: string]: string } = {
    dashboard: 'داشبورد مدیریتی',
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
                onUpdateTicket={handleUpdateTicket}
                onBack={() => handleSetActivePage('customers')}
                onOpenReminderModal={openReminderModal}
            />;
        }
      case 'tickets':
        return <Tickets 
            customers={customers}
            onCreateTaskFromTicket={handleCreateTaskFromTicket} 
        />;
      case 'tasks':
        return <Tasks initialParams={activePage.params} customers={customers} onOpenReminderModal={openReminderModal} />;
      case 'reminders':
        return <Reminders 
            reminders={reminders} 
            onAddReminder={() => openReminderModal()}
            onEditReminder={(r) => openReminderModal(undefined, r)}
            onDeleteReminder={handleDeleteReminder}
            onToggleComplete={handleToggleCompleteReminder}
        />;
      case 'opportunities':
        return <Opportunities />;
      case 'leads':
        return <Leads />;
      case 'products':
        return <Products />;
      case 'quotes':
        return <Quotes customers={customers} onCreateInvoiceFromQuote={handleCreateInvoiceFromQuote}/>;
      case 'invoices':
        return <Invoices initialParams={activePage.params} customers={customers} />;
      case 'chat':
        return <Chat 
            currentUser={user}
            onCreateTask={handleCreateTaskFromMessage}
            onOpenReminderModal={openReminderModal}
        />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings customers={customers} setCustomers={setCustomers} />;
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
           <div className="flex items-center">
             <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1 ml-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              aria-label="Open sidebar"
            >
              <HamburgerIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold">{pageTitles[activePage.name] || 'CRM'}</h1>
          </div>
          <div className="flex items-center gap-4">
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

        <NotificationToast 
            reminder={activeNotification} 
            onClose={() => setActiveNotification(null)} 
            onAction={(reminder) => {
                setActiveNotification(null);
                // If on reminders page, it will be there. If not, navigate?
                // Ideally, open a detail view or highlight it. For now, simple close.
                handleSetActivePage('reminders');
            }}
        />
      </main>
    </div>
  );
}


const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  /*
    === پیشنهاد برای Data Fetching ===
    به جای مدیریت state های متعدد در کامپوننت App، پیشنهاد می‌شود از React Context یا کتابخانه‌هایی مانند SWR/React-Query استفاده شود.
    یک AuthContext برای مدیریت اطلاعات کاربر لاگین شده و توکن.
    یک DataContext برای fetch کردن و نگهداری داده‌های اصلی (مشتریان، تیکت‌ها و ...).
    این کار باعث تمیزتر شدن کد App.tsx و جداسازی بهتر مسئولیت‌ها می‌شود.

    مثال برای AuthContext:
    const AuthContext = React.createContext({ auth: null, login: () => {}, logout: () => {} });
    export const AuthProvider = ({ children }) => { ... };
    export const useAuth = () => React.useContext(AuthContext);
  */
  const [auth, setAuth] = useState<{ type: 'user' | 'customer' | null, entity: User | Customer | null }>({ type: null, entity: null });

  // این state ها باید پس از اتصال به بک‌اند با داده‌های واقعی از API پر شوند
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [kbCategories, setKbCategories] = useState<KnowledgeBaseCategory[]>(mockKbCategories);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>(mockKbArticles);
  const [reminders, setReminders] = useState<Reminder[]>([]);


  useEffect(() => {
    // در یک اپلیکیشن واقعی، اینجا باید چک شود که آیا توکن معتبری در localStorage وجود دارد یا نه
    // اگر وجود داشت، اطلاعات کاربر از API گرفته شده و state مربوط به auth ست می‌شود.
    // fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}) ...
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // بعد از لاگین موفق، داده‌های اولیه برنامه باید fetch شوند.
  useEffect(() => {
        if (auth.type === 'user') {
            /*
            === API CALL REQUIRED HERE ===
            - Route: /api/customers, /api/tickets, /api/kb/articles, /api/kb/categories
            - Method: GET
            - Input: Auth token in header.
            - Output: Lists of customers, tickets, articles, and categories.
            - Sample Fetch Code:
              const fetchInitialData = async () => {
                  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
                  const [customersRes, ticketsRes, articlesRes, categoriesRes] = await Promise.all([
                      fetch('/api/customers', { headers }),
                      fetch('/api/tickets', { headers }),
                      fetch('/api/kb/articles', { headers }),
                      fetch('/api/kb/categories', { headers }),
                  ]);
                  const customersData = await customersRes.json();
                  const ticketsData = await ticketsRes.json();
                  const articlesData = await articlesRes.json();
                  const categoriesData = await categoriesRes.json();
                  setCustomers(customersData.data);
                  setTickets(ticketsData.data);
                  setKbArticles(articlesData.data);
                  setKbCategories(categoriesData.data);
              };
              fetchInitialData();
            */
            // Load initial reminders mock
            setReminders([
                { id: 'R1', userId: auth.entity!.id, title: 'تماس با شرکت آلفا', description: 'پیگیری قرارداد جدید', dueDateTime: new Date(Date.now() + 3600000).toISOString(), isCompleted: false, isRead: false, isNotified: false, sourceType: 'manual', createdAt: new Date().toISOString() },
                 { id: 'R2', userId: auth.entity!.id, title: 'ارسال فاکتور بتا', description: '', dueDateTime: new Date(Date.now() - 86400000).toISOString(), isCompleted: false, isRead: false, isNotified: true, sourceType: 'manual', createdAt: new Date().toISOString() }
            ]);
        } else if (auth.type === 'customer') {
             /*
            === API CALL REQUIRED HERE ===
            - Route: /api/portal/tickets, /api/portal/kb/articles, ...
            - Method: GET
            - Input: Auth token for the customer in header.
            - Output: Data relevant to the logged-in customer.
            - Sample Fetch Code:
              const fetchPortalData = async () => {
                  const headers = { 'Authorization': `Bearer ${localStorage.getItem('customer_token')}` };
                  const [ticketsRes, articlesRes, categoriesRes] = await Promise.all([
                      fetch('/api/portal/tickets', { headers }),
                      fetch('/api/portal/kb/articles', { headers }),
                      fetch('/api/portal/kb/categories', { headers }),
                  ]);
                  // ... set state
              };
              fetchPortalData();
            */
        }
    }, [auth]);

  const handleLogin = (type: 'user' | 'customer', username: string, pass: string) => {
    /*
      === API CALL REQUIRED HERE ===
      این تابع باید یک درخواست به API برای احراز هویت ارسال کند.
      - Route: /api/auth/login/user or /api/auth/login/customer
      - Method: POST
      - Input: { "username": "string", "password": "string" }
      - Output: { "token": "string", "user": User } or { "token": "string", "customer": Customer }
      - Sample Fetch Code (کاملاً واقعی، فقط کامنت شده):
        const loginUrl = type === 'user' ? '/api/auth/login/user' : '/api/auth/login/customer';
        fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: pass })
        })
        .then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }
            return res.json();
        })
        .then(data => {
            if (type === 'user') {
                localStorage.setItem('token', data.token);
                setAuth({ type: 'user', entity: data.user });
            } else {
                 localStorage.setItem('customer_token', data.token);
                 setAuth({ type: 'customer', entity: data.customer });
            }
        })
        .catch(err => {
            console.error(err);
            // Handle error UI, e.g., setError('نام کاربری یا رمز عبور نامعتبر است.')
        });

      - نکته برای بک‌اند: پس از موفقیت، توکن JWT باید در پاسخ بازگردانده شود.
    */
    // Mock login logic
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
      // باید توکن از localStorage پاک شود
      // localStorage.removeItem('token');
      // localStorage.removeItem('customer_token');
      setAuth({ type: null, entity: null });
  };
  
  const handleAddTicket = (ticketData: Omit<Ticket, 'id'|'customer'|'assignee'|'assigneeId'>) => {
      /*
      === API CALL REQUIRED HERE ===
      - Route: /api/portal/tickets
      - Method: POST
      - Input: ticketData
      - Output: The newly created ticket object.
      - Sample Fetch Code:
        fetch('/api/portal/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${localStorage.getItem('customer_token')}` },
            body: JSON.stringify(ticketData)
        })
        .then(res => res.json())
        .then(newTicketFromServer => {
            setTickets(prev => [newTicketFromServer, ...prev]);
        });
      */
      const customer = auth.entity as Customer;
      const newTicket: Ticket = {
          ...ticketData,
          id: `TKT-${Date.now()}`,
          customer,
      };
      setTickets(prev => [newTicket, ...prev]);
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
       /*
      === API CALL REQUIRED HERE ===
      این تابع معمولا برای افزودن پاسخ توسط مشتری فراخوانی می‌شود.
      - Route: /api/portal/tickets/:ticketId
      - Method: PUT (or PATCH)
      - Input: The updated ticket object or just the new reply.
      - Output: The fully updated ticket object from the server.
      - Sample Fetch Code:
        fetch(`/api/portal/tickets/${updatedTicket.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${localStorage.getItem('customer_token')}` },
            body: JSON.stringify(updatedTicket)
        })
        .then(res => res.json())
        .then(updatedTicketFromServer => {
            setTickets(prev => prev.map(t => t.id === updatedTicketFromServer.id ? updatedTicketFromServer : t));
        });
      */
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };
  
  const handleSurveySubmit = (ticketId: string, rating: number, feedback: string, tags: string[]) => {
      /*
      === API CALL REQUIRED HERE ===
      - Route: /api/portal/tickets/:ticketId/survey
      - Method: POST
      - Input: { rating, feedback, tags }
      - Output: { success: true }
      - Sample Fetch Code:
        fetch(`/api/portal/tickets/${ticketId}/survey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${localStorage.getItem('customer_token')}` },
            body: JSON.stringify({ rating, feedback, tags })
        })
        .then(res => res.json())
        .then(() => {
             setTickets(prev => prev.map(t => 
                t.id === ticketId ? { ...t, rating, feedbackTags: tags, surveySubmitted: true } : t
            ));
        });
      */
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
            onLogout={handleLogout} 
        />;
};


export default App;
