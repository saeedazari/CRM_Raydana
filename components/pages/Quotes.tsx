import React, { useState } from 'react';
import QuotationsList from '../sales/QuotationsList';
import QuoteEditor from '../sales/QuoteEditor';
import { Quote, Customer, Product } from '../../types';

// FIX: Added required 'username' property to align with the 'Customer' type definition.
const mockCustomers: Customer[] = [
  { id: 'C1', companyName: 'شرکت آلفا', contactPerson: 'آقای الف', username: 'alpha', email: 'alpha@co.com', phone: '021-123', status: 'فعال' },
  { id: 'C2', companyName: 'تجارت بتا', contactPerson: 'خانم ب', username: 'beta', email: 'beta@co.com', phone: '021-456', status: 'فعال' },
];
const mockProducts: Product[] = [
    { id: 'P1', name: 'سرویس پشتیبانی طلایی', price: 10000000 },
    { id: 'P2', name: 'سرویس پشتیبانی نقره‌ای', price: 5000000 },
    { id: 'P3', name: 'لایسنس تک کاربره', price: 2000000 },
];
const mockQuotes: Quote[] = [
    { id: 'Q-123', customerId: 'C1', customerName: 'شرکت آلفا', issueDate: '1403/05/01', expiryDate: '1403/05/15', status: 'تایید شده', items: [{ productId: 'P1', productName: 'سرویس پشتیبانی طلایی', quantity: 1, unitPrice: 10000000, discount: 10, tax: 9, total: 9000000 }], subtotal: 10000000, discountAmount: 1000000, taxAmount: 810000, totalAmount: 9810000 },
    { id: 'Q-124', customerId: 'C2', customerName: 'تجارت بتا', issueDate: '1403/04/25', expiryDate: '1403/05/10', status: 'ارسال شده', items: [{ productId: 'P2', productName: 'سرویس پشتیبانی نقره‌ای', quantity: 2, unitPrice: 5000000, discount: 0, tax: 9, total: 10000000 }], subtotal: 10000000, discountAmount: 0, taxAmount: 900000, totalAmount: 10900000 },
];


interface QuotesProps {
    customers: Customer[];
    onCreateInvoiceFromQuote: (quoteId: string, customerId: string) => void;
}

const Quotes: React.FC<QuotesProps> = ({ customers, onCreateInvoiceFromQuote }) => {
    const [view, setView] = useState<{ action: 'list' | 'create' | 'edit', entityId?: string }>({ action: 'list' });
    
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
    const [products, setProducts] = useState<Product[]>(mockProducts);

    const handleSaveQuote = (quote: Omit<Quote, 'id'> | Quote) => {
        const isEditing = 'id' in quote;
        if (isEditing) {
            setQuotes(quotes.map(q => q.id === quote.id ? quote as Quote : q));
        } else {
            const newQuote: Quote = {
                id: `Q-${Date.now()}`,
                ...(quote as Omit<Quote, 'id'>)
            };
            setQuotes(prev => [...prev, newQuote]);
        }
        handleCancel();
    };

    const handleEdit = (quote: Quote) => setView({ action: 'edit', entityId: quote.id });
    const handleCreate = () => setView({ action: 'create' });
    const handleCancel = () => setView({ action: 'list' });
    
    if (view.action === 'list') {
        return <QuotationsList
            quotes={quotes}
            onCreateNew={handleCreate}
            onEdit={handleEdit}
            onCreateInvoiceFromQuote={(quote) => onCreateInvoiceFromQuote(quote.id, quote.customerId)}
        />;
    }

    const editingQuote = view.action === 'edit' ? quotes.find(q => q.id === view.entityId) : undefined;
    return <QuoteEditor
        key={view.entityId || 'create'}
        quoteData={editingQuote}
        customers={customers}
        products={products}
        onSave={handleSaveQuote}
        onCancel={handleCancel}
        onCreateInvoiceFromQuote={(quote) => onCreateInvoiceFromQuote(quote.id, quote.customerId)}
    />;
};

export default Quotes;