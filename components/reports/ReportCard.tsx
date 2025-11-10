import React from 'react';

interface ReportCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-indigo-100 dark:bg-gray-700 rounded-md text-indigo-600 dark:text-indigo-300">
            {icon}
        </div>
        <h2 className="text-lg font-semibold mr-3 text-gray-700 dark:text-gray-200">{title}</h2>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default ReportCard;
