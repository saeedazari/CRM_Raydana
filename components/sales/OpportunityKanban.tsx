import React from 'react';
import { Opportunity, OpportunityStage } from '../../types';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { CurrencyDollarIcon } from '../icons/CurrencyDollarIcon';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';


const stages: OpportunityStage[] = ['شناسایی', 'واجد شرایط', 'ارائه پیشنهاد', 'مذاکره', 'موفق', 'ناموفق'];

const stageColors: { [key in OpportunityStage]: string } = {
    'شناسایی': 'border-t-gray-400',
    'واجد شرایط': 'border-t-blue-500',
    'ارائه پیشنهاد': 'border-t-cyan-500',
    'مذاکره': 'border-t-yellow-500',
    'موفق': 'border-t-green-500',
    'ناموفق': 'border-t-red-500',
};

const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 border-b-2 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <h4 className="font-bold text-gray-800 dark:text-gray-100">{opportunity.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{opportunity.customerName}</p>
        <div className="flex items-center text-green-600 dark:text-green-400 mt-3">
            <CurrencyDollarIcon className="w-5 h-5 ml-1" />
            <span className="font-semibold">{opportunity.amount.toLocaleString('fa-IR')}</span>
            <span className="text-xs mr-1">تومان</span>
        </div>
        <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            <span>تاریخ بستن: {opportunity.closeDate}</span>
        </div>
        <div className="flex items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">{opportunity.assignedTo}</span>
        </div>
    </div>
);

interface OpportunityKanbanProps {
    opportunities: Opportunity[];
    onUpdateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void;
}

const OpportunityKanban: React.FC<OpportunityKanbanProps> = ({ opportunities, onUpdateOpportunity }) => {
    
    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId)) {
            return;
        }
        const newStage = destination.droppableId as OpportunityStage;
        onUpdateOpportunity(draggableId, { stage: newStage });
    };

    const formatCurrency = (value: number) => {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(1)} میلیارد`;
        }
        if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(0)} میلیون`;
        }
        return value.toLocaleString('fa-IR');
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-i-6 overflow-x-auto p-2 -mx-2">
                {stages.map(stage => {
                    const stageOpportunities = opportunities.filter(opp => opp.stage === stage);
                    const totalAmount = stageOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
                    return (
                        <Droppable key={stage} droppableId={stage}>
                            {(provided, snapshot) => (
                                <div 
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps}
                                    className={`flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-900/50 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-100 dark:bg-indigo-900/40' : ''}`}
                                >
                                    <div className={`p-4 border-t-4 ${stageColors[stage]} rounded-t-lg`}>
                                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex justify-between items-center">
                                            <span>{stage}</span>
                                            <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">{stageOpportunities.length}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-bold">{formatCurrency(totalAmount)} تومان</p>
                                    </div>
                                    <div className="p-4 overflow-y-auto h-[calc(100vh-320px)]">
                                        {stageOpportunities.map((opp, index) => (
                                            <Draggable key={opp.id} draggableId={opp.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1}}
                                                    >
                                                        <OpportunityCard opportunity={opp} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default OpportunityKanban;