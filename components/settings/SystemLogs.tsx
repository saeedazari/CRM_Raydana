
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

const mockLogs: Log[] = [
    { id: 'LOG-1', user: 'علی رضایی', action: 'ایجاد', entity: 'فاکتور', entityId: 'INV-172234', details: 'ایجاد فاکتور جدید برای شرکت آلفا', date: '1403/05/02 14:30', ip: '192.168.1.5' },
    { id: 'LOG-2', user: 'زهرا احمدی', action: 'ویرایش', entity: 'مشتری', entityId: 'C-1', details: 'تغییر شماره تلفن شرکت آلفا', date: '1403/05/02 12:15', ip: '192.168.1.8' },
    { id: 'LOG-3', user: 'علی رضایی', action: 'حذف', entity: 'وظیفه', entityId: 'TSK-99', details: 'حذف وظیفه تکراری', date: '1403/05/01 09:00', ip: '192.168.1.5' },
    { id: 'LOG-4', user: 'سیستم', action: 'پشتیبان‌گیری', entity: 'دیتابیس', entityId: '-', details: 'پشتیبان‌گیری خودکار روزانه', date: '1403/05/01 02:00', ip: 'localhost' },
    { id: 'LOG-5', user: 'محمد کریمی', action: 'ورود', entity: 'Auth', entityId: '-', details: 'ورود موفق به سیستم', date: '1403/04/31 08:05', ip: '192.168.1.12' },
];

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

            <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
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
