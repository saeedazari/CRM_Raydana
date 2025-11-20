import React, { useState } from 'react';
import { Customer, Ticket, KnowledgeBaseArticle, KnowledgeBaseCategory } from '../../types';
import CustomerTickets from './CustomerTickets';
import CustomerKnowledgeBase from './CustomerKnowledgeBase';
import { ArrowLeftOnRectangleIcon } from '../icons/ArrowLeftOnRectangleIcon';
import ThemeToggle from '../ThemeToggle';
import { TicketsIcon } from '../icons/TicketsIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';

interface CustomerPortalProps {
    customer: Customer;
    onLogout: () => void;
    tickets: Ticket[];
    onAddTicket: (ticket: Omit<Ticket, 'id' | 'assignee' | 'customer' | 'assigneeId' | 'date'>) => void;
    onUpdateTicket: (ticket: Ticket) => void;
    onSurveySubmit: (ticketId: string, rating: number, feedback: string, tags: string[]) => void;
    kbArticles: KnowledgeBaseArticle[];
    kbCategories: KnowledgeBaseCategory[];
}

type ActiveTab = 'tickets' | 'knowledgeBase';

const CustomerPortal: React.FC<CustomerPortalProps> = (props) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('tickets');
    
    const tabs: { id: ActiveTab; name: string; icon: React.ReactNode }[] = [
        { id: 'tickets', name: 'تیکت‌ها', icon: <TicketsIcon className="w-5 h-5" /> },
        { id: 'knowledgeBase', name: 'پایگاه دانش', icon: <AcademicCapIcon className="w-5 h-5" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'knowledgeBase':
                return <CustomerKnowledgeBase articles={props.kbArticles} categories={props.kbCategories} />;
            case 'tickets':
            default:
                return <CustomerTickets {...props} />;
        }
    };
    
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-semibold">
                    پورتال مشتریان <span className="text-indigo-600 dark:text-indigo-400">| {props.customer.name}</span>
                </h1>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button 
                        onClick={props.onLogout}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 ml-2" />
                        خروج
                    </button>
                </div>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <nav className="flex flex-wrap space-i-8 px-6" aria-label="Tabs">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === tab.id
                              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            }`}
                        >
                          {tab.icon}
                          <span className="mr-2">{tab.name}</span>
                        </button>
                      ))}
                    </nav>
                </div>
                 <div className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default CustomerPortal;