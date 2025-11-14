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
import { User, Customer, Ticket, Interaction, Lead, Opportunity, Product, Quote, Invoice, Role, KnowledgeBaseCategory, KnowledgeBaseArticle } from './types';
import { HamburgerIcon } from './components/icons/HamburgerIcon';
import CustomerInteractions from './components/pages/CustomerInteractions';
import UserProfile from './components/UserProfile';
import ThemeToggle from './components/ThemeToggle';
import LoginPage from './components/LoginPage';
import CustomerPortal from './components/portals/CustomerPortal';
import KnowledgeBase from './components/pages/KnowledgeBase';

// --- MOCK DATA AGGREGATION ---
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

const mockCustomers: Customer[] = [
  { id: 'C1', companyName: 'شرکت آلفا', contactPerson: 'آقای الف', username: 'alpha', email: 'alpha@co.com', phone: '021-12345678', status: 'فعال', accountManagerId: 'U1', accountManager: mockUsers[0], portalToken: 'alpha-secret-token-xyz', supportEndDate: '1404/05/01' },
  { id: 'C2', companyName: 'تجارت بتا', contactPerson: 'خانم ب', username: 'beta', email: 'beta@co.com', phone: '021-87654321', status: 'غیرفعال', accountManagerId: 'U2', accountManager: mockUsers[1], portalToken: 'beta-secret-token-abc', supportEndDate: '1403/10/01' },
  { id: 'C3', companyName: 'صنایع گاما', contactPerson: 'آقای ج', username: 'gamma', email: 'gamma@co.com', phone: '021-11223344', status: 'فعال', accountManagerId: 'U1', accountManager: mockUsers[0] },
  { id: 'C4', companyName: 'راهکارهای دلتا', contactPerson: 'خانم د', username: 'delta', email: 'delta@co.com', phone: '021-55667788', status: 'معلق', accountManagerId: 'U2', accountManager: mockUsers[1] },
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
    onLogout: () => void 
}> = ({ user, customers, setCustomers, kbCategories, setKbCategories, kbArticles, setKbArticles, onLogout }) => {
  const [activePage, setActivePage] = useState<PageState>({ name: 'dashboard' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleSetActivePage = (name: string, params: any = {}) => {
    setActivePage({ name, params });
    setIsSidebarOpen(false);
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
                onBack={() => handleSetActivePage('customers')}
            />;
        }
      case 'tickets':
        return <Tickets 
            customers={customers}
            onCreateTaskFromTicket={handleCreateTaskFromTicket} 
        />;
      case 'tasks':
        return <Tasks initialParams={activePage.params} customers={customers} />;
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

      <main className="flex-1 flex flex-col overflow-hidden">
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
          <div className="flex items-center space-i-4">
            <UserProfile user={user} onLogout={onLogout} />
            <ThemeToggle />
          </div>
        </header>
        <div className={`flex-1 overflow-x-hidden overflow-y-auto ${!['chat', 'opportunities', 'customerInteractions', 'knowledgeBase'].includes(activePage.name) ? 'p-6' : ''}`}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}


const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [auth, setAuth] = useState<{ type: 'user' | 'customer' | null, entity: User | Customer | null }>({ type: null, entity: null });
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [kbCategories, setKbCategories] = useState<KnowledgeBaseCategory[]>(mockKbCategories);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>(mockKbArticles);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (type: 'user' | 'customer', username: string, pass: string) => {
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
            onLogout={handleLogout} 
        />;
};


export default App;