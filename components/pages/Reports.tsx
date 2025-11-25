


import React, { useState } from 'react';
import ReportCard from '../reports/ReportCard';
import TicketPerformanceChart from '../reports/TicketPerformanceChart';
import SalesVsGoalChart from '../reports/SalesVsGoalChart';
import LeadSourceChart from '../reports/LeadSourceChart';
import FinancialChart from '../reports/FinancialChart';
import TopProductsChart from '../reports/TopProductsChart';
import InventorySummaryChart from '../reports/InventorySummaryChart';
import UserActivityReport from '../reports/UserActivityReport';
import { StarIcon } from '../icons/StarIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { SalesIcon } from '../icons/SalesIcon';
import { TicketsIcon } from '../icons/TicketsIcon';
import { BanknotesIcon } from '../icons/BanknotesIcon';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';
import { ShoppingBagIcon } from '../icons/ShoppingBagIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { Interaction, Ticket, User } from '../../types';

type ReportTab = 'sales_finance' | 'support' | 'inventory_purchase' | 'user_activity';

interface ReportsProps {
    users?: User[];
    interactions?: Interaction[];
    tickets?: Ticket[];
}

const Reports: React.FC<ReportsProps> = ({ users = [], interactions = [], tickets = [] }) => {
    const [activeTab, setActiveTab] = useState<ReportTab>('sales_finance');

    const tabs: { id: ReportTab; name: string; icon: React.ReactNode }[] = [
        { id: 'sales_finance', name: 'فروش و مالی', icon: <BanknotesIcon className="w-5 h-5" /> },
        { id: 'support', name: 'پشتیبانی', icon: <TicketsIcon className="w-5 h-5" /> },
        { id: 'inventory_purchase', name: 'انبار و تدارکات', icon: <ArchiveBoxIcon className="w-5 h-5" /> },
        { id: 'user_activity', name: 'فعالیت کاربران', icon: <UserGroupIcon className="w-5 h-5" /> },
    ];

    const renderSalesFinance = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
             <ReportCard title="خلاصه عملکرد فروش" icon={<SalesIcon className="w-6 h-6" />}>
                <div className="space-y-4 text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-indigo-500">
                            <ClipboardDocumentListIcon className="w-7 h-7" />
                            <span className="text-3xl font-bold mr-2">15</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">معامله موفق در این ماه</p>
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">25%</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">نرخ تبدیل سرنخ به فرصت</p>
                    </div>
                </div>
            </ReportCard>

            <div className="xl:col-span-2 md:col-span-2">
                <ReportCard title="تحلیل درآمد و هزینه" icon={<BanknotesIcon className="w-6 h-6" />}>
                    <FinancialChart />
                </ReportCard>
            </div>

            <div className="xl:col-span-1 md:col-span-1">
                <ReportCard title="عملکرد فروش در برابر هدف" icon={<SalesIcon className="w-6 h-6" />}>
                    <SalesVsGoalChart />
                </ReportCard>
            </div>
            
            <div className="xl:col-span-1 md:col-span-1">
                 <ReportCard title="تحلیل منابع سرنخ" icon={<SalesIcon className="w-6 h-6" />}>
                    <LeadSourceChart />
                </ReportCard>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
             <ReportCard title="خلاصه عملکرد پشتیبانی" icon={<TicketsIcon className="w-6 h-6" />}>
                <div className="space-y-4 text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-yellow-500">
                            <StarIcon className="w-7 h-7" />
                            <span className="text-3xl font-bold mr-2 text-gray-800 dark:text-white">4.2</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">میانگین رضایت مشتری</p>
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-green-500">
                            <CheckCircleIcon className="w-7 h-7" />
                            <span className="text-3xl font-bold mr-2 text-gray-800 dark:text-white">94%</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">انطباق با SLA</p>
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-red-500">
                            <ExclamationTriangleIcon className="w-7 h-7" />
                            <span className="text-3xl font-bold mr-2 text-gray-800 dark:text-white">8</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تیکت‌های نقض‌کننده SLA</p>
                    </div>
                </div>
            </ReportCard>

            <div className="xl:col-span-2 md:col-span-2">
                <ReportCard title="گزارش عملکرد تیکت‌ها" icon={<TicketsIcon className="w-6 h-6" />}>
                    <TicketPerformanceChart />
                </ReportCard>
            </div>
        </div>
    );

    const renderInventoryPurchase = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            <div className="xl:col-span-2 md:col-span-2">
                <ReportCard title="محصولات پرفروش" icon={<ShoppingBagIcon className="w-6 h-6" />}>
                    <TopProductsChart />
                </ReportCard>
            </div>
            
            <div className="xl:col-span-1 md:col-span-1">
                <ReportCard title="وضعیت موجودی انبار" icon={<ArchiveBoxIcon className="w-6 h-6" />}>
                    <InventorySummaryChart />
                </ReportCard>
            </div>

             <ReportCard title="خلاصه تدارکات" icon={<ShoppingBagIcon className="w-6 h-6" />}>
                <div className="space-y-4 text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">1.2 میلیارد</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ارزش کل موجودی انبار</p>
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">12</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">فاکتورهای خرید باز</p>
                    </div>
                </div>
            </ReportCard>
        </div>
    );

  return (
    <div className="flex flex-col h-full">
        <div className="bg-white dark:bg-gray-800 p-2 mb-6 rounded-lg shadow-sm flex overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap
                        ${activeTab === tab.id 
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                >
                    {tab.icon}
                    <span className="mr-2 font-medium">{tab.name}</span>
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'sales_finance' && renderSalesFinance()}
            {activeTab === 'support' && renderSupport()}
            {activeTab === 'inventory_purchase' && renderInventoryPurchase()}
            {activeTab === 'user_activity' && <UserActivityReport users={users} interactions={interactions} tickets={tickets} />}
        </div>
    </div>
  );
};

export default Reports;