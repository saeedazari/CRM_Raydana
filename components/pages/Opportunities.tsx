import React from 'react';
import OpportunityKanban from '../sales/OpportunityKanban';
import { Opportunity } from '../../types';

interface OpportunitiesProps {
    opportunities: Opportunity[];
    onUpdateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ opportunities, onUpdateOpportunity }) => {
    return (
        <div className="h-full">
            <OpportunityKanban opportunities={opportunities} onUpdateOpportunity={onUpdateOpportunity} />
        </div>
    );
};

export default Opportunities;
