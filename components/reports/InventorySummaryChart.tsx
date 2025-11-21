
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventoryStat {
  name: string;
  value: number;
}

const InventorySummaryChart: React.FC = () => {
  const [data, setData] = useState<InventoryStat[]>([]);

  useEffect(() => {
    // Mock API Call
    const mockData: InventoryStat[] = [
      { name: 'موجود کافی', value: 65 },
      { name: 'رو به اتمام', value: 20 },
      { name: 'ناموجود', value: 15 },
    ];
    setData(mockData);
  }, []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  if (data.length === 0) {
      return <div className="h-[350px] w-full flex items-center justify-center text-gray-400">در حال بارگذاری...</div>;
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.95)', borderColor: '#4b5563', borderRadius: '8px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', direction: 'rtl', marginTop: '20px' }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventorySummaryChart;
