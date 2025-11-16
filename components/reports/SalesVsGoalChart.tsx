import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { SalesGoalData } from '../../types';

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API: GET /api/reports/sales-goal
    { "currentSales": number, "goal": number }
*/
// const goal = 500000000;
// const currentSales = 450000000;
// const percentage = Math.round((currentSales / goal) * 100);

// const data: SalesGoalData[] = [
//   {
//     name: 'فروش',
//     value: percentage,
//     fill: '#4f46e5',
//   },
// ];

const SalesVsGoalChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [chartData, setChartData] = useState<{ data: SalesGoalData[], currentSales: number, goal: number, percentage: number }>({
      data: [], currentSales: 0, goal: 0, percentage: 0
  });

  useEffect(() => {
    setIsClient(true);
    /*
      === API CALL REQUIRED HERE ===
      - Route: /api/reports/sales-goal
      - Method: GET
      - Output: { "currentSales": number, "goal": number }
      - Sample Fetch Code:
        fetch('/api/reports/sales-goal', { headers: { 'Authorization': 'Bearer <TOKEN>' } })
        .then(r => r.json())
        .then(result => {
            const percentage = result.goal > 0 ? Math.round((result.currentSales / result.goal) * 100) : 0;
            setChartData({
                currentSales: result.currentSales,
                goal: result.goal,
                percentage: percentage,
                data: [{ name: 'فروش', value: percentage, fill: '#4f46e5' }]
            });
        });
    */
    const goal = 500000000;
    const currentSales = 450000000;
    const percentage = Math.round((currentSales / goal) * 100);
    const data: SalesGoalData[] = [{ name: 'فروش', value: percentage, fill: '#4f46e5' }];
    setChartData({ data, currentSales, goal, percentage });

  }, []);
  
  return (
    <div style={{ width: '100%', height: 350 }} className="flex flex-col items-center justify-center">
        {isClient && (
          <>
            <ResponsiveContainer>
                <RadialBarChart 
                    innerRadius="80%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={chartData.data} 
                    startAngle={90} 
                    endAngle={-270}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                    />
                    {/* FIX: The 'clockWise' prop is incorrect. It should be 'clockwise'. */}
                    <RadialBar
                        background
                        clockwise
                        dataKey="value"
                        cornerRadius={10}
                    />
                    <text 
                        x="50%" 
                        y="50%" 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        className="fill-current text-gray-800 dark:text-gray-100 text-4xl font-bold"
                    >
                        {`${chartData.percentage}%`}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{chartData.currentSales.toLocaleString('fa-IR')}</span> / {chartData.goal.toLocaleString('fa-IR')} تومان
                </p>
            </div>
          </>
        )}
    </div>
  );
};

export default SalesVsGoalChart;