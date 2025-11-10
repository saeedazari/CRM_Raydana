import React, { useState } from 'react';
import QuotationsList from '../sales/QuotationsList';
import QuoteEditor from '../sales/QuoteEditor';
import { Quote, Customer, Product } from '../../types';

interface QuotesProps {
    quotes: Quote[];
    customers: Customer[];
    products: Product[];
    onAddQuote: (quote: Omit<Quote, 'id'>) => void;
    onUpdateQuote: (quote: Quote) => void;
    onCreateInvoiceFromQuote: (quote: Quote) => void;
}

const Quotes: React.FC<QuotesProps> = (props) => {
    const [view, setView] = useState<{ action: 'list' | 'create' | 'edit', entityId?: string }>({ action: 'list' });

    const handleEdit = (quote: Quote) => {
        setView({ action: 'edit', entityId: quote.id });
    };
    const handleCreate = () => {
        setView({ action: 'create' });
    };
    const handleCancel = () => {
        setView({ action: 'list' });
    };

    if (view.action === 'list') {
        return <QuotationsList
            quotes={props.quotes}
            onCreateNew={handleCreate}
            onEdit={handleEdit}
            onCreateInvoiceFromQuote={props.onCreateInvoiceFromQuote}
        />;
    }

    const editingQuote = view.action === 'edit' ? props.quotes.find(q => q.id === view.entityId) : undefined;
    return <QuoteEditor
        key={view.entityId || 'create'}
        quoteData={editingQuote}
        customers={props.customers}
        products={props.products}
        onSave={(quote) => {
            if ('id' in quote) {
                props.onUpdateQuote(quote as Quote);
            } else {
                props.onAddQuote(quote as Omit<Quote, 'id'>);
            }
            handleCancel();
        }}
        onCancel={handleCancel}
        onCreateInvoiceFromQuote={props.onCreateInvoiceFromQuote}
    />;
};

export default Quotes;
