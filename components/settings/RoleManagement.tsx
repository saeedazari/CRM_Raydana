import React from 'react';
import { Role, Permission } from '../../types';

interface RoleManagementProps {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const permissionLabels: Record<Permission, string> = {
    manageUsers: 'مدیریت کاربران',
    manageRoles: 'مدیریت نقش‌ها',
    manageChannels: 'مدیریت گروه‌های چت',
    viewReports: 'مشاهده گزارش‌ها',
    manageTickets: 'مدیریت تیکت‌ها',
    manageSales: 'مدیریت فروش',
};

const allPermissions = Object.keys(permissionLabels) as Permission[];

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, setRoles }) => {

    const handlePermissionChange = (roleId: string, permission: Permission) => {
        setRoles(prevRoles =>
            prevRoles.map(role => {
                if (role.id === roleId) {
                    const newPermissions = role.permissions.includes(permission)
                        ? role.permissions.filter(p => p !== permission)
                        : [...role.permissions, permission];
                    return { ...role, permissions: newPermissions };
                }
                return role;
            })
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">مدیریت نقش‌ها و دسترسی‌ها</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{role.name}</h3>
                        <div className="space-y-3">
                            {allPermissions.map(permission => (
                                <label key={permission} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={role.permissions.includes(permission)}
                                        onChange={() => handlePermissionChange(role.id, permission)}
                                    />
                                    <span className="mr-3 text-sm text-gray-700 dark:text-gray-300">{permissionLabels[permission]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleManagement;
