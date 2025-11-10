import React, { useState, useEffect } from 'react';
import { Quote, QuoteItem, Product, Customer, QuoteStatus } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';

const initialQuoteState: Omit<Quote, 'id'> = {
    customerId: '',
    customerName: '',
    issueDate: new Date().toLocaleDateString('fa-IR-u-nu-latn'),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('fa-IR-u-nu-latn'),
    status: 'پیش‌نویس',
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
};


const QuoteEditor: React.FC<{
    quoteData?: Quote;
    customers: Customer[];
    products: Product[];
    onSave: (quote: Omit<Quote, 'id'> | Quote) => void;
    onCancel: () => void;
    onCreateInvoiceFromQuote: (quote: Quote) => void;
}> = ({ quoteData, customers, products, onSave, onCancel, onCreateInvoiceFromQuote }) => {
    const [quote, setQuote] = useState(quoteData || initialQuoteState);
    const [items, setItems] = useState<QuoteItem[]>(quoteData?.items || []);
    
    useEffect(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.discount / 100)), 0);
        const taxAmount = items.reduce((sum, item) => {
            const itemTotalAfterDiscount = (item.quantity * item.unitPrice) * (1 - item.discount / 100);
            return sum + (itemTotalAfterDiscount * (item.tax / 100));
        }, 0);
        const totalAmount = subtotal - discountAmount + taxAmount;

        setQuote(q => ({ ...q, items, subtotal, discountAmount, taxAmount, totalAmount }));
    }, [items]);
    
    const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
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
        setQuote(q => ({ ...q, customerId, customerName: customer?.companyName || '' }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-wrap gap-2">
                <div className="flex items-center">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-4">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">{ 'id' in quote ? `ویرایش پیش‌فاکتور ${quote.id}` : 'ایجاد پیش‌فاکتور جدید'}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {quoteData?.status === 'تایید شده' && (
                        <button onClick={() => onCreateInvoiceFromQuote(quoteData)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <DocumentDuplicateIcon className="w-5 h-5 ml-2" />
                            ایجاد فاکتور
                        </button>
                    )}
                    <button onClick={() => onSave(quote)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">ذخیره</button>
                </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 border rounded-lg dark:border-gray-700">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">مشتری</label>
                        <select value={quote.customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required>
                            <option value="">انتخاب کنید...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ صدور</label>
                        <input type="text" value={quote.issueDate} onChange={e => setQuote({...quote, issueDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ انقضا</label>
                        <input type="text" value={quote.expiryDate} onChange={e => setQuote({...quote, expiryDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
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
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="p-1"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 bg-gray-50 border rounded-lg dark:bg-gray-700"><option value="">انتخاب محصول</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                    <td className="p-1"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} min="1" className="w-full p-2 text-center bg-gray-50 border rounded-lg dark:bg-gray-700" /></td>
                                    <td className="p-1"><input type="text" value={item.unitPrice.toLocaleString('fa-IR')} className="w-full p-2 text-center bg-gray-100 border rounded-lg dark:bg-gray-600" readOnly /></td>
                                    <td className="p-1"><input type="number" value={item.discount} onChange={e => handleItemChange(index, 'discount', e.target.value)} min="0" max="100" className="w-full p-2 text-center bg-gray-50 border rounded-lg dark:bg-gray-700" /></td>
                                    <td className="p-1"><input type="number" value={item.tax} onChange={e => handleItemChange(index, 'tax', e.target.value)} min="0" max="100" className="w-full p-2 text-center bg-gray-50 border rounded-lg dark:bg-gray-700" /></td>
                                    <td className="p-1 text-left font-semibold">{item.total.toLocaleString('fa-IR')}</td>
                                    <td className="p-1 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={handleAddItem} className="mt-4 text-sm text-indigo-600 font-medium">+ افزودن آیتم جدید</button>
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between"><span>جمع کل (قبل از تخفیف):</span><span>{quote.subtotal?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between text-red-600"><span>مبلغ تخفیف:</span><span>- {quote.discountAmount?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between text-green-600"><span>مالیات بر ارزش افزوده:</span><span>+ {quote.taxAmount?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between font-bold text-lg border-t dark:border-gray-600 pt-2 mt-2"><span>مبلغ نهایی:</span><span>{quote.totalAmount?.toLocaleString('fa-IR')} تومان</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteEditor;
