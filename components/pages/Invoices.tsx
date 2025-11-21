
import React, { useState, useEffect } from 'react';
import InvoicesList from '../sales/InvoicesList';
import InvoiceEditor from '../sales/InvoiceEditor';
import { Invoice, Quote, Customer, Product, CompanyInfo } from '../../types';

interface InvoicesProps {
    initialParams?: any;
    customers: Customer[];
    invoices: Invoice[];
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
    quotes: Quote[];
    companyInfo: CompanyInfo;
}

const Invoices: React.FC<InvoicesProps> = ({ initialParams, customers, invoices, setInvoices, quotes, companyInfo }) => {
    const [view, setView] = useState<{ action: 'list' | 'create' | 'edit', entityId?: string, prefill?: any }>({ action: 'list' });
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        const mockProducts: Product[] = [ 
            { id: 'P1', name: 'سرویس پشتیبانی طلایی', price: 10000000, stock: 100, type: 'service' }, 
            { id: 'P2', name: 'سرویس پشتیبانی نقره‌ای', price: 5000000, stock: 50, type: 'service' } 
        ];
        setProducts(mockProducts);
    }, []);

    useEffect(() => {
        if (initialParams?.action) {
          setView({
            action: initialParams.action,
            prefill: initialParams.prefill,
            entityId: initialParams.entityId,
          });
        }
    }, [initialParams]);


    const handleSaveInvoice = (invoice: Omit<Invoice, 'id'> | Invoice) => {
        const isEditing = 'id' in invoice;
        if (isEditing) {
            setInvoices(invoices.map(i => i.id === invoice.id ? invoice as Invoice : i));
        } else {
            const newInvoice: Invoice = {
                id: `INV-${Date.now()}`,
                ...(invoice as Omit<Invoice, 'id'>)
            };
            setInvoices(prev => [...prev, newInvoice]);
        }
        handleCancel();
    };
    
    const handleEdit = (invoice: Invoice) => setView({ action: 'edit', entityId: invoice.id });
    const handleCreate = () => setView({ action: 'create' });
    const handleCancel = () => setView({ action: 'list', prefill: undefined, entityId: undefined });

    if (view.action === 'list') {
        return <InvoicesList
            invoices={invoices}
            onCreateNew={handleCreate}
            onEdit={handleEdit}
            companyInfo={companyInfo}
        />;
    }

    const editingInvoice = view.action === 'edit' ? invoices.find(i => i.id === view.entityId) : undefined;
    return <InvoiceEditor
        key={view.entityId || view.prefill?.quoteId || 'create'}
        invoiceData={editingInvoice}
        prefillData={view.prefill}
        quotes={quotes}
        customers={customers}
        products={products}
        onSave={handleSaveInvoice}
        onCancel={handleCancel}
        companyInfo={companyInfo}
    />;
};

export default Invoices;
