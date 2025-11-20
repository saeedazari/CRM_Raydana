// FIX: Import 'useMemo' from React to resolve 'Cannot find name' error.
import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, InvoiceItem, Product, Customer, Quote } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

const initialInvoiceState: Omit<Invoice, 'id'> = {
    customerId: '',
    customerName: '',
    issueDate: new Date().toLocaleDateString('fa-IR-u-nu-latn'),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('fa-IR-u-nu-latn'),
    status: 'پیش‌نویس',
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
};

const InvoiceEditor: React.FC<{
    invoiceData?: Invoice;
    prefillData?: any;
    quotes: Quote[];
    customers: Customer[];
    products: Product[];
    onSave: (invoice: Omit<Invoice, 'id'> | Invoice) => void;
    onCancel: () => void;
}> = ({ invoiceData, prefillData, quotes, customers, products, onSave, onCancel }) => {
    
    const getInitialState = () => {
        if (invoiceData) return invoiceData;
        if (prefillData) {
            const customer = customers.find(c => c.id === prefillData.customerId)
            return {
                ...initialInvoiceState,
                ...prefillData,
                customerName: customer?.name || ''
            };
        }
        return initialInvoiceState;
    }

    const [invoice, setInvoice] = useState(getInitialState());
    const [items, setItems] = useState<InvoiceItem[]>(getInitialState().items || []);
    const [quoteToLoad, setQuoteToLoad] = useState<string>(prefillData?.quoteId || '');
    const approvedQuotes = useMemo(() => quotes.filter(q => q.status === 'تایید شده'), [quotes]);
    
    useEffect(() => {
        // If prefillData exists, load from quote automatically
        if (prefillData?.quoteId) {
            handleLoadFromQuote(prefillData.quoteId);
        }
    }, [prefillData]);

    useEffect(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.discount / 100)), 0);
        const taxAmount = items.reduce((sum, item) => {
            const itemTotalAfterDiscount = (item.quantity * item.unitPrice) * (1 - item.discount / 100);
            return sum + (itemTotalAfterDiscount * (item.tax / 100));
        }, 0);
        const totalAmount = subtotal - discountAmount + taxAmount;

        setInvoice(inv => ({ ...inv, items, subtotal, discountAmount, taxAmount, totalAmount }));
    }, [items]);

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        const numericValue = parseFloat(value) || 0;

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                item.productName = product.name;
                item.unitPrice = product.price;
            }
             item.productId = value;
        } else {
             (item[field] as any) = numericValue;
        }
        
        item.total = (item.quantity * item.unitPrice) * (1 - item.discount / 100);
        newItems[index] = item;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, tax: 0, total: 0 }]);
    };
    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        setInvoice(inv => ({ ...inv, customerId, customerName: customer?.name || '' }));
    };

    const handleLoadFromQuote = (idToLoad: string) => {
        const selectedQuote = quotes.find(q => q.id === idToLoad);
        if (selectedQuote) {
            const customer = customers.find(c => c.id === selectedQuote.customerId);
            const invoiceFromQuote = {
                ...initialInvoiceState,
                quoteId: selectedQuote.id,
                customerId: selectedQuote.customerId,
                customerName: customer?.name || '',
                items: selectedQuote.items,
                subtotal: selectedQuote.subtotal,
                discountAmount: selectedQuote.discountAmount,
                taxAmount: selectedQuote.taxAmount,
                totalAmount: selectedQuote.totalAmount,
            };
            setInvoice(invoiceFromQuote);
            setItems(invoiceFromQuote.items);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-4">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">{ 'id' in invoice ? `ویرایش فاکتور ${invoice.id}` : 'ایجاد فاکتور جدید'}</h2>
                </div>
                <button onClick={() => onSave(invoice)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">ذخیره</button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                <div className="mb-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap items-center gap-4">
                    <label className="text-sm font-medium flex-shrink-0">ایجاد از روی پیش‌فاکتور:</label>
                    <select value={quoteToLoad} onChange={e => setQuoteToLoad(e.target.value)} className="flex-grow p-2 bg-white border rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">انتخاب پیش‌فاکتور تایید شده...</option>
                        {approvedQuotes.map(q => <option key={q.id} value={q.id}>{q.id} - {q.customerName}</option>)}
                    </select>
                    <button onClick={() => handleLoadFromQuote(quoteToLoad)} disabled={!quoteToLoad} className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">بارگذاری</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">مشتری</label>
                        <select value={invoice.customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" required>
                            <option value="">انتخاب کنید...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ صدور</label>
                        <input type="text" value={invoice.issueDate} placeholder="مثلا: 1403/05/01" onChange={e => setInvoice({...invoice, issueDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ سررسید</label>
                        <input type="text" value={invoice.dueDate} placeholder="مثلا: 1403/06/01" onChange={e => setInvoice({...invoice, dueDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        {/* Table Header */}
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-2 text-right w-2/5">محصول</th>
                                <th className="p-2 text-center w-1/12">تعداد</th>
                                <th className="p-2 text-center">قیمت واحد</th>
                                <th className="p-2 text-center">تخفیف (%)</th>
                                <th className="p-2 text-center">مالیات (%)</th>
                                <th className="p-2 text-left">مبلغ کل</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="p-1"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"><option value="">انتخاب محصول</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                    <td className="p-1"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} min="1" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" /></td>
                                    <td className="p-1"><input type="text" value={item.unitPrice.toLocaleString('fa-IR')} className="w-full p-2 text-center bg-gray-100 border rounded-lg text-gray-900 dark:bg-gray-600 dark:text-white" readOnly /></td>
                                    <td className="p-1"><input type="number" value={item.discount} onChange={e => handleItemChange(index, 'discount', e.target.value)} min="0" max="100" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" /></td>
                                    <td className="p-1"><input type="number" value={item.tax} onChange={e => handleItemChange(index, 'tax', e.target.value)} min="0" max="100" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" /></td>
                                    <td className="p-1 text-left font-semibold text-gray-900 dark:text-white">{item.total.toLocaleString('fa-IR')}</td>
                                    <td className="p-1 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={handleAddItem} className="mt-4 text-sm text-indigo-600 font-medium">+ افزودن آیتم جدید</button>
                </div>
                {/* Totals */}
                <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between"><span>جمع کل (قبل از تخفیف):</span><span>{invoice.subtotal?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between text-red-600"><span>مبلغ تخفیف:</span><span>- {invoice.discountAmount?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between text-green-600"><span>مالیات بر ارزش افزوده:</span><span>+ {invoice.taxAmount?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between font-bold text-lg border-t dark:border-gray-600 pt-2 mt-2"><span>مبلغ نهایی:</span><span>{invoice.totalAmount?.toLocaleString('fa-IR')} تومان</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceEditor;