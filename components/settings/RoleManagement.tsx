import React, { useState } from 'react';
import { Role, Permission } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { permissionConfig, PermissionModule } from '../../permissions';

interface RoleManagementProps {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, setRoles }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState<Set<Permission>>(new Set());

    const handlePermissionChange = (roleId: string, permission: Permission) => {
        const updatedRoles = roles.map(role => {
            if (role.id === roleId) {
                const currentPermissions = new Set(role.permissions ? (role.permissions.split(',') as Permission[]).map(p => p.trim() as Permission) : []);
                if (currentPermissions.has(permission)) {
                    currentPermissions.delete(permission);
                } else {
                    currentPermissions.add(permission);
                }
                return { ...role, permissions: Array.from(currentPermissions).join(',') };
            }
            return role;
        });
        setRoles(updatedRoles);
    };
    
    const handleNewRolePermissionToggle = (permission: Permission) => {
        setNewRolePermissions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(permission)) {
                newSet.delete(permission);
            } else {
                newSet.add(permission);
            }
            return newSet;
        });
    };
    
    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoleName.trim() === '') {
            alert('نام نقش نمی‌تواند خالی باشد.');
            return;
        }
        const newRole: Role = {
            id: `R-${Date.now()}`,
            name: newRoleName,
            permissions: Array.from(newRolePermissions).join(',')
        };
        setRoles(prev => [...prev, newRole]);
        closePanel();
    };

    const openPanel = () => {
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setNewRoleName('');
        setNewRolePermissions(new Set());
    };

    const renderPermissionGroup = (role: Role) => {
        const currentPermissions = new Set(role.permissions ? (role.permissions.split(',') as Permission[]).map(p => p.trim() as Permission) : []);
        return (
             <div className="space-y-4">
                {permissionConfig.map((module: PermissionModule) => (
                    <div key={module.id} className="p-4 border rounded-lg dark:border-gray-600">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">{module.name}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {module.permissions.map(p => (
                                <label key={p.id} className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={currentPermissions.has(p.id)}
                                        onChange={() => handlePermissionChange(role.id, p.id)}
                                    />
                                    <span className="mr-2 text-gray-700 dark:text-gray-300">{p.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    const renderNewRolePermissionGroup = () => {
        return (
             <div className="space-y-4">
                {permissionConfig.map((module: PermissionModule) => (
                    <div key={module.id} className="p-4 border rounded-lg dark:border-gray-600">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">{module.name}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                            {module.permissions.map(p => (
                                <label key={p.id} className="flex items-center text-sm p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={newRolePermissions.has(p.id)}
                                        onChange={() => handleNewRolePermissionToggle(p.id)}
                                    />
                                    <span className="mr-2 text-gray-700 dark:text-gray-300">{p.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">مدیریت نقش‌ها و دسترسی‌ها</h2>
                 <button onClick={openPanel} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>نقش جدید</span>
                </button>
            </div>
            <div className="space-y-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{role.name}</h3>
                        {renderPermissionGroup(role)}
                    </div>
                ))}
            </div>
            
             <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-2xl shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                     <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold">ایجاد نقش جدید</h3>
                        <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleCreateRole} className="flex flex-col flex-grow overflow-hidden">
                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div>
                                <label htmlFor="roleName" className="block mb-2 text-sm font-medium">نام نقش</label>
                                <input type="text" id="roleName" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <h4 className="block mb-2 text-sm font-medium">دسترسی‌ها</h4>
                                {renderNewRolePermissionGroup()}
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                            <button type="button" onClick={closePanel} className="px-4 py-2 ml-3 text-sm font-medium">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg">ایجاد نقش</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RoleManagement;