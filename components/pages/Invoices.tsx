import React, { useState, useEffect } from 'react';
import InvoicesList from '../sales/InvoicesList';
import InvoiceEditor from '../sales/InvoiceEditor';
import { Invoice, Quote, Customer, Product } from '../../types';

const mockProducts: Product[] = [
    { id: 'P1', name: 'سرویس پشتیبانی طلایی', price: 10000000 },
    { id: 'P2', name: 'سرویس پشتیبانی نقره‌ای', price: 5000000 },
];
// FIX: Added required 'username' property to align with the 'Customer' type definition.
const mockCustomers: Customer[] = [
  { id: 'C1', companyName: 'شرکت آلفا', contactPerson: 'آقای الف', username: 'alpha', email: 'alpha@co.com', phone: '021-123', status: 'فعال' },
  { id: 'C2', companyName: 'تجارت بتا', contactPerson: 'خانم ب', username: 'beta', email: 'beta@co.com', phone: '021-456', status: 'فعال' },
];
const mockQuotes: Quote[] = [
    { id: 'Q-123', customerId: 'C1', customerName: 'شرکت آلفا', issueDate: '1403/05/01', expiryDate: '1403/05/15', status: 'تایید شده', items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, discount: 10, tax: 9, total: 9000000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000 },
];
const mockInvoices: Invoice[] = [
    { id: 'INV-001', quoteId: 'Q-123', customerId: 'C1', customerName: 'شرکت آلفا', issueDate: '1403/05/02', dueDate: '1403/06/02', status: 'ارسال شده', items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, discount: 10, tax: 9, total: 9000000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000 },
];

interface InvoicesProps {
    initialParams?: any;
    customers: Customer[];
}

const Invoices: React.FC<InvoicesProps> = ({ initialParams, customers }) => {
    const [view, setView] = useState<{ action: 'list' | 'create' | 'edit', entityId?: string, prefill?: any }>({ action: 'list' });
    
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
    const [products, setProducts] = useState<Product[]>(mockProducts);
    
    useEffect(() => {
        if (initialParams?.action) {
          setView({
            action: initialParams.action,
            prefill: initialParams.prefill,
            entityId: undefined,
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
    />;
};

export default Invoices;