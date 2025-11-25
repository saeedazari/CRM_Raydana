



import React, { useState, useEffect } from 'react';
import QuotationsList from '../sales/QuotationsList';
import QuoteEditor from '../sales/QuoteEditor';
import { Quote, Customer, Product, CompanyInfo } from '../../types';

interface QuotesProps {
    customers: Customer[];
    onCreateInvoiceFromQuote: (quoteId: string, customerId: string) => void;
    quotes: Quote[];
    setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
    initialParams?: any;
    companyInfo: CompanyInfo;
    products: Product[];
    noteTemplates: string[];
    setNoteTemplates: React.Dispatch<React.SetStateAction<string[]>>;
}

const Quotes: React.FC<QuotesProps> = ({ customers, onCreateInvoiceFromQuote, quotes, setQuotes, initialParams, companyInfo, products, noteTemplates, setNoteTemplates }) => {
    const [view, setView] = useState<{ action: 'list' | 'create' | 'edit', entityId?: string }>({ action: 'list' });
    
    useEffect(() => {
        if (initialParams?.action) {
          setView({
            action: initialParams.action,
            entityId: initialParams.entityId,
          });
        }
    }, [initialParams]);

    const handleSaveQuote = (quote: Omit<Quote, 'id'> | Quote) => {
        const isEditing = 'id' in quote;
        
        if (isEditing) {
            // Logic for Versioning:
            // Instead of updating, we create a NEW quote with same quoteNumber but incremented version
            const currentQuote = quote as Quote;
            const newQuote: Quote = {
                ...currentQuote,
                id: `Q-${Date.now()}`, // New ID
                version: currentQuote.version + 1, // Increment Version
            };
            setQuotes(prev => [...prev, newQuote]);
        } else {
            // New Quote
            const quoteNumber = `100${quotes.length + 1}`; // Simple generation
            const newQuote: Quote = {
                id: `Q-${Date.now()}`,
                quoteNumber: quoteNumber,
                version: 1,
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
            companyInfo={companyInfo}
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
        companyInfo={companyInfo}
        noteTemplates={noteTemplates}
        setNoteTemplates={setNoteTemplates}
    />;
};

export default Quotes;
