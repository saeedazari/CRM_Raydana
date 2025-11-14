import React, { useState } from 'react';
import OpportunityKanban from '../sales/OpportunityKanban';
import { Opportunity, User } from '../../types';

// FIX: Removed 'email' property and added 'username' to align with the 'User' type definition.
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U3' },
];

const mockOpportunities: Opportunity[] = [
    { id: 'OP1', name: 'پروژه وبسایت فروشگاهی', customerName: 'فروشگاه سارا', customerId: 'C-L1', amount: 250000000, stage: 'ارائه پیشنهاد', closeDate: '1403/06/15', assignedToId: 'U1', assignedTo: mockUsers[0] },
    { id: 'OP2', name: 'قرارداد پشتیبانی سالانه', customerName: 'صنایع گاما', customerId: 'C3', amount: 120000000, stage: 'مذاکره', closeDate: '1403/05/30', assignedToId: 'U3', assignedTo: mockUsers[1] },
    { id: 'OP3', name: 'توسعه ماژول گزارشات', customerName: 'شرکت آلفا', customerId: 'C1', amount: 80000000, stage: 'واجد شرایط', closeDate: '1403/07/01', assignedToId: 'U1', assignedTo: mockUsers[0] },
    { id: 'OP4', name: 'خرید 10 لایسنس جدید', customerName: 'تجارت بتا', customerId: 'C2', amount: 50000000, stage: 'موفق', closeDate: '1403/04/20', assignedToId: 'U3', assignedTo: mockUsers[1] },
    { id: 'OP5', name: 'پروژه مشاوره', customerName: 'راهکارهای دلتا', customerId: 'C4', amount: 45000000, stage: 'شناسایی', closeDate: '1403/08/01', assignedToId: 'U1', assignedTo: mockUsers[0] },
    { id: 'OP6', name: 'تمدید قرارداد', customerName: 'شرکت آلفا', customerId: 'C1', amount: 95000000, stage: 'ناموفق', closeDate: '1403/04/10', assignedToId: 'U1', assignedTo: mockUsers[0] },
];

const Opportunities: React.FC = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);

    const handleUpdateOpportunity = (opportunityId: string, updates: Partial<Opportunity>) => {
        setOpportunities(prev =>
            prev.map(opp =>
                opp.id === opportunityId ? { ...opp, ...updates } : opp
            )
        );
    };

    return (
        <div className="h-full">
            <OpportunityKanban opportunities={opportunities} onUpdateOpportunity={handleUpdateOpportunity} />
        </div>
    );
};

export default Opportunities;