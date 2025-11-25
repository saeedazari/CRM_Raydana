
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    این کامپوننت مسئولیت نمایش و مدیریت فرصت‌های فروش (Opportunities) را در یک برد Kanban بر عهده دارد.

    1. دریافت لیست فرصت‌ها (Read)
    - Route: /api/opportunities
    - Method: GET
    - Response JSON Schema: { "data": [Opportunity] }
    - توضیح منطق بکند مورد نیاز: یک کنترلر برای دریافت تمام فرصت‌های فروش. باید اطلاعات کاربر تخصیص داده شده (assignedTo) را join کند.

    2. ویرایش فرصت (Update)
    - Route: /api/opportunities/:id
    - Method: PUT
    - Expected Body JSON Schema: { "stage": "string" } (یا هر فیلد دیگری که قابل ویرایش باشد)
    - Response JSON Schema: Opportunity (فرصت ویرایش شده)
    - توضیح منطق بکند مورد نیاز: بروزرسانی مرحله (stage) یا دیگر فیلدهای یک فرصت. این API هنگام drag & drop یک کارت در Kanban فراخوانی می‌شود.
    - Dependencies: نیاز به Auth Token.
*/
import React from 'react';
import OpportunityKanban from '../sales/OpportunityKanban';
import { Opportunity, OpportunityStage } from '../../types';
import { toShamsi } from '../../utils/date';
import { CurrencyDollarIcon } from '../icons/CurrencyDollarIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';

const stages: OpportunityStage[] = ['شناسایی', 'واجد شرایط', 'ارائه پیشنهاد', 'مذاکره', 'موفق', 'ناموفق'];

const stageColors: { [key in OpportunityStage]: string } = {
    'شناسایی': 'bg-gray-100 text-gray-800',
    'واجد شرایط': 'bg-blue-100 text-blue-800',
    'ارائه پیشنهاد': 'bg-cyan-100 text-cyan-800',
    'مذاکره': 'bg-yellow-100 text-yellow-800',
    'موفق': 'bg-green-100 text-green-800',
    'ناموفق': 'bg-red-100 text-red-800',
};

interface OpportunitiesProps {
    opportunities: Opportunity[];
    setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ opportunities, setOpportunities }) => {

    const handleUpdateOpportunity = (opportunityId: string, updates: Partial<Opportunity>) => {
        setOpportunities(prev =>
            prev.map(opp =>
                opp.id === opportunityId ? { ...opp, ...updates } : opp
            )
        );
    };

    return (
        <div className="h-full">
            {/* Mobile List View */}
            <div className="md:hidden space-y-4 p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">فرصت‌های فروش</h2>
                {opportunities.map(opp => (
                    <div key={opp.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{opp.name}</h3>
                            <span className="text-xs text-gray-500">{toShamsi(opp.closeDate)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{opp.customerName}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-green-600 dark:text-green-400">
                                <CurrencyDollarIcon className="w-5 h-5 ml-1" />
                                <span className="font-bold">{opp.amount.toLocaleString('fa-IR')}</span>
                            </div>
                            <div className="flex items-center">
                                {opp.assignedTo?.avatar ? (
                                    <img src={opp.assignedTo.avatar} alt={opp.assignedTo.name} className="w-6 h-6 rounded-full ml-2" />
                                ) : (
                                    <UserCircleIcon className="w-6 h-6 text-gray-400 ml-2" />
                                )}
                                <span className="text-xs text-gray-500">{opp.assignedTo?.name}</span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t dark:border-gray-700">
                            <label className="block text-xs font-medium text-gray-500 mb-1">مرحله:</label>
                            <select 
                                value={opp.stage} 
                                onChange={(e) => handleUpdateOpportunity(opp.id, { stage: e.target.value as OpportunityStage })}
                                className={`w-full p-2 text-sm rounded-lg border-none outline-none font-medium ${stageColors[opp.stage]}`}
                            >
                                {stages.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Kanban View */}
            <div className="hidden md:block h-full">
                <OpportunityKanban opportunities={opportunities} onUpdateOpportunity={handleUpdateOpportunity} />
            </div>
        </div>
    );
};

export default Opportunities;
