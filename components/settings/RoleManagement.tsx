import React, { useState } from 'react';
import { Role, Permission } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { ChevronUpIcon } from '../icons/ChevronUpIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { permissionConfig, PermissionModule } from '../../permissions';

interface RoleManagementProps {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
    <div 
        onClick={onChange} 
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
            checked 
            ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' 
            : 'bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
        }`}
    >
        <span className={`text-sm font-medium ${checked ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
            {label}
        </span>
        {/* Force LTR for the toggle graphic to ensure correct sliding direction */}
        <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`} dir="ltr">
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </div>
    </div>
);

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, setRoles }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState<Set<Permission>>(new Set());
    const [expandedModules, setExpandedModules] = useState<string[]>(['customers']); // Default open first one

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
        );
    };

    const handlePermissionChange = (roleId: string, permission: Permission) => {
        const updatedRoles = roles.map(role => {
            if (role.id === roleId) {
                const currentPermissions = new Set(role.permissions ? (role.permissions.split(',') as Permission[]) : []);
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

    const handleToggleAllModule = (module: PermissionModule, roleId: string | null, currentPermissions: Set<Permission>, isNewRole: boolean) => {
        const modulePermissionIds = module.permissions.map(p => p.id);
        const allSelected = modulePermissionIds.every(id => currentPermissions.has(id));

        if (isNewRole) {
            setNewRolePermissions(prev => {
                const newSet = new Set(prev);
                modulePermissionIds.forEach(id => {
                    if (allSelected) newSet.delete(id);
                    else newSet.add(id);
                });
                return newSet;
            });
        } else if (roleId) {
            const updatedRoles = roles.map(role => {
                if (role.id === roleId) {
                    const rolePerms = new Set(role.permissions ? (role.permissions.split(',') as Permission[]) : []);
                    modulePermissionIds.forEach(id => {
                        if (allSelected) rolePerms.delete(id);
                        else rolePerms.add(id);
                    });
                    return { ...role, permissions: Array.from(rolePerms).join(',') };
                }
                return role;
            });
            setRoles(updatedRoles);
        }
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

    const renderPermissions = (roleId: string | null, currentPermissions: Set<Permission>, isNewRole: boolean = false) => {
        return (
             <div className="space-y-4">
                {permissionConfig.map((module: PermissionModule) => {
                    const isExpanded = expandedModules.includes(module.id);
                    const modulePermissionIds = module.permissions.map(p => p.id);
                    const selectedCount = modulePermissionIds.filter(id => currentPermissions.has(id)).length;
                    const isAllSelected = selectedCount === modulePermissionIds.length;

                    return (
                        <div key={module.id} className="border rounded-lg dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                            <div 
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleAllModule(module, roleId, currentPermissions, isNewRole);
                                        }}
                                        className={`p-1 rounded transition-colors ${isAllSelected ? 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
                                        title={isAllSelected ? "لغو انتخاب همه" : "انتخاب همه"}
                                    >
                                        <CheckBadgeIcon className="w-6 h-6" />
                                    </button>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{module.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{selectedCount} از {module.permissions.length} مجوز انتخاب شده</p>
                                    </div>
                                </div>
                                {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-gray-500"/> : <ChevronDownIcon className="w-5 h-5 text-gray-500"/>}
                            </div>
                            
                            {isExpanded && (
                                <div className="p-4 bg-white dark:bg-gray-800 animate-fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {module.permissions.map(p => (
                                            <ToggleSwitch
                                                key={p.id}
                                                label={p.name}
                                                checked={currentPermissions.has(p.id)}
                                                onChange={() => {
                                                    if (isNewRole) handleNewRolePermissionToggle(p.id);
                                                    else if (roleId) handlePermissionChange(roleId, p.id);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
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
            <div className="space-y-8">
                {roles.map(role => {
                    const currentPermissions = new Set(role.permissions ? (role.permissions.split(',') as Permission[]) : []);
                    return (
                        <div key={role.id} className="bg-white dark:bg-gray-900/30 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                    {role.name.charAt(0)}
                                </span>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{role.name}</h3>
                                <span className="mr-auto text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-3 py-1 rounded-full">
                                    {role.id}
                                </span>
                            </div>
                            {renderPermissions(role.id, currentPermissions, false)}
                        </div>
                    );
                })}
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
                                <input type="text" id="roleName" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="مثلا: حسابدار ارشد" required />
                            </div>
                            <div>
                                <label className="block mb-4 text-sm font-medium">تنظیم دسترسی‌ها</label>
                                {renderPermissions(null, newRolePermissions, true)}
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                            <button type="button" onClick={closePanel} className="px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">انصراف</button>
                            <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none">ایجاد نقش</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RoleManagement;