import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeadSourceData, LeadSource } from '../../types';

const data: LeadSourceData[] = [
  { name: 'وبسایت', value: 400 },
  { name: 'ارجاعی', value: 300 },
  { name: 'تماس سرد', value: 300 },
  { name: 'شبکه اجتماعی', value: 200 },
];

const COLORS: { [key in LeadSource]: string } = {
    'وبسایت': '#4f46e5',
    'ارجاعی': '#818cf8',
    'تماس سرد': '#a5b4fc',
    'شبکه اجتماعی': '#c7d2fe',
};


const LeadSourceChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div style={{ width: '100%', height: 350 }}>
      {isClient && (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as LeadSource]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                  borderColor: '#4b5563', 
                  borderRadius: '0.5rem',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px', direction: 'rtl' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LeadSourceChart;