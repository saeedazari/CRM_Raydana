import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesData } from '../types';

const data: SalesData[] = [
  { month: 'فروردین', sales: 400 },
  { month: 'اردیبهشت', sales: 300 },
  { month: 'خرداد', sales: 450 },
  { month: 'تیر', sales: 280 },
  { month: 'مرداد', sales: 500 },
  { month: 'شهریور', sales: 420 },
  { month: 'مهر', sales: 600 },
  { month: 'آبان', sales: 550 },
  { month: 'آذر', sales: 700 },
  { month: 'دی', sales: 650 },
  { month: 'بهمن', sales: 800 },
  { month: 'اسفند', sales: 750 },
];

const SalesTrendChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      {isClient && (
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                  borderColor: '#4b5563', 
                  borderRadius: '0.5rem',
                  color: '#f9fafb'
              }}
              itemStyle={{ color: '#f9fafb' }}
              cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Line type="monotone" dataKey="sales" name="فروش (میلیون تومان)" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesTrendChart;