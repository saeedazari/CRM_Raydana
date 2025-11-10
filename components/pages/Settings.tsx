import React, { useState } from 'react';
import { User, Role, ChatChannel } from '../../types';
import UserManagement from '../settings/UserManagement';
import RoleManagement from '../settings/RoleManagement';
import ChannelManagement from '../settings/ChannelManagement';
import { UsersIcon } from '../icons/UsersIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

interface SettingsProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    channels: ChatChannel[];
    setChannels: React.Dispatch<React.SetStateAction<ChatChannel[]>>;
}

type ActiveTab = 'users' | 'roles' | 'channels';

const Settings: React.FC<SettingsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');

  const tabs: { id: ActiveTab; name: string; icon: React.ReactNode }[] = [
    { id: 'users', name: 'مدیریت کاربران', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'roles', name: 'نقش‌ها و دسترسی‌ها', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'channels', name: 'مدیریت گروه‌های چت', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement users={props.users} roles={props.roles} setUsers={props.setUsers} />;
      case 'roles':
        return <RoleManagement roles={props.roles} setRoles={props.setRoles} />;
      case 'channels':
        return <ChannelManagement channels={props.channels} setChannels={props.setChannels} users={props.users} />;
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
