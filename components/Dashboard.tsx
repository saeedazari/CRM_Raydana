
import React, { useState, useEffect } from 'react';
import { Customer, Invoice, User } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { TicketsIcon } from './icons/TicketsIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { ArchiveBoxIcon } from './icons/ArchiveBoxIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import FinancialChart from './reports/FinancialChart';
import LatestTickets from './LatestTickets';
import SalesFunnel from './SalesFunnel';
import KpiCard from './KpiCard';

interface DashboardProps {
    customers: Customer[];
    onNavigate?: (page: string, params?: any) => void;
    user?: User;
}

const Dashboard: React.FC<DashboardProps> = ({customers, onNavigate, user}) => {
    const [kpis, setKpis] = useState({ 
        openTickets: 0, 
        pendingInvoices: 0,
        lowStockItems: 0,
        monthlyIncome: 0,
        monthlyExpense: 0
    });
    
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        // Mock API Data
        setKpis({ 
            openTickets: 12, 
            pendingInvoices: 5, 
            lowStockItems: 3, 
            monthlyIncome: 450000000,
            monthlyExpense: 120000000
        });

        setRecentInvoices([
            { id: 'INV-1001', customerName: 'شرکت آلفا', totalAmount: 15000000, status: 'ارسال شده', issueDate: '1403/05/01' } as Invoice,
            { id: 'INV-1002', customerName: 'تجارت بتا', totalAmount: 8500000, status: 'پرداخت شده', issueDate: '1403/05/02' } as Invoice,
            { id: 'INV-1003', customerName: 'صنایع گاما', totalAmount: 22000000, status: 'پیش‌نویس', issueDate: '1403/05/03' } as Invoice,
        ]);
    }, []);

    const hasPermission = (permission: string) => {
        if (!user || !user.role || !user.role.permissions) return true; // Default open if no user data yet (or simple mode)
        const perms = user.role.permissions.split(',');
        return perms.includes(permission);
    };

    const hasViewCustomers = hasPermission('view_customers');
    const hasViewTickets = hasPermission('view_tickets');
    const hasViewFinance = hasPermission('view_finance');
    const hasViewSales = hasPermission('view_sales');
    const hasViewInventory = hasPermission('view_inventory');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* KPI Cards */}
      {hasViewCustomers && (
          <KpiCard 
            title="کل مشتریان" 
            value={customers.length.toLocaleString('fa-IR')} 
            icon={<UsersIcon className="w-8 h-8 text-blue-500" />}
            trend="up"
            trendValue="12%"
          />
      )}
      
      {hasViewFinance && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform hover:scale-[1.02] duration-200">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">تراز مالی ماه</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                          {(kpis.monthlyIncome - kpis.monthlyExpense).toLocaleString('fa-IR')} <span className="text-xs font-normal text-gray-500">تومان</span>
                      </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                      <BanknotesIcon className="w-6 h-6" />
                  </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      <ArrowUpIcon className="w-3 h-3 ml-1"/>
                      {kpis.monthlyIncome.toLocaleString('fa-IR')}
                  </div>
                  <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                      <ArrowDownIcon className="w-3 h-3 ml-1"/>
                      {kpis.monthlyExpense.toLocaleString('fa-IR')}
                  </div>
              </div>
          </div>
      )}

      {hasViewTickets && (
          <KpiCard 
            title="تیکت‌های باز" 
            value={kpis.openTickets.toLocaleString('fa-IR')} 
            icon={<TicketsIcon className="w-8 h-8 text-indigo-500" />}
            trend="down"
            trendValue="5%"
          />
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform hover:scale-[1.02] duration-200">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">وضعیت سیستم</p>
                <div className="mt-2 space-y-2">
                    {hasViewInventory && kpis.lowStockItems > 0 && (
                        <div className="flex items-center text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                            <span className="w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></span>
                            {kpis.lowStockItems} کالا رو به اتمام
                        </div>
                    )}
                    {hasViewFinance && kpis.pendingInvoices > 0 && (
                        <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                            {kpis.pendingInvoices} فاکتور منتظر پرداخت
                        </div>
                    )}
                    {!hasViewInventory && !hasViewFinance && (
                        <div className="text-xs text-gray-500">همه سیستم‌ها نرمال هستند.</div>
                    )}
                </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                <ArchiveBoxIcon className="w-8 h-8 text-orange-600" />
            </div>
        </div>
      </div>

      {/* Financial Overview Chart */}
      {hasViewFinance && (
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <BanknotesIcon className="w-5 h-5 ml-2 text-gray-500"/>
                نمای کلی مالی (۶ ماه گذشته)
            </h2>
            <FinancialChart />
          </div>
      )}
      
      {/* Sales Funnel */}
      {hasViewSales && (
          <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
             <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">قیف فروش جاری</h2>
            <SalesFunnel />
          </div>
      )}

      {/* Recent Invoices */}
      {hasViewFinance && (
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">آخرین فاکتورها</h2>
                <button onClick={() => onNavigate && onNavigate('invoices')} className="text-xs text-indigo-600 hover:underline">مشاهده همه</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 uppercase">
                        <tr>
                            <th className="px-3 py-2">شماره</th>
                            <th className="px-3 py-2">مشتری</th>
                            <th className="px-3 py-2">مبلغ</th>
                            <th className="px-3 py-2">وضعیت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentInvoices.map(inv => (
                            <tr key={inv.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-3 py-3 font-mono text-xs text-gray-900 dark:text-white">{inv.id}</td>
                                <td className="px-3 py-3 text-gray-900 dark:text-white">{inv.customerName}</td>
                                <td className="px-3 py-3 font-medium text-gray-900 dark:text-white">{inv.totalAmount.toLocaleString('fa-IR')}</td>
                                <td className="px-3 py-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        inv.status === 'پرداخت شده' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        inv.status === 'ارسال شده' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                    }`}>{inv.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>
      )}

      {/* Latest Tickets */}
      {hasViewTickets && (
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">آخرین تیکت‌ها</h2>
                <button onClick={() => onNavigate && onNavigate('tickets')} className="text-xs text-indigo-600 hover:underline">مشاهده همه</button>
              </div>
              <LatestTickets />
          </div>
      )}

    </div>
  );
};

export default Dashboard;
