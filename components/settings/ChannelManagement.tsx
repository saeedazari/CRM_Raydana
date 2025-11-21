import React, { useState } from 'react';
import { ChatChannel, User } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface ChannelManagementProps {
    channels: ChatChannel[];
    setChannels: React.Dispatch<React.SetStateAction<ChatChannel[]>>;
    users: User[];
}

const initialNewChannelState: Omit<ChatChannel, 'id' | 'members'> = {
    name: '',
    description: '',
};

const ChannelManagement: React.FC<ChannelManagementProps> = ({ channels, setChannels, users }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<ChatChannel | null>(null);
    const [newChannel, setNewChannel] = useState(initialNewChannelState);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    const usersMap = React.useMemo(() => 
        users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {} as Record<string, User>), 
    [users]);

    const handleAddChannel = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            // Update existing channel
            setChannels(prev => prev.map(ch => ch.id === isEditing.id ? { ...isEditing, name: newChannel.name, description: newChannel.description, members: selectedMembers } : ch));
        } else {
            // Add new channel
            const newChannelWithId: ChatChannel = {
                id: `C-${Date.now()}`,
                ...newChannel,
                members: selectedMembers
            };
            setChannels(prev => [...prev, newChannelWithId]);
        }
        closePanel();
    };

    const openPanel = (channel: ChatChannel | null = null) => {
        if (channel) {
            setIsEditing(channel);
            setNewChannel({ name: channel.name, description: channel.description });
            setSelectedMembers(channel.members);
        } else {
            setIsEditing(null);
            setNewChannel(initialNewChannelState);
            setSelectedMembers([]);
        }
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setIsEditing(null);
    };

    const handleMemberToggle = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">مدیریت گروه‌های چت</h2>
                <button onClick={() => openPanel()} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>گروه جدید</span>
                </button>
            </div>
            <div className="space-y-4">
                {channels.map(channel => (
                    <div key={channel.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex justify-between items-center border dark:border-gray-700">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200"># {channel.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{channel.description}</p>
                            <div className="flex -space-x-2 overflow-hidden mt-2">
                                {channel.members.slice(0, 5).map(userId => usersMap[userId] && (
                                     <img key={userId} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800" src={usersMap[userId].avatar} alt={usersMap[userId].name} title={usersMap[userId].name}/>
                                ))}
                                {channel.members.length > 5 && (
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                                        +{channel.members.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => openPanel(channel)} className="p-2 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                            <button className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Side Panel (Drawer) */}
            <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-md shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{isEditing ? 'ویرایش گروه' : 'ایجاد گروه جدید'}</h3>
                        <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddChannel} className="flex flex-col flex-grow overflow-hidden">
                        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">نام گروه</label>
                                <input type="text" name="name" id="name" value={newChannel.name} onChange={(e) => setNewChannel({...newChannel, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">توضیحات</label>
                                <input type="text" name="description" id="description" value={newChannel.description} onChange={(e) => setNewChannel({...newChannel, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <h4 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">افزودن اعضا</h4>
                                <div className="max-h-64 overflow-y-auto border dark:border-gray-600 rounded-lg p-2 space-y-2">
                                    {users.map(user => (
                                        <label key={user.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectedMembers.includes(user.id)}
                                                onChange={() => handleMemberToggle(user.id)}
                                            />
                                            <img src={user.avatar} className="w-8 h-8 rounded-full mr-3 ml-2" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700">
                            <button type="button" onClick={closePanel} className="px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ذخیره</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChannelManagement;