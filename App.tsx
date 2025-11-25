
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
import { User, Customer, Ticket, Interaction, Lead, Opportunity, Product, Quote, Invoice, Role, KnowledgeBaseCategory, KnowledgeBaseArticle, Contact, Reminder, Task, Vendor, PurchaseOrder, Payment, InvoiceStatus, CompanyInfo, InventoryTransaction, InventoryTransactionType, PersonnelRequest, RequestStatus } from './types';
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
import Personnel from './components/pages/Personnel';
import { toShamsi } from './utils/date';

// --- MOCK DATA AGGREGATION ---
const mockRoles: Role[] = [
    { id: 'R1', name: 'مدیر کل', permissions: 'view_customers,create_customers,edit_customers,delete_customers,view_tickets,create_tickets,edit_tickets,delete_tickets,view_sales,create_sales,edit_sales,delete_sales,view_reports,manage_users,manage_roles,view_inventory,create_inventory_txn,view_vendors,manage_purchases,view_finance,create_payment,view_personnel_requests,create_personnel_requests,approve_personnel_requests' },
    { id: 'R2', name: 'کارشناس پشتیبانی', permissions: 'view_customers,view_tickets,create_tickets,edit_tickets,create_personnel_requests' },
    { id: 'R3', name: 'کارشناس فروش', permissions: 'view_customers,create_customers,view_sales,create_sales,edit_sales,create_personnel_requests' },
    { id: 'R4', name: 'حسابدار', permissions: 'view_customers,view_finance,create_payment,view_invoices,view_personnel_requests,create_personnel_requests' },
];

// Updated Mock Users with Hierarchy
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2', managerId: 'U1' },
  { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R3', avatar: 'https://i.pravatar.cc/40?u=U3', managerId: 'U1' },
  { id: 'U4', name: 'سارا حسابدار', username: 'sara', roleId: 'R4', avatar: 'https://i.pravatar.cc/40?u=U4', managerId: 'U1' }, // New Restricted User
];

// Helper to create ISO dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const daysAhead = (days: number) => new Date(Date.now() + days * 86400000).toISOString();

// --- EXTENDED MOCK CUSTOMERS ---
const generateMockCustomers = (): Customer[] => {
    const baseCustomers = [
        { id: 'C1', name: 'شرکت آلفا', username: 'alpha', email: 'info@alpha.com', phone: '021-12345678', status: 'فعال', portalToken: 'alpha-xyz', supportEndDate: daysAhead(365) },
        { id: 'C2', name: 'تجارت بتا', username: 'beta', email: 'contact@beta.com', phone: '021-87654321', status: 'غیرفعال', portalToken: 'beta-abc', supportEndDate: daysAgo(30) },
        { id: 'C3', name: 'صنایع گاما', username: 'gamma', email: 'office@gamma.com', phone: '021-11223344', status: 'فعال' },
        { id: 'C4', name: 'راهکارهای دلتا', username: 'delta', email: 'sales@delta.com', phone: '021-55667788', status: 'معلق' },
        { id: 'C5', name: 'بازرگانی امید', username: 'omid', email: 'info@omidtr.com', phone: '021-33221100', status: 'فعال' },
        { id: 'C6', name: 'تکنولوژی برتر', username: 'bartar', email: 'tech@bartar.ir', phone: '021-99887766', status: 'فعال' },
        { id: 'C7', name: 'فروشگاه مرکزی', username: 'central', email: 'shop@central.com', phone: '021-44556677', status: 'غیرفعال' },
        { id: 'C8', name: 'موسسه دانش', username: 'danesh', email: 'edu@danesh.ac', phone: '021-66554433', status: 'فعال' },
        { id: 'C9', name: 'کلینیک سلامت', username: 'salamat', email: 'clinic@salamat.org', phone: '021-22110099', status: 'فعال' },
        { id: 'C10', name: 'کارخانه فولاد', username: 'foolad', email: 'factory@foolad.com', phone: '021-77889900', status: 'معلق' },
        { id: 'C11', name: 'پخش مواد غذایی', username: 'food', email: 'dist@food.com', phone: '021-55443322', status: 'فعال' },
        { id: 'C12', name: 'آژانس مسافرتی سفر', username: 'safar', email: 'tour@safar.com', phone: '021-88776655', status: 'فعال' },
        { id: 'C13', name: 'استارتاپ نوآور', username: 'noavar', email: 'hello@noavar.io', phone: '09120000000', status: 'فعال' },
        { id: 'C14', name: 'بیمارستان شفا', username: 'shafa', email: 'info@shafahosp.ir', phone: '021-11112222', status: 'فعال' },
        { id: 'C15', name: 'مدرسه هوشمند', username: 'school', email: 'admin@school.edu', phone: '021-33334444', status: 'غیرفعال' },
    ];

    return baseCustomers.map(c => ({
        ...c,
        contacts: [
            { id: `P-${c.id}-1`, name: `مدیر ${c.name}`, phone: `0912${Math.floor(Math.random() * 9000000) + 1000000}`, position: 'مدیرعامل', isPrimary: true },
            { id: `P-${c.id}-2`, name: `رابط فنی ${c.name}`, phone: `0919${Math.floor(Math.random() * 9000000) + 1000000}`, position: 'مدیر فنی', isPrimary: false },
        ],
        customerType: 'شرکتی'
    })) as Customer[];
};

const mockCustomers = generateMockCustomers();

// --- EXTENDED MOCK TICKETS ---
const mockTicketsData: Ticket[] = [
    { id: 'TKT-721', subject: 'مشکل در ورود به پنل کاربری', description: 'کاربر اعلام کرده نمی‌تواند وارد پنل شود.', customerId: 'C1', customer: mockCustomers[0], assigneeId: 'U1', assignee: mockUsers[0], status: 'در حال بررسی', priority: 'بالا', createdAt: daysAgo(1), category: 'فنی', replies: [{id: 'R1', authorId: 'U1', authorType: 'User', authorName: 'علی رضایی', text: 'در حال بررسی مشکل هستیم.', isInternal: false, createdAt: daysAgo(1), authorAvatar: mockUsers[0].avatar}] },
    { id: 'TKT-720', subject: 'سوال در مورد صورتحساب', customerId: 'C2', customer: mockCustomers[1], assigneeId: 'U2', assignee: mockUsers[1], status: 'جدید', priority: 'متوسط', createdAt: daysAgo(2), category: 'مالی' },
    { id: 'TKT-719', subject: 'گزارش باگ در ماژول گزارشات', customerId: 'C1', customer: mockCustomers[0], assigneeId: 'U1', assignee: mockUsers[0], status: 'حل شده', priority: 'بالا', createdAt: daysAgo(5), category: 'فنی', surveySubmitted: false },
    { id: 'TKT-718', subject: 'درخواست افزودن ویژگی جدید', customerId: 'C2', customer: mockCustomers[1], status: 'در انتظار مشتری', priority: 'کم', createdAt: daysAgo(7), category: 'عمومی' },
    { id: 'TKT-717', subject: 'راهنمایی برای تنظیمات اولیه', customerId: 'C3', customer: mockCustomers[2], assigneeId: 'U2', assignee: mockUsers[1], status: 'بسته شده', priority: 'متوسط', createdAt: daysAgo(8), category: 'پشتیبانی' },
    { id: 'TKT-716', subject: 'خطای 500 در صفحه پرداخت', customerId: 'C4', customer: mockCustomers[3], assigneeId: 'U1', assignee: mockUsers[0], status: 'در حال بررسی', priority: 'حیاتی', createdAt: daysAgo(9), category: 'فنی' },
    { id: 'TKT-715', subject: 'تمدید قرارداد پشتیبانی', customerId: 'C5', customer: mockCustomers[4], assigneeId: 'U3', assignee: mockUsers[2], status: 'جدید', priority: 'بالا', createdAt: daysAgo(10), category: 'مالی' },
    { id: 'TKT-714', subject: 'مشکل در چاپ فاکتور', customerId: 'C6', customer: mockCustomers[5], assigneeId: 'U2', assignee: mockUsers[1], status: 'حل شده', priority: 'کم', createdAt: daysAgo(11), category: 'فنی' },
    { id: 'TKT-713', subject: 'سوال درباره API', customerId: 'C1', customer: mockCustomers[0], assigneeId: 'U1', assignee: mockUsers[0], status: 'بسته شده', priority: 'متوسط', createdAt: daysAgo(12), category: 'فنی' },
    { id: 'TKT-712', subject: 'عدم دریافت ایمیل تایید', customerId: 'C7', customer: mockCustomers[6], assigneeId: 'U2', assignee: mockUsers[1], status: 'در حال بررسی', priority: 'بالا', createdAt: daysAgo(13), category: 'پشتیبانی' },
    { id: 'TKT-711', subject: 'درخواست دمو حضوری', customerId: 'C8', customer: mockCustomers[7], assigneeId: 'U3', assignee: mockUsers[2], status: 'جدید', priority: 'متوسط', createdAt: daysAgo(14), category: 'عمومی' },
    { id: 'TKT-710', subject: 'تغییر آدرس شرکت', customerId: 'C9', customer: mockCustomers[8], assigneeId: 'U4', assignee: mockUsers[3], status: 'حل شده', priority: 'کم', createdAt: daysAgo(15), category: 'مالی' },
];

// --- EXTENDED MOCK INTERACTIONS ---
const generateMockInteractions = (): Interaction[] => {
    const interactions: Interaction[] = [];
    const types: Interaction['type'][] = ['تماس', 'ایمیل', 'جلسه', 'یادداشت'];
    const texts = [
        'پیگیری وضعیت قرارداد جدید.',
        'ارسال پیش‌فاکتور تمدید سرویس.',
        'جلسه حضوری برای بررسی نیازهای فنی.',
        'تماس جهت هماهنگی زمان نصب.',
        'ایمیل یادآوری پرداخت صورتحساب.',
        'بررسی مشکلات گزارش شده در تیکت اخیر.',
        'ارسال مستندات فنی API.',
        'هماهنگی جهت بازدید از محل شرکت.',
        'تماس خروجی جهت نظرسنجی رضایت.',
        'یادداشت: مشتری درخواست تخفیف دارد.'
    ];

    for (let i = 0; i < 25; i++) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
        interactions.push({
            id: `I-${i + 1}`,
            customerId: randomCustomer.id,
            contactId: randomCustomer.contacts[0].id,
            contactName: randomCustomer.contacts[0].name,
            userId: randomUser.id,
            user: randomUser,
            createdAt: daysAgo(Math.floor(Math.random() * 30)),
            text: texts[Math.floor(Math.random() * texts.length)],
            type: types[Math.floor(Math.random() * types.length)],
        });
    }
    return interactions;
};

const mockInteractions = generateMockInteractions();

const mockKbCategories: KnowledgeBaseCategory[] = [
    { id: 'KBC1', name: 'راهنمای شروع' },
    { id: 'KBC2', name: 'عیب‌یابی فنی' },
    { id: 'KBC3', name: 'سوالات متداول فروش' },
    { id: 'KBC4', name: 'سیاست‌های داخلی' },
];

const mockKbArticles: KnowledgeBaseArticle[] = [
    { id: 'KBA1', title: 'چگونه یک تیکت جدید ثبت کنیم؟', content: 'برای ثبت تیکت جدید، از منوی پورتال مشتریان گزینه تیکت‌ها را انتخاب کرده و روی دکمه <b>"تیکت جدید"</b> کلیک کنید... <br/> <img src="https://via.placeholder.com/400x200.png?text=Ticket+Example" alt="Example"/>', categoryId: 'KBC1', tags: ['تیکت', 'مشتری'], authorId: 'U1', createdAt: daysAgo(30), visibility: 'public' },
    { id: 'KBA2', title: 'خطای 500 هنگام ورود به پنل', content: 'این خطا معمولا به دلیل مشکلات سمت سرور است. لطفاً ابتدا کش مرورگر خود را پاک کرده و مجددا تلاش کنید. در صورت عدم رفع مشکل، با <a href="mailto:support@example.com">پشتیبانی</a> تماس بگیرید.', categoryId: 'KBC2', tags: ['خطا', 'ورود', 'فنی'], authorId: 'U2', createdAt: daysAgo(25), visibility: 'public' },
    { id: 'KBA3', title: 'راهنمای قیمت‌گذاری سرویس‌ها', content: 'این یک سند داخلی است و نباید در دسترس مشتری قرار گیرد. پلن‌های قیمت‌گذاری به شرح زیر است...', categoryId: 'KBC3', tags: ['قیمت', 'فروش'], authorId: 'U3', createdAt: daysAgo(10), visibility: 'internal' },
    { id: 'KBA4', title: 'سیاست مرخصی کارکنان', content: 'هر کارمند در سال مجاز به استفاده از ۲۴ روز مرخصی با حقوق است...', categoryId: 'KBC4', tags: ['منابع انسانی', 'داخلی'], authorId: 'U1', createdAt: daysAgo(60), visibility: 'internal' },
];

const mockTasksData: Task[] = [
    { 
        id: 'TSK1', title: 'پیگیری تیکت #721', description: 'مشتری در مورد ورود به پنل کاربری مشکل دارد.', customer: mockCustomers[0], relatedTicketId: 'TKT-721', assignedTo: mockUsers[0], assignedToId: 'U1', createdById: 'U2', priority: 'بالا', status: 'در حال انجام', dueDate: daysAhead(5), createdAt: daysAgo(2),
        comments: [
            { id: 'TC1', userId: 'U2', userName: 'زهرا احمدی', text: 'لطفا سریعتر بررسی کنید.', createdAt: daysAgo(1) }
        ]
    },
    { id: 'TSK2', title: 'آماده‌سازی پیش‌فاکتور برای تجارت بتا', description: '', customer: mockCustomers[1], assignedTo: mockUsers[0], assignedToId: 'U1', createdById: 'U1', priority: 'متوسط', status: 'معلق', dueDate: daysAhead(10), createdAt: daysAgo(1), comments: [] },
    { id: 'TSK3', title: 'جلسه دمو با مشتری جدید', description: 'معرفی ویژگی‌های جدید محصول', assignedTo: mockUsers[1], assignedToId: 'U2', createdById: 'U1', priority: 'فوری', status: 'تکمیل شده', dueDate: daysAgo(3), createdAt: daysAgo(5), comments: [] },
    { id: 'TSK4', title: 'تماس با بازرگانی امید', description: 'پیگیری پرداخت فاکتور', customer: mockCustomers[4], assignedTo: mockUsers[3], assignedToId: 'U4', createdById: 'U1', priority: 'بالا', status: 'در انتظار', dueDate: daysAhead(1), createdAt: daysAgo(1), comments: [] },
    { id: 'TSK5', title: 'بررسی موجودی انبار', description: 'سفارش جدید نیاز به چک کردن موجودی دارد', assignedTo: mockUsers[0], assignedToId: 'U1', createdById: 'U3', priority: 'متوسط', status: 'معلق', dueDate: daysAhead(2), createdAt: daysAgo(0), comments: [] },
    { id: 'TSK6', title: 'ارسال قرارداد برای کلینیک سلامت', description: 'قرارداد امضا شده ارسال شود', customer: mockCustomers[8], assignedTo: mockUsers[2], assignedToId: 'U3', createdById: 'U1', priority: 'پایین', status: 'تکمیل شده', dueDate: daysAgo(5), createdAt: daysAgo(7), comments: [] },
];

const mockQuotes: Quote[] = [
    { id: 'Q-123', quoteNumber: '1001', version: 1, customerId: 'C1', customerName: 'شرکت آلفا', issueDate: daysAgo(2), expiryDate: daysAhead(12), status: 'تایید شده', isOfficial: true, items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, totalPrice: 10000000, discountType: 'percent', discount: 10, totalAfterDiscount: 9000000, tax: 9, totalWithTax: 9810000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000, note: 'شرایط پرداخت: ۵۰٪ نقد و ۵۰٪ یک ماهه' },
    { id: 'Q-124', quoteNumber: '1002', version: 1, customerId: 'C2', customerName: 'تجارت بتا', issueDate: daysAgo(10), expiryDate: daysAhead(5), status: 'ارسال شده', isOfficial: false, items: [{ productId: 'P2', productName: 'سرویس پشتیبانی نقره‌ای', quantity: 2, unitPrice: 5000000, totalPrice: 10000000, discountType: 'amount', discount: 0, totalAfterDiscount: 10000000, tax: 9, totalWithTax: 10900000 }], subtotal: 10000000, discountAmount: 0, taxAmount: 900000, totalAmount: 10900000 },
    { id: 'Q-125', quoteNumber: '1003', version: 1, customerId: 'C3', customerName: 'صنایع گاما', issueDate: daysAgo(15), expiryDate: daysAgo(1), status: 'رد شده', isOfficial: true, items: [], subtotal: 0, discountAmount: 0, taxAmount: 0, totalAmount: 0 },
    { id: 'Q-126', quoteNumber: '1004', version: 1, customerId: 'C5', customerName: 'بازرگانی امید', issueDate: daysAgo(1), expiryDate: daysAhead(14), status: 'پیش‌نویس', isOfficial: false, items: [], subtotal: 0, discountAmount: 0, taxAmount: 0, totalAmount: 0 },
];

const mockInvoices: Invoice[] = [
    { id: 'INV-001', isOfficial: true, quoteId: 'Q-123', customerId: 'C1', customerName: 'شرکت آلفا', issueDate: daysAgo(1), status: 'ارسال شده', items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, totalPrice: 10000000, discountType: 'percent', discount: 10, totalAfterDiscount: 9000000, tax: 9, totalWithTax: 9810000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000, amountPaid: 0, note: 'لطفاً در هنگام واریز شناسه فاکتور را قید نمایید.' },
    { id: 'INV-002', isOfficial: true, customerId: 'C3', customerName: 'صنایع گاما', issueDate: daysAgo(5), status: 'سررسید گذشته', items: [], subtotal: 5000000, discountAmount: 0, taxAmount: 450000, totalAmount: 5450000, amountPaid: 0 },
    { id: 'INV-003', isOfficial: false, customerId: 'C6', customerName: 'تکنولوژی برتر', issueDate: daysAgo(10), status: 'پرداخت شده', items: [], subtotal: 2000000, discountAmount: 0, taxAmount: 0, totalAmount: 2000000, amountPaid: 2000000 },
    { id: 'INV-004', isOfficial: true, customerId: 'C8', customerName: 'موسسه دانش', issueDate: daysAgo(2), status: 'پرداخت جزئی', items: [], subtotal: 10000000, discountAmount: 0, taxAmount: 900000, totalAmount: 10900000, amountPaid: 5000000 },
];

const mockVendors: Vendor[] = [
    { id: 'V1', name: 'فروشگاه سخت‌افزار ایران', contactName: 'آقای محمدی', email: 'sales@iranhw.com', phone: '021-33445566', status: 'فعال' },
    { id: 'V2', name: 'خدمات ابری پارس', contactName: 'خانم رضایی', email: 'support@parscloud.ir', phone: '021-88997766', status: 'فعال' },
    { id: 'V3', name: 'تامین الکترونیک', contactName: 'آقای کریمی', email: 'info@elecsupply.com', phone: '021-66778899', status: 'فعال' },
];

const mockLeads: Lead[] = [
    { id: 'L1', contactName: 'سارا محمدی', companyName: 'فروشگاه سارا', email: 'sara@shop.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 85, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(2), converted: false },
    { id: 'L2', contactName: 'رضا قاسمی', companyName: 'خدمات رضا', email: 'reza@service.com', phone: '09124445566', source: 'ارجاعی', status: 'واجد شرایط', score: 70, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(5), converted: false },
    { id: 'L3', contactName: 'مریم حسینی', companyName: '', email: 'maryam@mail.com', phone: '09127778899', source: 'تماس سرد', status: 'تماس گرفته شده', score: 50, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(10), converted: false },
    { id: 'L4', contactName: 'پیمان عزیزی', companyName: 'صنایع پیمان', email: 'peyman@industry.com', phone: '09121234567', source: 'شبکه اجتماعی', status: 'تبدیل شده', score: 95, assignedToId: 'U3', assignedTo: mockUsers[2], createdAt: daysAgo(15), converted: true },
];

const mockOpportunities: Opportunity[] = [
    { id: 'OP1', name: 'پروژه وبسایت فروشگاهی', customerName: 'فروشگاه سارا', customerId: 'C-L1', amount: 250000000, stage: 'ارائه پیشنهاد', closeDate: daysAhead(15), assignedToId: 'U1', assignedTo: mockUsers[0] },
    { id: 'OP2', name: 'قرارداد پشتیبانی سالانه', customerName: 'صنایع گاما', customerId: 'C3', amount: 120000000, stage: 'مذاکره', closeDate: daysAhead(5), assignedToId: 'U3', assignedTo: mockUsers[1] },
    { id: 'OP3', name: 'توسعه ماژول گزارشات', customerName: 'شرکت آلفا', customerId: 'C1', amount: 80000000, stage: 'واجد شرایط', closeDate: daysAhead(30), assignedToId: 'U1', assignedTo: mockUsers[0] },
];

const initialCompanyInfo: CompanyInfo = {
    name: 'شرکت فناوری اطلاعات CRM Pro',
    appName: 'CRM Pro', // Default App Name
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
    users: User[],
    setUsers: React.Dispatch<React.SetStateAction<User[]>>,
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
    personnelRequests: PersonnelRequest[],
    setPersonnelRequests: React.Dispatch<React.SetStateAction<PersonnelRequest[]>>,
    interactions: Interaction[],
    setInteractions: React.Dispatch<React.SetStateAction<Interaction[]>>,
    onLogout: () => void,
    noteTemplates: string[],
    setNoteTemplates: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ user, users, setUsers, customers, setCustomers, kbCategories, setKbCategories, kbArticles, setKbArticles, reminders, setReminders, tasks, setTasks, quotes, setQuotes, invoices, setInvoices, vendors, setVendors, purchaseOrders, setPurchaseOrders, payments, setPayments, companyInfo, setCompanyInfo, products, setProducts, inventoryTransactions, setInventoryTransactions, personnelRequests, setPersonnelRequests, interactions, setInteractions, onLogout, noteTemplates, setNoteTemplates }) => {
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

  // Opportunities
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);

  const handleSetActivePage = (name: string, params: any = {}) => {
    setActivePage({ name, params });
    setIsSidebarOpen(false);
  };

  // --- HELPER FOR NOTIFICATIONS ---
  const addSystemNotification = (title: string, description: string = '', sourceType: Reminder['sourceType'] = 'manual', sourceId: string = '') => {
      const newReminder: Reminder = {
          id: `NOTIF-${Date.now()}`,
          userId: user.id,
          title: title,
          description: description,
          dueDateTime: new Date().toISOString(),
          isCompleted: false,
          isRead: false,
          isNotified: false,
          sourceType: sourceType,
          sourceId: sourceId,
          createdAt: new Date().toISOString()
      };
      setReminders(prev => [newReminder, ...prev]);
      setActiveNotification(newReminder);
  };

  // --- PERSONNEL LOGIC ---
  const handleAddRequest = (requestData: Omit<PersonnelRequest, 'id' | 'status' | 'createdAt' | 'userId' | 'managerId'>) => {
      // Find the manager of the current user
      const currentUser = users.find(u => u.id === user.id);
      const managerId = currentUser?.managerId;

      const newRequest: PersonnelRequest = {
          id: `PR-${Date.now()}`,
          userId: user.id,
          user: user,
          managerId: managerId, 
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...requestData
      };
      setPersonnelRequests(prev => [newRequest, ...prev]);
      
      // Notify Manager (Mock)
      if (managerId) {
          // Ideally find the manager user object and trigger something, here we just simulate
          console.log(`Notification sent to manager ${managerId}`);
      } else {
          // If no manager is assigned, auto-approve or notify admin (not implemented)
          console.log('No manager assigned for this user.');
      }
  };

  const handleUpdateRequestStatus = (requestId: string, status: RequestStatus) => {
      setPersonnelRequests(prev => prev.map(req => {
          if (req.id === requestId) {
              return { ...req, status: status };
          }
          return req;
      }));
      
      // Notify requester
      const req = personnelRequests.find(r => r.id === requestId);
      if (req) {
          const statusText = status === 'approved' ? 'تایید' : 'رد';
          addSystemNotification(`درخواست ${statusText} شد`, `درخواست ${req.type} شما توسط مدیر ${statusText} شد.`, 'manual', requestId);
      }
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

  // --- PRODUCTS CRUD ---
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
      const newProduct: Product = {
          ...product,
          id: `P-${Date.now()}`
      };
      setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (product: Product) => {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const handleDeleteProduct = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
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
            createdById: user.id,
            ...taskData
        };
        setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (task: Task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  };

  const saveTaskFromModal = (data: Omit<Task, 'id' | 'createdAt'>) => {
      if (activeTaskModal.editingTask) {
          const oldTask = activeTaskModal.editingTask;
          handleUpdateTask({ ...oldTask, ...data });
          
          // Notification: Task Re-assigned
          if (oldTask.assignedTo.id !== data.assignedTo.id) {
              addSystemNotification(`تغییر مسئول وظیفه: "${data.title}"`, `وظیفه به ${data.assignedTo.name} محول شد.`, 'task', oldTask.id);
          }
      } else {
          handleAddTask(data);
          // Notification: New Task Assigned
          addSystemNotification(`وظیفه جدید: "${data.title}"`, `وظیفه جدیدی برای ${data.assignedTo.name} ایجاد شد.`, 'task');
      }
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
      // Check for assignee change
      const oldTicket = tickets.find(t => t.id === updatedTicket.id);
      if (oldTicket && oldTicket.assigneeId !== updatedTicket.assigneeId && updatedTicket.assignee) {
          addSystemNotification(`تیکت ${updatedTicket.id} ارجاع شد`, `تیکت "${updatedTicket.subject}" به ${updatedTicket.assignee.name} ارجاع داده شد.`, 'manual', updatedTicket.id);
      }

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
                    registerInventoryMovement(item.productId, item.quantity, 'receipt', savedPo.id, 'ورود خودکار از طریق فاکتور خرید');
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
    purchaseOrders: 'فاکتورهای خرید',
    personnel: 'امور پرسنلی و مرخصی',
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
                interactions={interactions}
                setInteractions={setInteractions}
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
            tickets={tickets}
            setTickets={setTickets}
            onUpdateTicket={handleUpdateTicket}
            onCreateTaskFromTicket={handleCreateTaskFromTicket} 
        />;
      case 'tasks':
        return <Tasks 
            tasks={tasks}
            setTasks={setTasks}
            currentUser={user}
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
        return <Opportunities 
            opportunities={opportunities}
            setOpportunities={setOpportunities}
        />;
      case 'leads':
        return <Leads 
            leads={leads}
            setLeads={setLeads}
            users={users}
        />;
      case 'products':
        return <Products 
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
        />;
      case 'quotes':
        return <Quotes 
            customers={customers} 
            onCreateInvoiceFromQuote={handleCreateInvoiceFromQuote}
            quotes={quotes}
            setQuotes={setQuotes}
            initialParams={activePage.params}
            companyInfo={companyInfo}
            products={products}
            noteTemplates={noteTemplates}
            setNoteTemplates={setNoteTemplates}
        />;
      case 'invoices':
        return <Invoices 
            initialParams={activePage.params} 
            customers={customers} 
            invoices={invoices}
            setInvoices={setInvoices}
            quotes={quotes}
            companyInfo={companyInfo}
            products={products}
            noteTemplates={noteTemplates}
            setNoteTemplates={setNoteTemplates}
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
      case 'personnel':
          return <Personnel 
              currentUser={user}
              users={users}
              requests={personnelRequests}
              onAddRequest={handleAddRequest}
              onUpdateRequestStatus={handleUpdateRequestStatus}
          />;
      case 'chat':
        return <Chat 
            currentUser={user}
            onCreateTask={handleCreateTaskFromMessage}
            onOpenReminderModal={openReminderModal}
        />;
      case 'reports':
        return <Reports 
            users={users} 
            interactions={interactions} 
            tickets={tickets} 
        />;
      case 'settings':
        return <Settings 
            customers={customers} 
            setCustomers={setCustomers} 
            companyInfo={companyInfo} 
            setCompanyInfo={setCompanyInfo} 
            users={users}
            setUsers={setUsers}
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
        return <Dashboard customers={customers} onNavigate={handleSetActivePage} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans overflow-hidden">
      <Sidebar 
        user={user}
        activePage={activePage.name} 
        setActivePage={handleSetActivePage} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        appName={companyInfo.appName || 'CRM Pro'}
      />
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          aria-label="Close sidebar"
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
                user={user}
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
            currentUser={user}
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
  const [users, setUsers] = useState<User[]>(mockUsers);
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
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({...initialCompanyInfo, appName: 'CRM Pro'});
  const [personnelRequests, setPersonnelRequests] = useState<PersonnelRequest[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);
  const [noteTemplates, setNoteTemplates] = useState<string[]>([
      "شرایط پرداخت: ۵۰٪ نقد و الباقی طی یک فقره چک صیادی به تاریخ یک ماه آینده.",
      "اعتبار این پیش‌فاکتور از تاریخ صدور به مدت ۷ روز کاری می‌باشد.",
      "لطفاً در هنگام واریز وجه، شناسه پرداخت یا شماره فاکتور را در شرح فیش درج نمایید.",
      "هزینه حمل و نقل بر عهده خریدار می‌باشد."
  ]);
  
  // Products State (Shared for PO and Quotes, now with Stock and Tax)
  const [products, setProducts] = useState<Product[]>([
    { id: 'P1', name: 'سرویس پشتیبانی طلایی', price: 10000000, code: 'SRV-001', stock: 0, type: 'service', tax: 9 }, 
    { id: 'P2', name: 'سرویس پشتیبانی نقره‌ای', price: 5000000, code: 'SRV-002', stock: 0, type: 'service', tax: 9 }, 
    { id: 'P3', name: 'لایسنس تک کاربره', price: 2000000, code: 'LIC-001', stock: 5, type: 'product', tax: 9 },
    { id: 'P4', code: 'LIC-TEAM', name: 'لایسنس تیمی (۵ کاربر)', description: 'مجوز استفاده برای ۵ کاربر', price: 8000000, stock: 10, type: 'product', tax: 9 },
    { id: 'P5', code: 'HW-SRV-1', name: 'سرور فیزیکی مدل A', description: 'CPU 16 Core, 64GB RAM', price: 150000000, stock: 5, type: 'product', tax: 9 },
    { id: 'P6', code: 'HW-SW-24', name: 'سوییچ شبکه ۲۴ پورت', description: 'برند سیسکو', price: 12000000, stock: 15, type: 'product', tax: 9 },
    { id: 'P7', code: 'CONS-HR', name: 'مشاوره منابع انسانی', description: 'ساعتی', price: 1000000, stock: 0, type: 'service', tax: 0 },
    { id: 'P8', code: 'CONS-TECH', name: 'مشاوره فنی', description: 'ساعتی', price: 1500000, stock: 0, type: 'service', tax: 0 },
    { id: 'P9', code: 'SOFT-ACC', name: 'نرم‌افزار حسابداری', description: 'نسخه شرکتی', price: 5000000, stock: 100, type: 'product', tax: 9 },
    { id: 'P10', code: 'SOFT-CRM', name: 'نرم‌افزار CRM', description: 'نسخه ابری', price: 3000000, stock: 999, type: 'service', tax: 9 },
    { id: 'P11', code: 'TR-BASIC', name: 'دوره آموزشی مقدماتی', description: '۸ ساعت', price: 2000000, stock: 0, type: 'service', tax: 0 },
    { id: 'P12', code: 'TR-ADV', name: 'دوره آموزشی پیشرفته', description: '۱۶ ساعت', price: 4000000, stock: 0, type: 'service', tax: 0 },
    { id: 'P13', code: 'HW-LAPTOP', name: 'لپ‌تاپ سازمانی', description: 'Core i5, 16GB', price: 35000000, stock: 8, type: 'product', tax: 9 },
    { id: 'P14', code: 'HW-MOUSE', name: 'ماوس بی‌سیم', description: 'ارگونومیک', price: 800000, stock: 50, type: 'product', tax: 9 },
    { id: 'P15', code: 'HW-KB', name: 'کیبورد مکانیکال', description: 'مخصوص برنامه‌نویسی', price: 3000000, stock: 25, type: 'product', tax: 9 },
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
                { id: 'R1', userId: auth.entity!.id, title: 'تماس با شرکت آلفا', description: 'پیگیری قرارداد جدید', dueDateTime: daysAhead(1), isCompleted: false, isRead: false, isNotified: false, sourceType: 'manual', createdAt: new Date().toISOString() },
                 { id: 'R2', userId: auth.entity!.id, title: 'ارسال فاکتور بتا', description: '', dueDateTime: daysAgo(1), isCompleted: false, isRead: false, isNotified: true, sourceType: 'manual', createdAt: new Date().toISOString() }
            ]);
            
            // Mock Personnel Data
            setPersonnelRequests([
                { id: 'PR1', userId: 'U2', user: mockUsers[1], managerId: 'U1', type: 'leave_hourly', startDate: new Date().toISOString(), startTime: '08:00', endTime: '10:00', description: 'کار اداری', status: 'pending', createdAt: daysAgo(1) },
                { id: 'PR2', userId: 'U3', user: mockUsers[2], managerId: 'U1', type: 'mission', startDate: daysAhead(2), description: 'جلسه با مشتری', destination: 'اصفهان', status: 'approved', createdAt: daysAgo(2) }
            ]);
        }
    }, [auth]);

  const handleLogin = (type: 'user' | 'customer', username: string, pass: string) => {
    if (pass === '1234') {
        if (type === 'user') {
            const user = users.find(u => u.username === username);
            if (user) {
                // Important: Attach Role Object to User for Permission Checks in UI
                const fullUser: User = {
                    ...user,
                    role: mockRoles.find(r => r.id === user.roleId)
                };
                setAuth({ type: 'user', entity: fullUser });
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
      return <LoginPage onLogin={handleLogin} appName={companyInfo.appName || 'CRM Pro'} />;
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
            users={users}
            setUsers={setUsers}
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
            personnelRequests={personnelRequests}
            setPersonnelRequests={setPersonnelRequests}
            interactions={interactions}
            setInteractions={setInteractions}
            onLogout={handleLogout} 
            noteTemplates={noteTemplates}
            setNoteTemplates={setNoteTemplates}
        />;
};

export default App;
