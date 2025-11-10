import React from 'react';
import { Ticket, TicketStatus } from '../types';

const tickets: Ticket[] = [
  { id: 'TKT-00123', subject: 'مشکل در ورود به سیستم', customer: 'شرکت ABC', status: 'در حال بررسی', priority: 'بالا', assignee: 'علی رضایی', date: '۱۴۰۳/۰۸/۱۵', category: 'فنی' },
  // FIX: Changed status from 'باز' (Open) to 'جدید' (New) to match the defined TicketStatus type.
  { id: 'TKT-00122', subject: 'درخواست فیچر جدید', customer: 'شرکت XYZ', status: 'جدید', priority: 'متوسط', assignee: 'مریم احمدی', date: '۱۴۰۳/۰۸/۱۴', category: 'عمومی' },
  { id: 'TKT-00121', subject: 'سوال در مورد صورتحساب', customer: 'فناوران پیشرو', status: 'بسته شده', priority: 'متوسط', assignee: 'علی رضایی', date: '۱۴۰۳/۰۸/۱۴', category: 'مالی' },
  { id: 'TKT-00120', subject: 'گزارش باگ در داشبورد', customer: 'داده پردازان', status: 'در حال بررسی', priority: 'حیاتی', assignee: 'زهرا محمدی', date: '۱۴۰۳/۰۸/۱۳', category: 'پشتیبانی' },
  { id: 'TKT-00119', subject: 'عدم ارسال نوتیفیکیشن', customer: 'صنایع نوین', status: 'بسته شده', priority: 'بالا', assignee: 'مریم احمدی', date: '۱۴۰۳/۰۸/۱۲', category: 'فنی' },
];

// FIX: Replaced invalid key 'باز' with 'جدید' and added all possible statuses from TicketStatus to ensure type safety and prevent runtime errors.
const statusColors: { [key in TicketStatus]: string } = {
  'جدید': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'در حال بررسی': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'بسته شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'در انتظار مشتری': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'حل شده': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'بازگشایی شده': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

const priorityColors: { [key in Ticket['priority']]: string } = {
    'حیاتی': 'border-red-500',
    'بالا': 'border-orange-500',
    'متوسط': 'border-yellow-500',
    'کم': 'border-gray-400',
};

const LatestTickets: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3">شناسه</th>
            <th scope="col" className="px-4 py-3">موضوع</th>
            <th scope="col" className="px-4 py-3">مشتری</th>
            <th scope="col" className="px-4 py-3">وضعیت</th>
            <th scope="col" className="px-4 py-3">کارشناس</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className={`px-4 py-3 font-medium text-gray-900 dark:text-white border-r-4 ${priorityColors[ticket.priority]}`}>
                {ticket.id}
              </td>
              <td className="px-4 py-3">{ticket.subject}</td>
              <td className="px-4 py-3">{ticket.customer}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-3">{ticket.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTickets;