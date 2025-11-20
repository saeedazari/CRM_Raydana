
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
    authorId?: string; // User ID if author is an agent
    authorType: 'User' | 'Customer';
    text: string;
    isInternal: boolean;
    createdAt: string;
    authorName?: string; // Not in schema, but useful for display
    authorAvatar?: string; // Not in schema, but useful for display
}


export interface Ticket {
  id: string;
  subject: string;
  description?: string;
  customerId: string;
  customer: Customer; // Populated by API
  status: TicketStatus;
  priority: 'حیاتی' | 'بالا' | 'متوسط' | 'کم';
  assigneeId?: string;
  assignee?: User; // Populated by API
  createdAt: string;
  category: 'فنی' | 'مالی' | 'عمومی' | 'پشتیبانی';
  replies?: TicketReply[];
  rating?: number;
  surveySubmitted?: boolean;
  feedbackTags?: string[]; // Stored as comma-separated string in DB
}

export type CustomerType = 'شرکتی' | 'شخصی' | 'کسب و کار';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  name: string; // Replaces companyName
  contacts: Contact[];
  username?: string;
  password?: string;
  email: string;
  phone: string;
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
  portalToken?: string;
  supportEndDate?: string;
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
  assignedToId?: string;
  assignedTo?: User; // Populated by API
  createdAt: string;
  converted?: boolean;
}

export type OpportunityStage = 'شناسایی' | 'واجد شرایط' | 'ارائه پیشنهاد' | 'مذاکره' | 'موفق' | 'ناموفق';

export interface Opportunity {
  id: string;
  name: string;
  customerName: string;
  customerId: string;
  amount: number;
  stage: OpportunityStage;
  closeDate: string;
  assignedToId?: string;
  assignedTo?: User; // Populated by API
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
export type Permission = 
    'view_customers' | 'create_customers' | 'edit_customers' | 'delete_customers' |
    'view_tickets' | 'create_tickets' | 'edit_tickets' | 'delete_tickets' |
    'view_sales' | 'create_sales' | 'edit_sales' | 'delete_sales' |
    'view_reports' |
    'manage_users' | 'manage_roles';


export interface Role {
    id: string;
    name: string;
    permissions: string; // Stored as comma-separated string in DB
}

export interface User {
    id: string;
    name: string;
    username: string;
    roleId: string;
    role?: Role; // Populated by API
    avatar?: string;
    password?: string; // For create/edit forms
}


// Task Types
export type TaskStatus = 'معلق' | 'در حال انجام' | 'در انتظار' | 'تکمیل شده' | 'لغو شده';
export type TaskPriority = 'فوری' | 'بالا' | 'متوسط' | 'پایین';

export interface Task {
    id: string;
    title: string;
    description?: string;
    customer?: Customer; 
    relatedTicketId?: string; 
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
    timestamp: string; // Should be ISO string
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

// FIX: Changed `name` property from `LeadSource` to `string` to make it compatible with recharts' Pie component typings, which expect a more generic data structure.
export interface LeadSourceData {
    name: string;
    value: number;
}

// Customer Interactions
export interface Interaction {
  id: string;
  customerId: string;
  contactId?: string;
  contactName?: string;
  userId: string;
  user: User;
  createdAt: string;
  text: string;
  type: 'یادداشت' | 'تماس' | 'ایمیل' | 'جلسه';
}

// Knowledge Base Types
export interface KnowledgeBaseCategory {
    id: string;
    name: string;
}

export interface KnowledgeBaseArticle {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    categoryName?: string;
    tags: string[];
    authorId: string;
    authorName?: string;
    createdAt: string;
    visibility: 'public' | 'internal'; // public for customers, internal for staff
}

// Reminder Types
export interface Reminder {
    id: string;
    userId: string;
    title: string;
    description?: string;
    dueDateTime: string; // ISO String
    isCompleted: boolean;
    isRead?: boolean; // For notification list status
    isNotified?: boolean; // For toast notification status
    sourceType: 'manual' | 'interaction' | 'chat' | 'task';
    sourceId?: string; // ID of related item
    sourcePreview?: string; // Snippet of text from source
    createdAt: string;
}
