import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { SalesGoalData } from '../../types';

const goal = 500000000;
const currentSales = 450000000;
const percentage = Math.round((currentSales / goal) * 100);

const data: SalesGoalData[] = [
  {
    name: 'فروش',
    value: percentage,
    fill: '#4f46e5',
  },
];

const SalesVsGoalChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
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
                    data={data} 
                    startAngle={90} 
                    endAngle={-270}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        background
                        clockWise
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
                        {`${percentage}%`}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{currentSales.toLocaleString('fa-IR')}</span> / {goal.toLocaleString('fa-IR')} تومان
                </p>
            </div>
          </>
        )}
    </div>
  );
};

export default SalesVsGoalChart;