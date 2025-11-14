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
            { id: 'view_customers', name: 'مشاهده' },
            { id: 'create_customers', name: 'ایجاد' },
            { id: 'edit_customers', name: 'ویرایش' },
            { id: 'delete_customers', name: 'حذف' },
        ]
    },
    {
        id: 'tickets',
        name: 'تیکت‌ها',
        permissions: [
            { id: 'view_tickets', name: 'مشاهده' },
            { id: 'create_tickets', name: 'ایجاد' },
            { id: 'edit_tickets', name: 'پاسخ و ویرایش' },
            { id: 'delete_tickets', name: 'حذف' },
        ]
    },
    {
        id: 'sales',
        name: 'فروش (سرنخ، فرصت، فاکتور)',
        permissions: [
            { id: 'view_sales', name: 'مشاهده' },
            { id: 'create_sales', name: 'ایجاد' },
            { id: 'edit_sales', name: 'ویرایش' },
            { id: 'delete_sales', name: 'حذف' },
        ]
    },
     {
        id: 'reports',
        name: 'گزارش‌ها',
        permissions: [
            { id: 'view_reports', name: 'مشاهده گزارش‌ها' },
        ]
    },
    {
        id: 'settings',
        name: 'تنظیمات',
        permissions: [
            { id: 'manage_users', name: 'مدیریت کاربران' },
            { id: 'manage_roles', name: 'مدیریت نقش‌ها' },
        ]
    },
];
