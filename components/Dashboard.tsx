import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FunnelStage, SalesData, Ticket, User, Customer } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { TicketsIcon } from './icons/TicketsIcon';
import { SalesIcon } from './icons/SalesIcon';
import { StarIcon } from './icons/StarIcon';

// --- MOCK DATA ---
const mockKpis = {
  totalCustomers: 1254,
  openTickets: 83,
  monthlySales: 150_000_000,
};

const mockSalesData: SalesData[] = [
    { month: 'فروردین', sales: 120 },
    { month: 'اردیبهشت', sales: 180 },
    { month: 'خرداد', sales: 150 },
    { month: 'تیر', sales: 210 },
    { month: 'مرداد', sales: 250 },
    { month: 'شهریور', sales: 220 },
];

const mockFunnelData: FunnelStage[] = [
    { name: 'سرنخ', count: 1200, color: 'bg-blue-500' },
    { name: 'فرصت', count: 750, color: 'bg-cyan-500' },
    { name: 'پیشنهاد', count: 400, color: 'bg-indigo-500' },
    { name: 'موفق', count: 250, color: 'bg-green-500' },
];

const mockSatisfactionData = {
    score: 4.7,
    maxScore: 5,
    totalTickets: 24,
    slaCompliance: 98,
};

// FIX: Removed 'email' property and added 'username' to align with the 'User' type definition.
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2' },
];

// FIX: Added required 'username' property to align with the 'Customer' type definition.
const mockCustomers: Customer[] = [
  { id: 'C1', companyName: 'شرکت آلفا', contactPerson: 'آقای الف', username: 'alpha', email: 'alpha@co.com', phone: '021-123', status: 'فعال' },
  { id: 'C2', companyName: 'تجارت بتا', contactPerson: 'خانم ب', username: 'beta', email: 'beta@co.com', phone: '021-456', status: 'فعال' },
];

const mockTickets: Ticket[] = [
    { id: 'TKT-721', subject: 'مشکل در ورود به پنل کاربری', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[0], assigneeId: 'U1', status: 'در حال بررسی', priority: 'بالا', createdAt: '1403/05/01', category: 'فنی' },
    { id: 'TKT-720', subject: 'سوال در مورد صورتحساب', customer: mockCustomers[1], customerId: 'C2', assignee: mockUsers[1], assigneeId: 'U2', status: 'جدید', priority: 'متوسط', createdAt: '1403/05/01', category: 'مالی' },
    { id: 'TKT-719', subject: 'گزارش باگ در ماژول گزارشات', customer: mockCustomers[0], customerId: 'C1', assignee: mockUsers[0], assigneeId: 'U1', status: 'جدید', priority: 'بالا', createdAt: '1403/04/31', category: 'فنی' },
    { id: 'TKT-718', subject: 'درخواست افزودن ویژگی جدید', customer: mockCustomers[1], customerId: 'C2', status: 'در انتظار مشتری', priority: 'کم', createdAt: '1403/04/30', category: 'عمومی' },
];


// --- KPI Card ---
interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}
const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>نسبت به ماه قبل</span>
          </div>
        )}
      </div>
      <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
    </div>
);

// --- Sales Trend Chart ---
const SalesTrendChart: React.FC = () => {
    const data = mockSalesData;
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="فروش (میلیون تومان)" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Sales Funnel ---
const SalesFunnel: React.FC = () => {
    const data = mockFunnelData;
    const maxCount = Math.max(...data.map(d => d.count));
    return (
        <div className="space-y-4 pt-2">
            {data.map((stage) => (
                <div key={stage.name} className="flex items-center">
                    <div className="w-24 text-sm text-gray-500 dark:text-gray-400 shrink-0">{stage.name}</div>
                    <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-6 mr-2">
                        <div className={`${stage.color || 'bg-indigo-500'} h-6 rounded-full flex items-center justify-end px-2`} style={{ width: `${(stage.count / maxCount) * 100}%` }}>
                            <span className="text-white text-xs font-bold">{stage.count}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Satisfaction Score ---
const SatisfactionScore: React.FC = () => {
    const data = mockSatisfactionData;
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl font-bold text-gray-800 dark:text-gray-100">{data.score.toFixed(1)}<span className="text-3xl text-gray-400">/{data.maxScore}</span></div>
            <div className="flex mt-2">{[...Array(data.maxScore)].map((_, i) => <StarIcon key={i} className={`w-8 h-8 ${i < data.score ? 'text-yellow-400' : 'text-gray-300'}`} />)}</div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">میانگین امتیاز رضایت</p>
            <div className="mt-6 w-full text-center">
                <p className="text-sm"><span className="font-bold">{data.totalTickets}</span> تیکت حل شده امروز</p>
                <p className="text-sm mt-1"><span className="font-bold text-green-500">{data.slaCompliance}%</span> انطباق با SLA</p>
            </div>
        </div>
    );
};

// --- Latest Tickets ---
const LatestTickets: React.FC = () => {
    const tickets = mockTickets;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr><th className="px-4 py-3">شناسه</th><th className="px-4 py-3">موضوع</th><th className="px-4 py-3">مشتری</th><th className="px-4 py-3">کارشناس</th></tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b dark:border-gray-700"><td className="px-4 py-3">{ticket.id}</td><td className="px-4 py-3">{ticket.subject}</td><td className="px-4 py-3">{ticket.customer.companyName}</td><td className="px-4 py-3">{ticket.assignee?.name || '-'}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Dashboard: React.FC<{customers: Customer[]}> = ({customers}) => {
    const kpis = { ...mockKpis, totalCustomers: customers.length};

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* KPI Cards */}
      <div className="md:col-span-1">
        <KpiCard title="کل مشتریان" value={kpis.totalCustomers.toLocaleString('fa-IR')} icon={<UsersIcon className="w-8 h-8 text-blue-500" />} />
      </div>
      <div className="md:col-span-1">
        <KpiCard title="تیکت‌های باز" value={kpis.openTickets.toLocaleString('fa-IR')} icon={<TicketsIcon className="w-8 h-8 text-green-500" />} />
      </div>
      <div className="md:col-span-2">
        <KpiCard title="فروش ماه جاری" value={`${kpis.monthlySales.toLocaleString('fa-IR')} تومان`} icon={<SalesIcon className="w-8 h-8 text-indigo-500" />} />
      </div>

      {/* Sales Trend Row */}
      <div className="md:col-span-4 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">نمودار روند فروش</h2>
        <SalesTrendChart />
      </div>
      
      {/* Sales Funnel */}
      <div className="md:col-span-4 lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">قیف فروش</h2>
        <SalesFunnel />
      </div>

      {/* Latest Tickets */}
      <div className="md:col-span-4 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">آخرین تیکت‌ها</h2>
          <LatestTickets />
      </div>

      {/* Satisfaction Score */}
      <div className="md:col-span-4 lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">رضایت مشتری</h2>
          <SatisfactionScore />
      </div>

    </div>
  );
};

export default Dashboard;