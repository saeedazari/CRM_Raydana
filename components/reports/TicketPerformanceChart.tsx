import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TicketPerformanceData } from '../../types';

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API: GET /api/reports/ticket-performance
    { 
      "data": [
        { "category": "فنی", "میانگین اولین پاسخ (ساعت)": 4, "میانگین زمان حل (ساعت)": 24 },
        ...
      ] 
    }
*/
// const data: TicketPerformanceData[] = [
//   { category: 'فنی', 'میانگین اولین پاسخ (ساعت)': 4, 'میانگین زمان حل (ساعت)': 24 },
//   { category: 'مالی', 'میانگین اولین پاسخ (ساعت)': 2, 'میانگین زمان حل (ساعت)': 8 },
//   { category: 'عمومی', 'میانگین اولین پاسخ (ساعت)': 8, 'میانگین زمان حل (ساعت)': 48 },
//   { category: 'گزارش باگ', 'میانگین اولین پاسخ (ساعت)': 1, 'میانگین زمان حل (ساعت)': 12 },
// ];

const TicketPerformanceChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  // داده ها باید از API گرفته شوند
  const [data, setData] = useState<TicketPerformanceData[]>([]);

  useEffect(() => {
    setIsClient(true);
    /*
      === API CALL REQUIRED HERE ===
      - Route: /api/reports/ticket-performance
      - Method: GET
      - Output: { "data": [TicketPerformanceData] }
      - Sample Fetch Code:
        fetch('/api/reports/ticket-performance', { headers: { 'Authorization': 'Bearer <TOKEN>' } })
        .then(r => r.json())
        .then(result => setData(result.data));
    */
    const mockData: TicketPerformanceData[] = [
      { category: 'فنی', 'میانگین اولین پاسخ (ساعت)': 4, 'میانگین زمان حل (ساعت)': 24 },
      { category: 'مالی', 'میانگین اولین پاسخ (ساعت)': 2, 'میانگین زمان حل (ساعت)': 8 },
      { category: 'عمومی', 'میانگین اولین پاسخ (ساعت)': 8, 'میانگین زمان حل (ساعت)': 48 },
      { category: 'گزارش باگ', 'میانگین اولین پاسخ (ساعت)': 1, 'میانگین زمان حل (ساعت)': 12 },
    ];
    setData(mockData);

  }, []);
  
  return (
    <div style={{ width: '100%', height: 350 }}>
      {isClient && (
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis label={{ value: 'ساعت', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                  borderColor: '#4b5563', 
                  borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#f9fafb' }}
              cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px', direction: 'rtl' }} />
            <Bar dataKey="میانگین اولین پاسخ (ساعت)" fill="#818cf8" name="میانگین اولین پاسخ" />
            <Bar dataKey="میانگین زمان حل (ساعت)" fill="#4f46e5" name="میانگین زمان حل" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TicketPerformanceChart;