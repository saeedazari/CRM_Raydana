
import React from 'react';
import { StarIcon } from './icons/StarIcon';

const SatisfactionScore: React.FC = () => {
    const score = 4.2;
    const maxScore = 5;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl font-bold text-gray-800 dark:text-gray-100">
                {score.toFixed(1)}<span className="text-3xl text-gray-400">/{maxScore}</span>
            </div>
            <div className="flex mt-2">
                {[...Array(maxScore)].map((_, index) => {
                    const filled = index < Math.floor(score);
                    const halfFilled = index === Math.floor(score) && score % 1 >= 0.5;
                    return (
                        <StarIcon 
                            key={index} 
                            className={`w-8 h-8 ${filled || halfFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            fill={filled || halfFilled ? 'currentColor' : 'none'}
                        />
                    );
                })}
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">میانگین امتیاز رضایت</p>
            <div className="mt-6 w-full text-center">
                <p className="text-sm"><span className="font-bold">۱۲</span> تیکت حل شده امروز</p>
                <p className="text-sm mt-1"><span className="font-bold text-green-500">۹۴٪</span> انطباق با SLA</p>
            </div>
        </div>
    );
};

export default SatisfactionScore;
