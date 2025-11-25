
import React, { useState } from 'react';
import { SearchIcon } from '../icons/SearchIcon';

interface Log {
    id: string;
    user: string;
    action: string;
    entity: string;
    entityId: string;
    details: string;
    date: string;
    ip: string;
}

const generateLogs = (): Log[] => {
    const logs: Log[] = [];
    const users = ['علی رضایی', 'زهرا احمدی', 'محمد کریمی', 'سارا حسابدار', 'سیستم'];
    const actions = ['ایجاد', 'ویرایش', 'حذف', 'ورود', 'خروج', 'پشتیبان‌گیری', 'مشاهده'];
    const entities = ['فاکتور', 'مشتری', 'تیکت', 'وظیفه', 'کاربر', 'دیتابیس', 'گزارش'];
    
    for (let i = 1; i <= 50; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomEntity = entities[Math.floor(Math.random() * entities.length)];
        
        logs.push({
            id: `LOG-${1000 + i}`,
            user: randomUser,
            action: randomAction,
            entity: randomEntity,
            entityId: `${randomEntity.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
            details: `${randomAction} ${randomEntity} توسط ${randomUser}`,
            date: `1403/05/${Math.floor(Math.random() * 30) + 1} ${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59)}`,
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`
        });
    }
    // Sort descending by mock ID (proxy for time)
    return logs.reverse();
};

const mockLogs = generateLogs();

const SystemLogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = mockLogs.filter(log => 
        log.user.includes(searchTerm) || 
        log.action.includes(searchTerm) || 
        log.entity.includes(searchTerm) ||
        log.details.includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold">ثبت وقایع سیستم (Audit Log)</h2>
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="جستجو در وقایع..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border rounded-lg dark:border-gray-700 max-h-[600px]">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th className="px-4 py-3">شناسه</th>
                            <th className="px-4 py-3">کاربر</th>
                            <th className="px-4 py-3">نوع عملیات</th>
                            <th className="px-4 py-3">ماژول</th>
                            <th className="px-4 py-3">جزئیات</th>
                            <th className="px-4 py-3">تاریخ و ساعت</th>
                            <th className="px-4 py-3">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-mono text-xs">{log.id}</td>
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{log.user}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium
                                        ${log.action === 'ایجاد' ? 'bg-green-100 text-green-800' : 
                                          log.action === 'حذف' ? 'bg-red-100 text-red-800' : 
                                          log.action === 'ویرایش' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-gray-200 text-gray-800'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{log.entity} <span className="text-xs text-gray-400">({log.entityId})</span></td>
                                <td className="px-4 py-3">{log.details}</td>
                                <td className="px-4 py-3" dir="ltr">{log.date}</td>
                                <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && <p className="text-center py-8 text-gray-500">موردی یافت نشد.</p>}
            </div>
        </div>
    );
};

export default SystemLogs;
