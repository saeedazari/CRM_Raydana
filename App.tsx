import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
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
import { Ticket, User, Role, ChatChannel, Lead, Opportunity, Product, Quote, Invoice, Customer } from './types';
import { HamburgerIcon } from './components/icons/HamburgerIcon';
import LoginAs from './components/LoginAs';
import CustomerPortal from './components/portals/CustomerPortal';

// Centralized Mock Data
const initialUsers: User[] = [
    { id: 'USER-1', name: 'علی رضایی', email: 'ali.rezaei@example.com', roleId: 'ROLE-2', avatar: 'https://i.pravatar.cc/40?u=USER-1' },
    { id: 'USER-2', name: 'زهرا محمدی', email: 'zahra.mohammadi@example.com', roleId: 'ROLE-3', avatar: 'https://i.pravatar.cc/40?u=USER-2' },
    { id: 'USER-3', name: 'مریم احمدی', email: 'maryam.ahmadi@example.com', roleId: 'ROLE-3', avatar: 'https://i.pravatar.cc/40?u=USER-3' },
    { id: 'USER-4', name: 'مدیر سیستم', email: 'admin@example.com', roleId: 'ROLE-1', avatar: 'https://i.pravatar.cc/40?u=ADMIN' },
];

const initialRoles: Role[] = [
    { id: 'ROLE-1', name: 'مدیر کل', permissions: ['manageUsers', 'manageRoles', 'manageChannels', 'viewReports', 'manageTickets', 'manageSales'] },
    { id: 'ROLE-2', name: 'مدیر فروش', permissions: ['manageSales', 'viewReports'] },
    { id: 'ROLE-3', name: 'کارشناس پشتیبانی', permissions: ['manageTickets'] },
];

const initialChannels: ChatChannel[] = [
    { id: 'C-1', name: 'عمومی', description: 'بحث‌های کلی و عمومی تیم', members: ['USER-1', 'USER-2', 'USER-3', 'USER-4'] },
    { id: 'C-2', name: 'اعلام باگ‌های سیستم', description: 'برای گزارش و پیگیری باگ‌ها', members: ['USER-2', 'USER-3'] },
    { id: 'C-3', name: 'درخواست‌های جدید', description: 'ایده‌ها و درخواست‌های فیچر جدید', members: ['USER-1', 'USER-2', 'USER-3'] },
];

const initialCustomers: Customer[] = [
    { id: 'CUST-001', companyName: 'شرکت ABC', contactPerson: 'رضا احمدی', email: 'reza@abc.com', phone: '09123456789', accountManager: 'علی رضایی', status: 'فعال' },
    { id: 'CUST-002', companyName: 'فناوران پیشرو', contactPerson: 'مریم حسینی', email: 'maryam@pishro.co', phone: '09121112233', accountManager: 'زهرا محمدی', status: 'فعال' },
    { id: 'CUST-003', companyName: 'صنایع نوین', contactPerson: 'حسن کریمی', email: 'hasan@novin.ir', phone: '09124445566', accountManager: 'مریم احمدی', status: 'غیرفعال' },
    { id: 'CUST-004', companyName: 'داده پردازان', contactPerson: 'سارا مطلبی', email: 'sara@dadehpardaz.com', phone: '09127778899', accountManager: 'علی رضایی', status: 'فعال' },
    { id: 'CUST-005', companyName: 'شرکت XYZ', contactPerson: 'کاوه محمودی', email: 'kaveh@xyz.org', phone: '09126543210', accountManager: 'زهرا محمدی', status: 'معلق' },
    { id: 'CUST-006', companyName: 'گروه صنعتی بهاران', contactPerson: 'نگین افشار', email: 'negin@baharan.com', phone: '09129876543', accountManager: 'مریم احمدی', status: 'فعال' },
];

const initialLeads: Lead[] = [
    { id: 'LEAD-001', contactName: 'آرش ستوده', companyName: 'دیجی‌کالا', email: 'arash@digikala.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 75, assignedTo: 'مریم احمدی', createdAt: '1403/08/15', converted: false },
    { id: 'LEAD-002', contactName: 'سیمین بهبهانی', companyName: 'کافه‌بازار', email: 'simin@cafebazaar.ir', phone: '09122223344', source: 'ارجاعی', status: 'تماس گرفته شده', score: 60, assignedTo: 'علی رضایی', createdAt: '1403/08/14', converted: false },
    { id: 'LEAD-003', contactName: 'فریدون مشیری', companyName: 'تپسی', email: 'fereydoun@tapsi.cab', phone: '09123334455', source: 'تماس سرد', status: 'واجد شرایط', score: 85, assignedTo: 'زهرا محمدی', createdAt: '1403/08/12', converted: false },
    { id: 'LEAD-004', contactName: 'پروین اعتصامی', companyName: 'اسنپ', email: 'parvin@snapp.cab', phone: '09124445566', source: 'شبکه اجتماعی', status: 'جدید', score: 50, assignedTo: 'مریم احمدی', createdAt: '1403/08/11', converted: false },
    { id: 'LEAD-005', contactName: 'نیما یوشیج', companyName: 'آپارات', email: 'nima@aparat.com', phone: '09125556677', source: 'وبسایت', status: 'از دست رفته', score: 20, assignedTo: 'علی رضایی', createdAt: '1403/08/10', converted: false },
    { id: 'LEAD-006', contactName: 'سهراب سپهری', companyName: 'شیپور', email: 'sohrab@sheypoor.com', phone: '09126667788', source: 'ارجاعی', status: 'تبدیل شده', score: 95, assignedTo: 'زهرا محمدی', createdAt: '1403/08/09', converted: true },
];

const initialOpportunities: Opportunity[] = [
    { id: 'OPP-001', name: 'پروژه CRM جدید', customerName: 'شرکت ABC', amount: 150000000, stage: 'ارائه پیشنهاد', closeDate: '1403/09/15', assignedTo: 'علی رضایی' },
    { id: 'OPP-002', name: 'تمدید اشتراک سالانه', customerName: 'فناوران پیشرو', amount: 50000000, stage: 'مذاکره', closeDate: '1403/08/30', assignedTo: 'زهرا محمدی' },
    { id: 'OPP-003', name: 'قرارداد پشتیبانی', customerName: 'داده پردازان', amount: 75000000, stage: 'واجد شرایط', closeDate: '1403/10/01', assignedTo: 'علی رضایی' },
    { id: 'OPP-004', name: 'فروش 10 لایسنس جدید', customerName: 'صنایع نوین', amount: 120000000, stage: 'موفق', closeDate: '1403/08/10', assignedTo: 'مریم احمدی' },
    { id: 'OPP-005', name: 'پروژه وب‌سایت', customerName: 'شرکت XYZ', amount: 250000000, stage: 'شناسایی', closeDate: '1403/11/01', assignedTo: 'زهرا محمدی' },
    { id: 'OPP-006', name: 'ارتقا به پلن Enterprise', customerName: 'آریا سیستم', amount: 90000000, stage: 'ارائه پیشنهاد', closeDate: '1403/09/20', assignedTo: 'مریم احمدی' },
];

const initialProducts: Product[] = [
    { id: 'PROD-001', code: 'CRM-SUB-Y-B', name: 'اشتراک سالانه پایه', description: 'دسترسی به تمام امکانات پایه CRM', price: 50000000 },
    { id: 'PROD-002', code: 'CRM-SUB-Y-P', name: 'اشتراک سالانه حرفه‌ای', description: 'تمام امکانات پایه + گزارش‌های پیشرفته و اتوماسیون', price: 90000000 },
    { id: 'PROD-003', code: 'CRM-LIC-USER', name: 'لایسنس کاربر اضافه', description: 'افزودن یک کاربر جدید به پلن فعلی', price: 12000000 },
    { id: 'PROD-004', code: 'CRM-SVC-CONS', name: 'ساعت مشاوره فنی', description: 'مشاوره و راهنمایی فنی توسط کارشناسان ما', price: 1500000 },
    { id: 'PROD-005', code: 'CRM-SVC-SETUP', name: 'پکیج راه‌اندازی اولیه', description: 'نصب، پیکربندی و آموزش اولیه تیم شما', price: 60000000 },
];

const initialQuotes: Quote[] = [];
const initialInvoices: Invoice[] = [];

const mockTickets: Ticket[] = [
    { 
      id: 'TKT-00123', subject: 'مشکل در ورود به سیستم', customer: 'شرکت ABC', status: 'در حال بررسی', priority: 'بالا', assignee: 'علی رضایی', date: '۱۴۰۳/۰۸/۱۵', category: 'فنی',
      history: [
        { id: 'TR-1', author: 'شرکت ABC', text: 'سلام، من در ورود به سیستم مشکل دارم و خطای نام کاربری یا رمز عبور اشتباه است دریافت می‌کنم.', timestamp: '۱۴۰۳/۰۸/۱۵ ۱۰:۰۰', isInternal: false, authorAvatar: 'https://i.pravatar.cc/40?u=CUST-001' },
        { id: 'TR-2', author: 'علی رضایی', authorId: 'USER-1', text: 'سلام، مشکل شما در حال بررسی است. لطفاً منتظر بمانید.', timestamp: '۱۴۰۳/۰۸/۱۵ ۱۰:۰۵', isInternal: false, authorAvatar: 'https://i.pravatar.cc/40?u=USER-1' },
        { id: 'TR-3', author: 'علی رضایی', authorId: 'USER-1', text: 'به نظر می‌رسد مشکل از سمت کش مرورگر باشد. کاربر راهنمایی شد تا کش را پاک کند.', timestamp: '۱۴۰۳/۰۸/۱۵ ۱۰:۲۰', isInternal: true, authorAvatar: 'https://i.pravatar.cc/40?u=USER-1' },
      ]
    },
    { id: 'TKT-00122', subject: 'درخواست فیچر جدید', customer: 'شرکت XYZ', status: 'جدید', priority: 'متوسط', assignee: 'مریم احمدی', date: '۱۴۰۳/۰۸/۱۴', category: 'عمومی' },
    { id: 'TKT-00121', subject: 'سوال در مورد صورتحساب', customer: 'فناوران پیشرو', status: 'بسته شده', priority: 'متوسط', assignee: 'علی رضایی', date: '۱۴۰۳/۰۸/۱۴', category: 'مالی', surveySubmitted: true, rating: 5, feedbackTags: ['پاسخ سریع', 'راه حل مناسب'] },
    { id: 'TKT-00120', subject: 'گزارش باگ در داشبورد', customer: 'داده پردازان', status: 'حل شده', priority: 'حیاتی', assignee: 'زهرا محمدی', date: '۱۴۰۳/۰۸/۱۳', category: 'پشتیبانی', surveySubmitted: false },
    { id: 'TKT-00119', subject: 'عدم ارسال نوتیفیکیشن', customer: 'صنایع نوین', status: 'بسته شده', priority: 'بالا', assignee: 'مریم احمدی', date: '۱۴۰۳/۰۸/۱۲', category: 'فنی', surveySubmitted: true, rating: 4, feedbackTags: ['برخورد عالی کارشناس'] },
    { id: 'TKT-00118', subject: 'نیاز به راهنمایی برای API', customer: 'تجارت الکترونیک پارس', status: 'در انتظار مشتری', priority: 'کم', assignee: 'زهرا محمدی', date: '۱۴۰۳/۰۸/۱۱', category: 'فنی' },
    { id: 'TKT-00117', subject: 'مشکل در پرداخت آنلاین', customer: 'گروه صنعتی بهاران', status: 'بازگشایی شده', priority: 'حیاتی', assignee: 'علی رضایی', date: '۱۴۰۳/۰۸/۱۰', category: 'مالی' },
];

interface PageState {
  name: string;
  params?: any;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activePage, setActivePage] = useState<PageState>({ name: 'dashboard' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Centralized state management
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [channels, setChannels] = useState<ChatChannel[]>(initialChannels);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  // User/Portal Mode State
  const [currentUser, setCurrentUser] = useState<User | Customer | null>(initialUsers.find(u => u.roleId === 'ROLE-1')!);
  const [currentUserType, setCurrentUserType] = useState<'crm' | 'portal'>('crm');


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleSetActivePage = (name: string, params: any = {}) => {
    setActivePage({ name, params });
  };
  
  // --- LOGIN/PORTAL HANDLERS ---
  const handleLoginAs = (userOrCustomer: User | Customer, type: 'crm' | 'portal') => {
      setCurrentUser(userOrCustomer);
      setCurrentUserType(type);
      if(type === 'portal') {
          setActivePage({ name: 'tickets' });
      } else {
          setActivePage({ name: 'dashboard' });
      }
  };

  const handleLogout = () => {
      // Log back in as admin
      handleLoginAs(initialUsers.find(u => u.roleId === 'ROLE-1')!, 'crm');
  };

  // --- TICKET MODULE HANDLERS ---
  const handleAddTicket = (ticket: Omit<Ticket, 'id' | 'assignee' | 'date' >) => {
    const newTicketWithId: Ticket = {
      id: `TKT-${String(Date.now()).slice(-5)}`,
      assignee: 'تخصیص نیافته',
      date: new Date().toLocaleDateString('fa-IR-u-nu-latn').replace(/\//g, '/'),
      ...ticket
    };
    setTickets(prev => [newTicketWithId, ...prev]);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(currentTickets => currentTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };
  
  const handleSurveySubmit = (ticketId: string, rating: number, feedback: string, tags: string[]) => {
      const ticketToUpdate = tickets.find(t => t.id === ticketId);
      if (ticketToUpdate) {
        handleUpdateTicket({
            ...ticketToUpdate,
            rating: rating,
            surveySubmitted: true,
            feedbackTags: tags
            // You could also add the feedback to the ticket history as an internal note
        });
      }
  };

  const handleCreateTaskFromTicket = (ticket: Ticket) => {
      handleSetActivePage('tasks', { 
          action: 'create', 
          prefill: {
              title: `رسیدگی به تیکت: ${ticket.subject}`,
              customer: ticket.customer,
              relatedTicketId: ticket.id,
              priority: ticket.priority === 'حیاتی' ? 'فوری' : ticket.priority === 'کم' ? 'پایین' : ticket.priority,
          }
      });
  };

  // --- CUSTOMER MODULE HANDLERS ---
  const handleAddCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { 
      id: `CUST-${Date.now()}`,
      accountManager: 'علی رضایی',
      status: 'فعال',
      ...customer, 
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };


  // --- SALES MODULE HANDLERS ---
  const handleAddLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = { ...lead, id: `LEAD-${Date.now()}` };
    setLeads(prev => [newLead, ...prev]);
  };
  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };
  const handleConvertLead = (lead: Lead, opportunityName: string, opportunityAmount: number) => {
      const newCustomer: Customer = {
          id: `CUST-${Date.now()}`,
          companyName: lead.companyName || lead.contactName,
          contactPerson: lead.contactName,
          email: lead.email || '',
          phone: lead.phone || '',
          accountManager: lead.assignedTo,
          status: 'فعال',
      };
      setCustomers(prev => [newCustomer, ...prev]);

      const newOpportunity: Opportunity = {
          id: `OPP-${Date.now()}`,
          name: opportunityName,
          customerName: newCustomer.companyName,
          amount: opportunityAmount,
          stage: 'واجد شرایط',
          closeDate: new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('fa-IR-u-nu-latn'),
          assignedTo: lead.assignedTo,
      };
      setOpportunities(prev => [newOpportunity, ...prev]);
      handleUpdateLead({ ...lead, status: 'تبدیل شده', converted: true });
  };
  const handleUpdateOpportunity = (opportunityId: string, updates: Partial<Opportunity>) => {
      setOpportunities(prev => prev.map(opp => opp.id === opportunityId ? { ...opp, ...updates } : opp));
  };
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: `PROD-${Date.now()}` };
    setProducts(prev => [newProduct, ...prev]);
  };
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddQuote = (quote: Omit<Quote, 'id'>) => {
    const newQuote: Quote = { ...quote, id: `QT-${Date.now()}` };
    setQuotes(prev => [newQuote, ...prev]);
  };
  const handleUpdateQuote = (updatedQuote: Quote) => {
    setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
  };

  const handleAddInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = { ...invoice, id: `INV-${Date.now()}` };
    setInvoices(prev => [newInvoice, ...prev]);
  };
  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
  };
  
  const handleCreateInvoiceFromQuote = (quote: Quote) => {
      handleSetActivePage('invoices', { 
          action: 'create', 
          prefill: {
              quoteId: quote.id,
              customerId: quote.customerId,
              items: quote.items,
              subtotal: quote.subtotal,
              discountAmount: quote.discountAmount,
              taxAmount: quote.taxAmount,
              totalAmount: quote.totalAmount,
          }
      });
  };

  const pageTitles: { [key: string]: string } = {
    dashboard: 'داشبورد مدیریتی',
    customers: 'مدیریت مشتریان',
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
  };

  const renderPage = () => {
    switch (activePage.name) {
      case 'customers':
        return <Customers 
            customers={customers} 
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
        />;
      case 'tickets':
        return <Tickets 
            tickets={tickets}
            users={users}
            onAddTicket={handleAddTicket}
            onUpdateTicket={handleUpdateTicket}
            onCreateTaskFromTicket={handleCreateTaskFromTicket} 
        />;
      case 'tasks':
        return <Tasks initialParams={activePage.params} users={users} />;
      case 'opportunities':
        return <Opportunities opportunities={opportunities} onUpdateOpportunity={handleUpdateOpportunity} />;
      case 'leads':
        return <Leads 
            leads={leads}
            users={users}
            onAddLead={handleAddLead}
            onUpdateLead={handleUpdateLead}
            onConvertLead={handleConvertLead}
        />;
      case 'products':
        return <Products products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} />;
      case 'quotes':
        return <Quotes
            quotes={quotes}
            customers={customers}
            products={products}
            onAddQuote={handleAddQuote}
            onUpdateQuote={handleUpdateQuote}
            onCreateInvoiceFromQuote={handleCreateInvoiceFromQuote}
          />;
      case 'invoices':
        return <Invoices
            initialParams={activePage.params}
            invoices={invoices}
            quotes={quotes}
            customers={customers}
            products={products}
            onAddInvoice={handleAddInvoice}
            onUpdateInvoice={handleUpdateInvoice}
          />;
      case 'chat':
        return <Chat channels={channels} users={users} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return (
          <Settings 
            users={users}
            setUsers={setUsers}
            roles={roles}
            setRoles={setRoles}
            channels={channels}
            setChannels={setChannels}
          />
        );
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  if (currentUserType === 'portal' && currentUser) {
      return (
          <CustomerPortal 
              customer={currentUser as Customer}
              onLogout={handleLogout}
              tickets={tickets.filter(t => t.customer === (currentUser as Customer).companyName)}
              onAddTicket={handleAddTicket}
              onUpdateTicket={handleUpdateTicket}
              onSurveySubmit={handleSurveySubmit}
          />
      );
  }

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
            <h1 className="text-xl sm:text-2xl font-semibold">{pageTitles[activePage.name]}</h1>
          </div>
          <div className="flex items-center space-i-4">
            <LoginAs 
              users={users}
              customers={customers}
              currentUser={currentUser}
              onLoginAs={handleLoginAs}
            />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>
        <div className={`flex-1 overflow-x-hidden overflow-y-auto ${!['chat', 'opportunities'].includes(activePage.name) ? 'p-6' : ''}`}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;