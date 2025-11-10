
import React from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

export interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
            <span className="mr-1">{Math.abs(change)}%</span>
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mr-2">نسبت به ماه قبل</span>
        </div>
      </div>
      <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default KpiCard;