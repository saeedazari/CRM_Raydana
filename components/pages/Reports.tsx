import React from 'react';
import ReportCard from '../reports/ReportCard';
import TicketPerformanceChart from '../reports/TicketPerformanceChart';
import SalesVsGoalChart from '../reports/SalesVsGoalChart';
import LeadSourceChart from '../reports/LeadSourceChart';
import { StarIcon } from '../icons/StarIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { SalesIcon } from '../icons/SalesIcon';
import { TicketsIcon } from '../icons/TicketsIcon';

const Reports: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* KPIs */}
      <ReportCard title="خلاصه عملکرد پشتیبانی" icon={<TicketsIcon className="w-6 h-6" />}>
        <div className="space-y-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-center text-yellow-500">
                    <StarIcon className="w-7 h-7" />
                    <span className="text-3xl font-bold mr-2">4.2</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">میانگین رضایت مشتری</p>
            </div>
             <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-center text-green-500">
                    <CheckCircleIcon className="w-7 h-7" />
                    <span className="text-3xl font-bold mr-2">94%</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">انطباق با SLA</p>
            </div>
             <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-center text-red-500">
                    <ExclamationTriangleIcon className="w-7 h-7" />
                    <span className="text-3xl font-bold mr-2">8</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تیکت‌های نقض‌کننده SLA</p>
            </div>
        </div>
      </ReportCard>
      
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
                <div className="text-3xl font-bold">25%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">نرخ تبدیل سرنخ به فرصت</p>
            </div>
             <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-3xl font-bold">42 <span className="text-lg">روز</span></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">میانگین چرخه فروش</p>
            </div>
        </div>
      </ReportCard>
      
      <div className="xl:col-span-1 md:col-span-2">
        <ReportCard title="عملکرد فروش در برابر هدف" icon={<SalesIcon className="w-6 h-6" />}>
            <SalesVsGoalChart />
        </ReportCard>
      </div>

      <div className="xl:col-span-2 md:col-span-2">
        <ReportCard title="گزارش عملکرد تیکت‌ها" icon={<TicketsIcon className="w-6 h-6" />}>
            <TicketPerformanceChart />
        </ReportCard>
      </div>
      
      <div className="xl:col-span-1 md:col-span-2">
         <ReportCard title="تحلیل منابع سرنخ" icon={<SalesIcon className="w-6 h-6" />}>
            <LeadSourceChart />
        </ReportCard>
      </div>

    </div>
  );
};

export default Reports;
