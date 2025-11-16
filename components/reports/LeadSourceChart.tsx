import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeadSourceData, LeadSource } from '../../types';

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API: GET /api/reports/lead-sources
    { 
      "data": [
        { "name": "وبسایت", "value": 400 },
        ...
      ]
    }
*/
// const data: LeadSourceData[] = [
//   { name: 'وبسایت', value: 400 },
//   { name: 'ارجاعی', value: 300 },
//   { name: 'تماس سرد', value: 300 },
//   { name: 'شبکه اجتماعی', value: 200 },
// ];

const COLORS: { [key in LeadSource]: string } = {
    'وبسایت': '#4f46e5',
    'ارجاعی': '#818cf8',
    'تماس سرد': '#a5b4fc',
    'شبکه اجتماعی': '#c7d2fe',
};


const LeadSourceChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  // داده ها باید از API گرفته شوند
  const [data, setData] = useState<LeadSourceData[]>([]);

  useEffect(() => {
    setIsClient(true);
    /*
      === API CALL REQUIRED HERE ===
      - Route: /api/reports/lead-sources
      - Method: GET
      - Output: { "data": [LeadSourceData] }
      - Sample Fetch Code:
        fetch('/api/reports/lead-sources', { headers: { 'Authorization': 'Bearer <TOKEN>' } })
        .then(r => r.json())
        .then(result => setData(result.data));
    */
    const mockData: LeadSourceData[] = [
      { name: 'وبسایت', value: 400 },
      { name: 'ارجاعی', value: 300 },
      { name: 'تماس سرد', value: 300 },
      { name: 'شبکه اجتماعی', value: 200 },
    ];
    setData(mockData);

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