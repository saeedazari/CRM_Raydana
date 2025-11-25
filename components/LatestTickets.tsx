
import React from 'react';
import { Ticket } from '../types';
import { toPersianDigits } from '../utils/date';

const mockTickets: Partial<Ticket>[] = [
    { id: 'TKT-721', subject: 'مشکل در ورود', status: 'در حال بررسی', createdAt: '1403/05/01', customer: { name: 'شرکت آلفا' } as any },
    { id: 'TKT-720', subject: 'سوال مالی', status: 'جدید', createdAt: '1403/05/01', customer: { name: 'تجارت بتا' } as any },
    { id: 'TKT-719', subject: 'گزارش باگ', status: 'حل شده', createdAt: '1403/04/31', customer: { name: 'شرکت آلفا' } as any },
];

const statusColors: { [key: string]: string } = {
  'جدید': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'در حال بررسی': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'حل شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'بسته شده': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const LatestTickets: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 uppercase">
            <tr>
                <th className="px-3 py-2">موضوع</th>
                <th className="px-3 py-2">مشتری</th>
                <th className="px-3 py-2">وضعیت</th>
                <th className="px-3 py-2">تاریخ</th>
            </tr>
        </thead>
        <tbody>
            {mockTickets.map((ticket, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{ticket.subject}</td>
                    <td className="px-3 py-3 text-gray-900 dark:text-white">{ticket.customer?.name}</td>
                    <td className="px-3 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                            {ticket.status}
                        </span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 text-xs">{toPersianDigits(ticket.createdAt)}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTickets;
