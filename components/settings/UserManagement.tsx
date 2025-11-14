import React, { useState, useMemo, useEffect } from 'react';
import { User, Role } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

interface UserManagementProps {
    users: User[];
    roles: Role[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const initialUserState: Omit<User, 'id' | 'avatar'> = {
    name: '',
    username: '',
    roleId: '',
    password: ''
};

const UserManagement: React.FC<UserManagementProps> = ({ users, roles, setUsers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userFormData, setUserFormData] = useState<Omit<User, 'id' | 'avatar'>>(initialUserState);

    useEffect(() => {
        if (isPanelOpen && editingUser) {
            setUserFormData({
                name: editingUser.name,
                username: editingUser.username,
                roleId: editingUser.roleId,
                password: '',
            });
        } else {
            setUserFormData(initialUserState);
        }
    }, [isPanelOpen, editingUser]);

    const filteredUsers = useMemo(() =>
        users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]
    );

    const rolesMap = useMemo(() =>
        roles.reduce((acc, role) => {
            acc[role.id] = role.name;
            return acc;
        }, {} as Record<string, string>),
    [roles]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!userFormData.roleId) {
            alert('لطفا یک نقش برای کاربر انتخاب کنید.');
            return;
        }

        if (editingUser) {
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...userFormData } : u));
        } else {
            const newUserWithId: User = {
                id: `USER-${Date.now()}`,
                ...userFormData,
                avatar: `https://i.pravatar.cc/40?u=USER-${Date.now()}`
            };
            setUsers(prev => [...prev, newUserWithId]);
        }
        closePanel();
    };

    const openPanel = (user: User | null = null) => {
        setEditingUser(user);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setEditingUser(null);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="جستجوی کاربر..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <button onClick={() => openPanel()} className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>کاربر جدید</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">نام</th>
                            <th scope="col" className="px-4 py-3">نام کاربری</th>
                            <th scope="col" className="px-4 py-3">نقش</th>
                            <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center">
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ml-3" />
                                    {user.name}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs">{user.username}</td>
                                <td className="px-4 py-3">{rolesMap[user.roleId] || 'تعیین نشده'}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <button onClick={() => openPanel(user)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                        <button className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold">{editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</h3>
                        <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow overflow-hidden">
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium">نام کامل</label>
                                <input type="text" name="name" id="name" value={userFormData.name} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium">نام کاربری</label>
                                <input type="text" name="username" id="username" value={userFormData.username} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                             <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">رمز عبور</label>
                                <input type="password" name="password" id="password" value={userFormData.password} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder={editingUser ? 'برای تغییر، وارد کنید' : ''} />
                            </div>
                            <div>
                                <label htmlFor="roleId" className="block mb-2 text-sm font-medium">نقش</label>
                                <select name="roleId" id="roleId" value={userFormData.roleId} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                                    <option value="">یک نقش انتخاب کنید</option>
                                    {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                            <button type="button" onClick={closePanel} className="px-4 py-2 ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ذخیره</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserManagement;