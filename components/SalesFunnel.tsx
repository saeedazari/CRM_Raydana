
import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';

const data = [
  {
    "value": 100,
    "name": "سرنخ",
    "fill": "#818cf8"
  },
  {
    "value": 80,
    "name": "واجد شرایط",
    "fill": "#6366f1"
  },
  {
    "value": 50,
    "name": "پیشنهاد",
    "fill": "#4f46e5"
  },
  {
    "value": 40,
    "name": "مذاکره",
    "fill": "#4338ca"
  },
  {
    "value": 26,
    "name": "توافق",
    "fill": "#3730a3"
  }
];

const SalesFunnel: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <FunnelChart>
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                borderColor: '#4b5563', 
                borderRadius: '8px',
                color: '#fff',
                direction: 'rtl'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList position="right" fill="#374151" stroke="none" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesFunnel;
