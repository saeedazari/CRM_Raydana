import { Permission } from './types';

export interface PermissionItem {
    id: Permission;
    name: string;
}

export interface PermissionModule {
    id: string;
    name: string;
    permissions: PermissionItem[];
}

export const permissionConfig: PermissionModule[] = [
    {
        id: 'customers',
        name: 'مشتریان',
        permissions: [
            { id: 'view_customers', name: 'مشاهده لیست مشتریان' },
            { id: 'create_customers', name: 'ایجاد مشتری جدید' },
            { id: 'edit_customers', name: 'ویرایش اطلاعات مشتری' },
            { id: 'delete_customers', name: 'حذف مشتری' },
        ]
    },
    {
        id: 'tickets',
        name: 'پشتیبانی و تیکت‌ها',
        permissions: [
            { id: 'view_tickets', name: 'مشاهده تیکت‌ها' },
            { id: 'create_tickets', name: 'ثبت تیکت جدید' },
            { id: 'edit_tickets', name: 'پاسخ‌دهی و تغییر وضعیت' },
            { id: 'delete_tickets', name: 'حذف تیکت' },
        ]
    },
    {
        id: 'sales',
        name: 'فروش (سرنخ، فرصت، فاکتور)',
        permissions: [
            { id: 'view_sales', name: 'مشاهده اطلاعات فروش' },
            { id: 'create_sales', name: 'ایجاد (سرنخ، فرصت، فاکتور)' },
            { id: 'edit_sales', name: 'ویرایش و تغییر وضعیت' },
            { id: 'delete_sales', name: 'حذف آیتم‌های فروش' },
        ]
    },
    {
        id: 'personnel',
        name: 'امور پرسنلی',
        permissions: [
            { id: 'view_personnel_requests', name: 'مشاهده درخواست‌ها' },
            { id: 'create_personnel_requests', name: 'ثبت درخواست مرخصی/ماموریت' },
            { id: 'approve_personnel_requests', name: 'مدیریت و تایید درخواست‌ها (مدیر)' },
        ]
    },
    {
        id: 'inventory_purchasing',
        name: 'انبار و تدارکات',
        permissions: [
            { id: 'view_inventory', name: 'مشاهده موجودی انبار' },
            { id: 'create_inventory_txn', name: 'ثبت سند انبار (ورود/خروج)' },
            { id: 'view_vendors', name: 'مشاهده تامین‌کنندگان' },
            { id: 'manage_purchases', name: 'مدیریت سفارشات خرید' },
        ]
    },
    {
        id: 'finance',
        name: 'امور مالی',
        permissions: [
            { id: 'view_finance', name: 'مشاهده پرداخت‌ها و دریافت‌ها' },
            { id: 'create_payment', name: 'ثبت تراکنش مالی' },
        ]
    },
     {
        id: 'reports',
        name: 'گزارشات',
        permissions: [
            { id: 'view_reports', name: 'دسترسی به داشبورد گزارشات' },
        ]
    },
    {
        id: 'settings',
        name: 'تنظیمات سیستم',
        permissions: [
            { id: 'manage_users', name: 'مدیریت کاربران' },
            { id: 'manage_roles', name: 'مدیریت نقش‌ها و دسترسی‌ها' },
        ]
    },
];