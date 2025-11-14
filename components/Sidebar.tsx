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

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string, params?: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', icon: <DashboardIcon className="w-6 h-6" />, name: 'داشبورد' },
    { id: 'customers', icon: <CustomersIcon className="w-6 h-6" />, name: 'مشتریان' },
    { id: 'tickets', icon: <TicketsIcon className="w-6 h-6" />, name: 'تیکت‌ها' },
    { id: 'tasks', icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />, name: 'مدیریت وظایف' },
    { isHeader: true, name: 'فروش' },
    { id: 'opportunities', icon: <SalesIcon className="w-6 h-6" />, name: 'فرصت‌ها' },
    { id: 'leads', icon: <LightBulbIcon className="w-6 h-6" />, name: 'سرنخ‌ها' },
    { id: 'quotes', icon: <DocumentDuplicateIcon className="w-6 h-6" />, name: 'پیش‌فاکتورها' },
    { id: 'invoices', icon: <CreditCardIcon className="w-6 h-6" />, name: 'فاکتورها' },
    { id: 'products', icon: <CubeIcon className="w-6 h-6" />, name: 'کالاها و خدمات' },
    { isHeader: true, name: 'ابزارها' },
    { id: 'knowledgeBase', icon: <AcademicCapIcon className="w-6 h-6" />, name: 'پایگاه دانش' },
    { id: 'chat', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, name: 'چت تیمی' },
    { id: 'reports', icon: <ReportsIcon className="w-6 h-6" />, name: 'گزارش‌ها' },
    { id: 'settings', icon: <SettingsIcon className="w-6 h-6" />, name: 'تنظیمات' },
  ];

  const handleNavigation = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false); // Close sidebar on navigation
  };

  return (
    <aside className={`w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col
      fixed inset-y-0 right-0 z-40 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
      <div className="h-16 flex items-center justify-between px-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700">
        <span>CRM Pro</span>
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {menuItems.map((item, index) => {
             if ('isHeader' in item && item.isHeader) {
                return (
                    <li key={`header-${index}`} className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.name}
                    </li>
                );
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500">© 2024 CRM Pro</p>
      </div>
    </aside>
  );
};

export default Sidebar;