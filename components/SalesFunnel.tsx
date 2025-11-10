
import React from 'react';
import { FunnelStage } from '../types';

const funnelData: FunnelStage[] = [
  { name: 'سرنخ', count: 150, color: 'bg-indigo-500' },
  { name: 'واجد شرایط', count: 80, color: 'bg-blue-500' },
  { name: 'پیشنهاد', count: 45, color: 'bg-cyan-500' },
  { name: 'مذاکره', count: 25, color: 'bg-emerald-500' },
  { name: 'بسته شده', count: 15, color: 'bg-green-500' },
];

const SalesFunnel: React.FC = () => {
  const maxCount = Math.max(...funnelData.map(d => d.count));

  return (
    <div className="space-y-4 pt-2">
      {funnelData.map((stage) => {
        const widthPercentage = (stage.count / maxCount) * 100;
        return (
          <div key={stage.name} className="flex items-center">
            <div className="w-24 text-sm text-gray-500 dark:text-gray-400 shrink-0">{stage.name}</div>
            <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-6 mr-2">
              <div
                className={`${stage.color} h-6 rounded-full flex items-center justify-end px-2`}
                style={{ width: `${widthPercentage}%` }}
              >
                <span className="text-white text-xs font-bold">{stage.count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SalesFunnel;
