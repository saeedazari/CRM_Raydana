
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ProductStat {
  name: string;
  sales: number;
}

const TopProductsChart: React.FC = () => {
  const [data, setData] = useState<ProductStat[]>([]);

  useEffect(() => {
    // Mock API Call
    const mockData: ProductStat[] = [
      { name: 'سرویس طلایی', sales: 45 },
      { name: 'لایسنس کاربر', sales: 32 },
      { name: 'سرویس نقره‌ای', sales: 28 },
      { name: 'هارد دیسک', sales: 15 },
      { name: 'سرور مجازی', sales: 12 },
    ];
    setData(mockData);
  }, []);

  const colors = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  if (data.length === 0) {
      return <div className="h-[350px] w-full flex items-center justify-center text-gray-400">در حال بارگذاری...</div>;
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', borderColor: '#4b5563', borderRadius: '8px', color: '#fff' }}
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
          />
          <Bar dataKey="sales" name="تعداد فروش" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: 'rgba(229, 231, 235, 0.2)' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
            <Legend />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
