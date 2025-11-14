import React, { useState } from 'react';
import { User, Role, Customer } from '../../types';
import UserManagement from '../settings/UserManagement';
import RoleManagement from '../settings/RoleManagement';
import ChannelManagement from '../settings/ChannelManagement';
import CustomerUserManagement from '../settings/CustomerUserManagement';
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';
import { KeyIcon } from '../icons/KeyIcon';

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

type ActiveTab = 'users' | 'customerUsers' | 'roles' | 'channels';

interface SettingsProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const Settings: React.FC<SettingsProps> = ({ customers, setCustomers }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  const tabs: { id: ActiveTab; name: string; icon: React.ReactNode }[] = [
    { id: 'users', name: 'مدیریت کاربران داخلی', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'customerUsers', name: 'مدیریت کاربران مشتریان', icon: <KeyIcon className="w-5 h-5" /> },
    { id: 'roles', name: 'نقش‌ها و دسترسی‌ها', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'channels', name: 'مدیریت گروه‌های چت', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement users={users} roles={roles} setUsers={setUsers} />;
      case 'customerUsers':
        return <CustomerUserManagement customers={customers} setCustomers={setCustomers} />;
      case 'roles':
        return <RoleManagement roles={roles} setRoles={setRoles} />;
      case 'channels':
        return <ChannelManagement channels={[]} setChannels={() => {}} users={users} />;
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
              className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
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