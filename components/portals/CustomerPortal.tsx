import React from 'react';
import { Customer, Ticket } from '../../types';
import CustomerTickets from './CustomerTickets';
import { ArrowLeftOnRectangleIcon } from '../icons/ArrowLeftOnRectangleIcon';

interface CustomerPortalProps {
    customer: Customer;
    onLogout: () => void;
    tickets: Ticket[];
    onAddTicket: (ticket: Omit<Ticket, 'id' | 'assignee' | 'date'>) => void;
    onUpdateTicket: (ticket: Ticket) => void;
    onSurveySubmit: (ticketId: string, rating: number, feedback: string, tags: string[]) => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = (props) => {
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-semibold">
                    پورتال مشتریان <span className="text-indigo-600 dark:text-indigo-400">| {props.customer.companyName}</span>
                </h1>
                <button 
                    onClick={props.onLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 ml-2" />
                    خروج
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <CustomerTickets {...props} />
            </main>
        </div>
    );
};

export default CustomerPortal;