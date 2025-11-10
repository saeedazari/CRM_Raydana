export interface SalesData {
  month: string;
  sales: number;
}

export interface FunnelStage {
  name: string;
  count: number;
  color: string;
}

export type TicketStatus = 'جدید' | 'در حال بررسی' | 'بسته شده' | 'در انتظار مشتری' | 'حل شده' | 'بازگشایی شده';

export interface TicketReply {
    id: string;
    author: string;
    authorId?: string; // User ID if author is an agent
    text: string;
    timestamp: string;
    isInternal: boolean;
    authorAvatar?: string;
}


export interface Ticket {
  id: string;
  subject: string;
  description?: string;
  customer: string;
  status: TicketStatus;
  priority: 'حیاتی' | 'بالا' | 'متوسط' | 'کم';
  assignee: string;
  date: string;
  category: 'فنی' | 'مالی' | 'عمومی' | 'پشتیبانی';
  history?: TicketReply[];
  rating?: number;
  surveySubmitted?: boolean;
  feedbackTags?: string[];
}

export type CustomerType = 'شرکتی' | 'شخصی' | 'کسب و کار';

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  accountManager: string;
  status: 'فعال' | 'غیرفعال' | 'معلق';
  mobile?: string;
  city?: string;
  province?: string;
  fullAddress?: string;
  postalCode?: string;
  website?: string;
  customerType?: CustomerType;
  industry?: string;
  internalNotes?: string;
}

export type LeadStatus = 'جدید' | 'تماس گرفته شده' | 'واجد شرایط' | 'تبدیل شده' | 'از دست رفته';
export type LeadSource = 'وبسایت' | 'ارجاعی' | 'تماس سرد' | 'شبکه اجتماعی';

export interface Lead {
  id: string;
  companyName?: string;
  contactName: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  assignedTo: string;
  createdAt: string;
  converted?: boolean;
}

export type OpportunityStage = 'شناسایی' | 'واجد شرایط' | 'ارائه پیشنهاد' | 'مذاکره' | 'موفق' | 'ناموفق';

export interface Opportunity {
  id: string;
  name: string;
  customerName: string;
  amount: number;
  stage: OpportunityStage;
  closeDate: string;
  assignedTo: string;
}

// Sales Module Expansion
export interface Product {
    id: string;
    code?: string;
    name: string;
    description?: string;
    price: number;
}

export type QuoteStatus = 'پیش‌نویس' | 'ارسال شده' | 'تایید شده' | 'رد شده';
export interface QuoteItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number; // Percentage
    tax: number; // Percentage
    total: number;
}
export interface Quote {
    id: string;
    customerId: string;
    customerName: string;
    issueDate: string;
    expiryDate: string;
    status: QuoteStatus;
    items: QuoteItem[];
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
}

export type InvoiceStatus = 'پیش‌نویس' | 'ارسال شده' | 'پرداخت شده' | 'سررسید گذشته';
export interface InvoiceItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number; // Percentage
    tax: number; // Percentage
    total: number;
}
export interface Invoice {
    id: string;
    quoteId?: string;
    customerId: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    items: InvoiceItem[];
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
}


// Settings & User Management Types
export type Permission = 'manageUsers' | 'manageRoles' | 'manageChannels' | 'viewReports' | 'manageTickets' | 'manageSales';

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    avatar?: string;
}


// Task Types
export type TaskStatus = 'معلق' | 'در حال انجام' | 'در انتظار' | 'تکمیل شده' | 'لغو شده';
export type TaskPriority = 'فوری' | 'بالا' | 'متوسط' | 'پایین';

export interface Task {
    id: string;
    title: string;
    description?: string;
    customer?: string; // Related customer name
    relatedTicketId?: string; // Link to the ticket it was created from
    assignedTo: User;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    createdAt: string;
}

// Chat Types
export interface ChatMessage {
    id: string;
    user: User;
    text: string;
    timestamp: string;
    thread?: ChatMessage[];
}

export interface ChatChannel {
    id: string;
    name: string;
    description?: string;
    members: string[]; // Array of User IDs
}


// Report Types
export interface TicketPerformanceData {
  category: string;
  'میانگین اولین پاسخ (ساعت)': number;
  'میانگین زمان حل (ساعت)': number;
}

export interface SalesGoalData {
  name: string;
  value: number;
  fill: string;
}

export interface LeadSourceData {
    name: LeadSource;
    value: number;
}