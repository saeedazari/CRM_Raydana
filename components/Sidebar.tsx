


import React from 'react';
import { DashboardIcon } from './icons/DashboardIcon';
import { CustomersIcon } from './icons/CustomersIcon';
import { TicketsIcon } from './icons/TicketsIcon';
import { SalesIcon } from './icons/SalesIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { CubeIcon } from './icons/CubeIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ArchiveBoxIcon } from './icons/ArchiveBoxIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { User } from '../types';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string, params?: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen, user }) => {
  
  const hasPermission = (permission: string) => {
      if (!permission) return true;
      if (!user.role || !user.role.permissions) return false;
      const perms = user.role.permissions.split(',');
      return perms.includes(permission);
  };

  const menuItems = [
    { id: 'dashboard', icon: <DashboardIcon className="w-6 h-6" />, name: 'داشبورد', permission: '' },
    { id: 'calendar', icon: <CalendarIcon className="w-6 h-6" />, name: 'تقویم کاری', permission: '' },
    { id: 'customers', icon: <CustomersIcon className="w-6 h-6" />, name: 'مشتریان', permission: 'view_customers' },
    { id: 'tickets', icon: <TicketsIcon className="w-6 h-6" />, name: 'تیکت‌ها', permission: 'view_tickets' },
    { id: 'tasks', icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />, name: 'مدیریت وظایف', permission: '' },
    { id: 'reminders', icon: <ClockIcon className="w-6 h-6" />, name: 'یادآورها', permission: '' },
    
    { isHeader: true, name: 'فروش', permission: 'view_sales' },
    { id: 'opportunities', icon: <SalesIcon className="w-6 h-6" />, name: 'فرصت‌ها', permission: 'view_sales' },
    { id: 'leads', icon: <LightBulbIcon className="w-6 h-6" />, name: 'سرنخ‌ها', permission: 'view_sales' },
    { id: 'quotes', icon: <DocumentDuplicateIcon className="w-6 h-6" />, name: 'پیش‌فاکتورها', permission: 'view_sales' },
    { id: 'invoices', icon: <CreditCardIcon className="w-6 h-6" />, name: 'فاکتورها', permission: 'view_invoices' }, // Can be view_sales or view_invoices if specific
    { id: 'products', icon: <CubeIcon className="w-6 h-6" />, name: 'کالاها و خدمات', permission: 'view_sales' },
    
    { isHeader: true, name: 'منابع انسانی', permission: 'view_personnel_requests' },
    { id: 'personnel', icon: <BriefcaseIcon className="w-6 h-6" />, name: 'امور پرسنلی', permission: 'view_personnel_requests' },

    { isHeader: true, name: 'انبار و تدارکات', permission: 'view_inventory' },
    { id: 'inventory', icon: <ArchiveBoxIcon className="w-6 h-6" />, name: 'انبار (موجودی)', permission: 'view_inventory' },
    { id: 'vendors', icon: <BuildingStorefrontIcon className="w-6 h-6" />, name: 'تامین‌کنندگان', permission: 'view_vendors' },
    { id: 'purchaseOrders', icon: <ShoppingBagIcon className="w-6 h-6" />, name: 'فاکتورهای خرید', permission: 'manage_purchases' },
    
    { isHeader: true, name: 'امور مالی', permission: 'view_finance' },
    { id: 'payments', icon: <BanknotesIcon className="w-6 h-6" />, name: 'دریافت و پرداخت', permission: 'view_finance' },


    { isHeader: true, name: 'ابزارها', permission: '' },
    { id: 'knowledgeBase', icon: <AcademicCapIcon className="w-6 h-6" />, name: 'پایگاه دانش', permission: '' },
    { id: 'chat', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, name: 'چت تیمی', permission: '' },
    { id: 'reports', icon: <ReportsIcon className="w-6 h-6" />, name: 'گزارش‌ها', permission: 'view_reports' },
    { id: 'settings', icon: <SettingsIcon className="w-6 h-6" />, name: 'تنظیمات', permission: 'manage_users' }, // Assuming manage_users implies admin/settings access
  ];

  const handleNavigation = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false); // Close sidebar on navigation
  };

  // Filter items based on permissions
  const filteredItems = menuItems.filter(item => {
      // Special case for invoices: allow if 'view_sales' OR 'view_invoices'
      if ('id' in item && item.id === 'invoices') {
          return hasPermission('view_sales') || hasPermission('view_invoices');
      }
      return hasPermission(item.permission);
  });

  return (
    <aside className={`w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col
      fixed inset-y-0 right-0 z-40 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
      <div className="h-16 flex items-center justify-between px-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <span>CRM Pro</span>
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul>
          {filteredItems.map((item, index) => {
             if ('isHeader' in item && item.isHeader) {
                // Check if there are any visible children for this header
                // Logic: Look ahead in the filtered list. If the next item(s) are not headers, show this header.
                const nextItem = filteredItems[index + 1];
                if (nextItem && !('isHeader' in nextItem)) {
                    return (
                        <li key={`header-${index}`} className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {item.name}
                        </li>
                    );
                }
                return null;
            }
            if('id' in item){
                return (
                    <li key={item.id} className="mb-2">
                    <a
                        href="#"
                        onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.id);
                        }}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        item.id === activePage
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {item.icon}
                        <span className="mr-4 font-medium">{item.name}</span>
                    </a>
                    </li>
                )
            }
            return null;
        })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <p className="text-xs text-center text-gray-500">© 2024 CRM Pro</p>
      </div>
    </aside>
  );
};

export default Sidebar;