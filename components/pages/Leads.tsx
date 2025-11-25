
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    ... (Same as before)
*/
import React from 'react';
import LeadsTable from '../sales/LeadsTable';
import { Lead, User } from '../../types';

interface LeadsProps {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    users: User[];
}

const Leads: React.FC<LeadsProps> = ({ leads, setLeads, users }) => {

    const handleAddLead = (leadData: Omit<Lead, 'id' | 'assignedTo'>) => {
        const assignee = users.find(u => u.id === leadData.assignedToId);
        const newLead: Lead = {
            id: `L-${Date.now()}`,
            ...leadData,
            assignedTo: assignee
        };
        setLeads(prev => [newLead, ...prev]);
    };

    const handleUpdateLead = (leadToUpdate: Lead) => {
         const assignee = users.find(u => u.id === leadToUpdate.assignedToId);
        setLeads(prev => prev.map(lead => lead.id === leadToUpdate.id ? {...leadToUpdate, assignedTo: assignee} : lead));
    };

    const handleConvertLead = (leadToConvert: Lead, opportunityName: string, opportunityAmount: number) => {
        console.log(`Converting lead ${leadToConvert.id} to opportunity: ${opportunityName} with amount ${opportunityAmount}`);
        setLeads(prev => prev.map(lead => lead.id === leadToConvert.id ? { ...lead, status: 'تبدیل شده', converted: true } : lead));
    };

    return <LeadsTable 
        leads={leads}
        users={users}
        onAddLead={handleAddLead}
        onUpdateLead={handleUpdateLead}
        onConvertLead={handleConvertLead}
    />;
};

export default Leads;
