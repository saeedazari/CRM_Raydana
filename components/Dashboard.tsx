
import React from 'react';
import KpiCard from './KpiCard';
import SalesTrendChart from './SalesTrendChart';
import SalesFunnel from './SalesFunnel';
import SatisfactionScore from './SatisfactionScore';
import LatestTickets from './LatestTickets';
import { UsersIcon } from './icons/UsersIcon';
import { TicketsIcon } from './icons/TicketsIcon';
import { SalesIcon } from './icons/SalesIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <KpiCard title="کل مشتریان" value="1,245" change={5} icon={<UsersIcon className="w-8 h-8 text-blue-500" />} />
      </div>
      <div className="lg:col-span-1">
        <KpiCard title="تیکت‌های باز" value="38" change={-12} icon={<TicketsIcon className="w-8 h-8 text-green-500" />} />
      </div>
      <div className="lg:col-span-2">
        <KpiCard title="فروش ماه جاری" value="۴۵۰٬۰۰۰٬۰۰۰ تومان" change={18} icon={<SalesIcon className="w-8 h-8 text-indigo-500" />} />
      </div>

      <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">نمودار روند فروش (۱۲ ماه اخیر)</h2>
        <SalesTrendChart />
      </div>
      
      <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">قیف فروش</h2>
        <SalesFunnel />
      </div>

      <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">آخرین تیکت‌ها</h2>
            <LatestTickets />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">رضایت مشتری</h2>
            <SatisfactionScore />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
