import React, { useState } from 'react';
import LeadsTable from '../sales/LeadsTable';
import { Lead, User } from '../../types';

// FIX: Removed 'email' property and added 'username' to align with the 'User' type definition.
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U3' },
];

const mockLeads: Lead[] = [
    { id: 'L1', contactName: 'سارا محمدی', companyName: 'فروشگاه سارا', email: 'sara@shop.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 85, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: '1403/05/01', converted: false },
    { id: 'L2', contactName: 'رضا قاسمی', companyName: 'خدمات رضا', email: 'reza@service.com', phone: '09124445566', source: 'ارجاعی', status: 'واجد شرایط', score: 70, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: '1403/04/28', converted: false },
    { id: 'L3', contactName: 'مریم حسینی', companyName: '', email: 'maryam@mail.com', phone: '09127778899', source: 'تماس سرد', status: 'تماس گرفته شده', score: 50, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: '1403/04/25', converted: false },
    { id: 'L4', contactName: 'پیمان عزیزی', companyName: 'صنایع پیمان', email: 'peyman@industry.com', phone: '09121234567', source: 'شبکه اجتماعی', status: 'تبدیل شده', score: 95, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: '1403/04/15', converted: true },
];

const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(mockLeads);

    const handleAddLead = (leadData: Omit<Lead, 'id' | 'assignedTo'>) => {
        const assignee = mockUsers.find(u => u.id === leadData.assignedToId);
        const newLead: Lead = {
            id: `L-${Date.now()}`,
            ...leadData,
            assignedTo: assignee
        };
        setLeads(prev => [newLead, ...prev]);
    };

    const handleUpdateLead = (leadToUpdate: Lead) => {
         const assignee = mockUsers.find(u => u.id === leadToUpdate.assignedToId);
        setLeads(prev => prev.map(lead => lead.id === leadToUpdate.id ? {...leadToUpdate, assignedTo: assignee} : lead));
    };

    const handleConvertLead = (leadToConvert: Lead, opportunityName: string, opportunityAmount: number) => {
        // In a real app, this would create a Customer and Opportunity.
        // Here, we'll just mark the lead as converted.
        console.log(`Converting lead ${leadToConvert.id} to opportunity: ${opportunityName} with amount ${opportunityAmount}`);
        setLeads(prev => prev.map(lead => lead.id === leadToConvert.id ? { ...lead, status: 'تبدیل شده', converted: true } : lead));
    };

    return <LeadsTable 
        leads={leads}
        users={mockUsers}
        onAddLead={handleAddLead}
        onUpdateLead={handleUpdateLead}
        onConvertLead={handleConvertLead}
    />;
};

export default Leads;