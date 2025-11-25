
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    ... (Same as before)
*/
import React, { useState } from 'react';
import { User, Role, Customer, CompanyInfo } from '../../types';
import UserManagement from '../settings/UserManagement';
import RoleManagement from '../settings/RoleManagement';
import ChannelManagement from '../settings/ChannelManagement';
import CustomerUserManagement from '../settings/CustomerUserManagement';
import GeneralSettings from '../settings/GeneralSettings';
import SystemLogs from '../settings/SystemLogs'; // Import Logs
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';
import { KeyIcon } from '../icons/KeyIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon'; // Icon for logs

type ActiveTab = 'general' | 'users' | 'customerUsers' | 'roles' | 'channels' | 'logs';

interface SettingsProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    companyInfo: CompanyInfo;
    setCompanyInfo: (info: CompanyInfo) => void;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Settings: React.FC<SettingsProps> = ({ customers, setCustomers, companyInfo, setCompanyInfo, users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('general');
  const [roles, setRoles] = useState<Role[]>([]);

  React.useEffect(() => {
    /* API CALLS */
    const mockRoles: Role[] = [
        { id: 'R1', name: 'مدیر کل', permissions: 'view_customers,create_customers,edit_customers,delete_customers,view_tickets,create_tickets,edit_tickets,delete_tickets,view_sales,create_sales,edit_sales,delete_sales,view_reports,manage_users,manage_roles' },
        { id: 'R2', name: 'کارشناس پشتیبانی', permissions: 'view_customers,view_tickets,create_tickets,edit_tickets' },
        { id: 'R3', name: 'کارشناس فروش', permissions: 'view_customers,create_customers,view_sales,create_sales,edit_sales' },
    ];
    // Users are now passed as props to maintain global state for hierarchy
    setRoles(mockRoles);
  }, []);

  const tabs: { id: ActiveTab; name: string; icon: React.ReactNode }[] = [
    { id: 'general', name: 'تنظیمات عمومی', icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'users', name: 'کاربران داخلی', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'customerUsers', name: 'کاربران مشتری', icon: <KeyIcon className="w-5 h-5" /> },
    { id: 'roles', name: 'نقش‌ها', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'channels', name: 'گروه‌های چت', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
    { id: 'logs', name: 'وقایع سیستم', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />;
      case 'users':
        return <UserManagement users={users} roles={roles} setUsers={setUsers} />;
      case 'customerUsers':
        return <CustomerUserManagement customers={customers} setCustomers={setCustomers} />;
      case 'roles':
        return <RoleManagement roles={roles} setRoles={setRoles} />;
      case 'channels':
        return <ChannelManagement channels={[]} setChannels={() => {}} users={users} />;
      case 'logs':
        return <SystemLogs />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap space-i-8 px-6" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ml-6
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                }`}
            >
              {tab.icon}
              <span className="mr-2">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-grow p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
