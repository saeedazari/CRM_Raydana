import React, { useState, useEffect } from 'react';
import OpportunityKanban from '../sales/OpportunityKanban';
import LeadsTable from '../sales/LeadsTable';
import ProductsList from '../sales/ProductsList';
import QuotationsList from '../sales/QuotationsList';
import InvoicesList from '../sales/InvoicesList';
import QuoteEditor from '../sales/QuoteEditor';
import InvoiceEditor from '../sales/InvoiceEditor';

import { Lead, Opportunity, Product, Quote, Invoice, Customer, User } from '../../types';
import { SalesIcon } from '../icons/SalesIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { CubeIcon } from '../icons/CubeIcon';

type SalesView = {
  tab: 'opportunities' | 'leads' | 'quotes' | 'invoices' | 'products';
  action: 'list' | 'create' | 'edit';
  entityId?: string;
  prefill?: any;
};

interface SalesProps {
  initialParams?: any;
  leads: Lead[];
  opportunities: Opportunity[];
  customers: Customer[];
  products: Product[];
  quotes: Quote[];
  invoices: Invoice[];
  users: User[];
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onConvertLead: (lead: Lead, opportunityName: string, opportunityAmount: number) => void;
  onUpdateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onAddQuote: (quote: Omit<Quote, 'id'>) => void;
  onUpdateQuote: (quote: Quote) => void;
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onUpdateInvoice: (invoice: Invoice) => void;
  onCreateInvoiceFromQuote: (quote: Quote) => void;
}

const Sales: React.FC<SalesProps> = (props) => {
  const [view, setView] = useState<SalesView>({ tab: 'opportunities', action: 'list' });

  useEffect(() => {
    if (props.initialParams) {
      setView({
        tab: props.initialParams.tab || 'opportunities',
        action: props.initialParams.action || 'list',
        prefill: props.initialParams.prefill,
      });
    }
  }, [props.initialParams]);
  
  const handleSetView = (newView: Partial<SalesView>) => {
      setView(prev => ({ ...prev, action: 'list', ...newView, prefill: null }));
  };

  const tabs: { id: SalesView['tab']; name: string; icon: React.ReactNode }[] = [
    { id: 'opportunities', name: 'فرصت‌ها', icon: <SalesIcon className="w-5 h-5" /> },
    { id: 'leads', name: 'سرنخ‌ها', icon: <LightBulbIcon className="w-5 h-5" /> },
    { id: 'quotes', name: 'پیش‌فاکتورها', icon: <DocumentDuplicateIcon className="w-5 h-5" /> },
    { id: 'invoices', name: 'فاکتورها', icon: <CreditCardIcon className="w-5 h-5" /> },
    { id: 'products', name: 'کالاها و خدمات', icon: <CubeIcon className="w-5 h-5" /> },
  ];
  
  const renderListView = () => {
      let content;
      switch(view.tab) {
        case 'opportunities':
            content = <OpportunityKanban opportunities={props.opportunities} onUpdateOpportunity={props.onUpdateOpportunity} />;
            break;
        case 'leads':
            content = <LeadsTable leads={props.leads} onConvertLead={props.onConvertLead} onAddLead={props.onAddLead} onUpdateLead={props.onUpdateLead} users={props.users} />;
            break;
        case 'products':
            content = <ProductsList products={props.products} onAddProduct={props.onAddProduct} onUpdateProduct={props.onUpdateProduct} />;
            break;
        case 'quotes':
            content = <QuotationsList 
                        quotes={props.quotes} 
                        onCreateNew={() => handleSetView({ action: 'create' })}
                        onEdit={(quote) => handleSetView({ action: 'edit', entityId: quote.id })}
                        onCreateInvoiceFromQuote={props.onCreateInvoiceFromQuote}
                      />;
            break;
        case 'invoices':
            content = <InvoicesList 
                        invoices={props.invoices} 
                        onCreateNew={() => handleSetView({ action: 'create' })}
                        onEdit={(invoice) => handleSetView({ action: 'edit', entityId: invoice.id })}
                      />;
            break;
        default:
            content = null;
      }
      
      return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 px-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-i-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleSetView({ tab: tab.id, action: 'list' })}
                            className={`flex items-center flex-shrink-0 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors
                            ${view.tab === tab.id
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
            </div>
            <div className="flex-grow overflow-auto p-6">
                {content}
            </div>
        </div>
      )
  }

  const renderEditorView = () => {
    const onCancel = () => handleSetView({ action: 'list' });
    
    if (view.tab === 'quotes') {
      const editingQuote = view.action === 'edit' ? props.quotes.find(q => q.id === view.entityId) : undefined;
      return <QuoteEditor
                key={view.entityId || 'create'} // Force re-mount on change
                quoteData={editingQuote}
                customers={props.customers}
                products={props.products}
                onSave={(quote) => {
                  if ('id' in quote) {
                    props.onUpdateQuote(quote as Quote);
                  } else {
                    props.onAddQuote(quote as Omit<Quote, 'id'>);
                  }
                  onCancel();
                }}
                onCancel={onCancel}
                onCreateInvoiceFromQuote={props.onCreateInvoiceFromQuote}
             />
    }

    if (view.tab === 'invoices') {
        const editingInvoice = view.action === 'edit' ? props.invoices.find(i => i.id === view.entityId) : undefined;
        return <InvoiceEditor
                  key={view.entityId || view.prefill?.quoteId || 'create'}
                  invoiceData={editingInvoice}
                  prefillData={view.prefill}
                  quotes={props.quotes}
                  customers={props.customers}
                  products={props.products}
                  onSave={(invoice) => {
                    if ('id' in invoice) {
                        props.onUpdateInvoice(invoice as Invoice);
                    } else {
                        props.onAddInvoice(invoice as Omit<Invoice, 'id'>);
                    }
                    onCancel();
                  }}
                  onCancel={onCancel}
               />
    }
    
    return null;
  }

  return view.action === 'list' ? renderListView() : renderEditorView();
};

export default Sales;
