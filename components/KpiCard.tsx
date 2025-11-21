
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start justify-between transition-transform hover:scale-[1.02] duration-200">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
        {trend && trendValue && (
            <div className={`flex items-center mt-2 text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
                <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} {trendValue}</span>
                <span className="mr-1 text-gray-400">نسبت به ماه قبل</span>
            </div>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl shadow-sm text-gray-600 dark:text-gray-300">
        {icon}
      </div>
    </div>
  );
};

export default KpiCard;
