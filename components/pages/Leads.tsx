import React from 'react';
import LeadsTable from '../sales/LeadsTable';
import { Lead, User } from '../../types';

interface LeadsProps {
    leads: Lead[];
    onConvertLead: (lead: Lead, opportunityName: string, opportunityAmount: number) => void;
    onAddLead: (lead: Omit<Lead, 'id'>) => void;
    onUpdateLead: (lead: Lead) => void;
    users: User[];
}

const Leads: React.FC<LeadsProps> = (props) => {
    return <LeadsTable {...props} />;
};

export default Leads;
