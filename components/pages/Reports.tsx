/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    این صفحه گزارش‌های مختلف را نمایش می‌دهد. هر کارت گزارش و نمودار باید داده‌های خود را از یک API endpoint جداگانه دریافت کند.

    1. خلاصه عملکرد پشتیبانی (Support Performance Summary)
    - Route: /api/reports/support-summary
    - Method: GET
    - Response JSON Schema: { "averageSatisfaction": number, "slaCompliance": number, "slaViolations": number }
    - توضیح منطق بکند مورد نیاز: محاسبه میانگین رضایت مشتریان از نظرسنجی‌ها، درصد تیکت‌هایی که در محدوده SLA پاسخ داده شده‌اند و تعداد تیکت‌هایی که SLA را نقض کرده‌اند.

    2. خلاصه عملکرد فروش (Sales Performance Summary)
    - Route: /api/reports/sales-summary
    - Method: GET
    - Response JSON Schema: { "dealsWonThisMonth": number, "leadToOpportunityRate": number, "averageSalesCycleDays": number }
    - توضیح منطق بکند مورد نیاز: شمارش فرصت‌های موفق در ماه جاری، محاسبه نرخ تبدیل سرنخ به فرصت و میانگین زمان از ایجاد سرنخ تا موفقیت فرصت.

    3. عملکرد فروش در برابر هدف (Sales Vs Goal)
    - Route: /api/reports/sales-goal
    - Method: GET
    - Response JSON Schema: { "currentSales": number, "goal": number }
    - توضیح منطق بکند مورد نیاز: دریافت میزان فروش فعلی و هدف فروش تعیین شده برای دوره زمانی مشخص.

    4. گزارش عملکرد تیکت‌ها (Ticket Performance by Category)
    - Route: /api/reports/ticket-performance
    - Method: GET
    - Response JSON Schema: { "data": [{ "category": "string", "avgFirstResponseHours": number, "avgResolutionHours": number }] }
    - توضیح منطق بکند مورد نیاز: محاسبه میانگین زمان اولین پاسخ و میانگین زمان حل تیکت به تفکیک دسته‌بندی.

    5. تحلیل منابع سرنخ (Lead Source Analysis)
    - Route: /api/reports/lead-sources
    - Method: GET
    - Response JSON Schema: { "data": [{ "name": "string", "value": number }] }
    - توضیح منطق بکند مورد نیاز: شمارش تعداد سرنخ‌ها به تفکیک منبع ایجاد آن‌ها.

    - Dependencies: تمام این endpoint ها نیاز به Auth Token دارند.
*/
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
    // در یک اپلیکیشن واقعی، داده‌های هر کارت از API های مربوطه fetch می‌شود
    // مثال: const { data: supportSummary } = useSWR('/api/reports/support-summary');

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