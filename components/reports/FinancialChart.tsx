
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialData {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

const FinancialChart: React.FC = () => {
  const [data, setData] = useState<FinancialData[]>([]);

  useEffect(() => {
    // Mock API Call
    const mockData: FinancialData[] = [
      { month: 'فروردین', income: 150000000, expense: 80000000, profit: 70000000 },
      { month: 'اردیبهشت', income: 180000000, expense: 90000000, profit: 90000000 },
      { month: 'خرداد', income: 120000000, expense: 100000000, profit: 20000000 },
      { month: 'تیر', income: 250000000, expense: 110000000, profit: 140000000 },
      { month: 'مرداد', income: 300000000, expense: 130000000, profit: 170000000 },
      { month: 'شهریور', income: 280000000, expense: 120000000, profit: 160000000 },
    ];
    setData(mockData);
  }, []);

  if (data.length === 0) {
      return <div className="h-[350px] w-full flex items-center justify-center text-gray-400">در حال بارگذاری...</div>;
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
          <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 11 }} 
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                borderColor: '#4b5563', 
                borderRadius: '8px', 
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            }}
            formatter={(value: number) => [`${value.toLocaleString('fa-IR')} تومان`, '']}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="income" name="درآمد" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="expense" name="هزینه" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
