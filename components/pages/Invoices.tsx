import React, { useState, useEffect } from 'react';
import InvoicesList from '../sales/InvoicesList';
import InvoiceEditor from '../sales/InvoiceEditor';
import { Invoice, Quote, Customer, Product } from '../../types';

interface InvoicesProps {
    initialParams?: any;
    invoices: Invoice[];
    quotes: Quote[];
    customers: Customer[];
    products: Product[];
    onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
    onUpdateInvoice: (invoice: Invoice) => void;
}

const Invoices: React.FC<InvoicesProps> = (props) => {
    const [view, setView] = useState<{ action: 'list' | 'create' | 'edit', entityId?: string, prefill?: any }>({ action: 'list' });
    
    useEffect(() => {
        if (props.initialParams?.action) {
          setView({
            action: props.initialParams.action,
            prefill: props.initialParams.prefill,
            entityId: undefined,
          });
        }
    }, [props.initialParams]);


    const handleEdit = (invoice: Invoice) => {
        setView({ action: 'edit', entityId: invoice.id });
    };
    const handleCreate = () => {
        setView({ action: 'create' });
    };
    const handleCancel = () => {
        setView({ action: 'list', prefill: undefined, entityId: undefined });
    };

    if (view.action === 'list') {
        return <InvoicesList
            invoices={props.invoices}
            onCreateNew={handleCreate}
            onEdit={handleEdit}
        />;
    }

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
            handleCancel();
        }}
        onCancel={handleCancel}
    />;
};

export default Invoices;
