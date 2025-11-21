
import React, { useState, useEffect } from 'react';
import { Quote, QuoteItem, Product, Customer, QuoteStatus, CompanyInfo } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';
import { PrinterIcon } from '../icons/PrinterIcon';
import PrintableDocument from '../print/PrintableDocument';

const initialQuoteState: Omit<Quote, 'id'> = {
    quoteNumber: '',
    version: 1,
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
    companyInfo: CompanyInfo;
}> = ({ quoteData, customers, products, onSave, onCancel, onCreateInvoiceFromQuote, companyInfo }) => {
    const [quote, setQuote] = useState(quoteData || initialQuoteState);
    const [items, setItems] = useState<QuoteItem[]>(quoteData?.items || []);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [initialQuoteSnapshot, setInitialQuoteSnapshot] = useState<string>('');

    // Capture initial state for comparison
    useEffect(() => {
        setInitialQuoteSnapshot(JSON.stringify(quoteData || initialQuoteState));
    }, []); // Run once on mount
    
    useEffect(() => {
        // Recalculate totals whenever items change
        let newSubtotal = 0;
        let newDiscountAmount = 0;
        let newTaxAmount = 0;

        const updatedItems = items.map(item => {
            const totalPrice = item.quantity * item.unitPrice;
            let itemDiscount = 0;
            if (item.discountType === 'percent') {
                itemDiscount = totalPrice * (item.discount / 100);
            } else {
                itemDiscount = item.discount;
            }
            const totalAfterDiscount = totalPrice - itemDiscount;
            const itemTax = totalAfterDiscount * (item.tax / 100);
            const totalWithTax = totalAfterDiscount + itemTax;

            newSubtotal += totalPrice;
            newDiscountAmount += itemDiscount;
            newTaxAmount += itemTax;

            return {
                ...item,
                totalPrice,
                totalAfterDiscount,
                totalWithTax
            };
        });

        // Only update state if values actually change to avoid infinite loop, 
        // but here we rely on `items` change trigger.
        // We need to update the parent quote object's summary fields
        setQuote(q => ({
            ...q,
            items: updatedItems,
            subtotal: newSubtotal,
            discountAmount: newDiscountAmount,
            taxAmount: newTaxAmount,
            totalAmount: newSubtotal - newDiscountAmount + newTaxAmount
        }));
    }, [items]); // Logic runs when 'items' structural changes or quantity/price/etc inside them changes (if reference changes)

    // Need a separate handler to update specific item fields without triggering full re-calc loop prematurely
    const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                item.productName = product.name;
                item.unitPrice = product.price;
            }
             item.productId = value;
        } else if (field === 'discountType') {
            item.discountType = value as 'percent' | 'amount';
        } else {
             const numericValue = parseFloat(value);
             (item[field] as any) = isNaN(numericValue) ? 0 : numericValue;
        }
        
        newItems[index] = item;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { 
            productId: '', 
            productName: '', 
            quantity: 1, 
            unitPrice: 0, 
            totalPrice: 0,
            discountType: 'percent',
            discount: 0, 
            totalAfterDiscount: 0,
            tax: 0, 
            totalWithTax: 0
        }]);
    };
    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        setQuote(q => ({ ...q, customerId, customerName: customer?.name || '' }));
    };

    const handleSaveClick = () => {
        const currentSnapshot = JSON.stringify(quote);
        if (currentSnapshot === initialQuoteSnapshot) {
            alert("هیچ تغییری اعمال نشده است. نسخه جدید ایجاد نمی‌شود.");
            return;
        }
        onSave(quote);
    };

    const isQuoteApproved = quoteData?.status === 'تایید شده';

    return (
        <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-wrap gap-2">
                <div className="flex items-center">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-4">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">
                            { 'id' in quote ? `ویرایش پیش‌فاکتور` : 'ایجاد پیش‌فاکتور جدید'}
                        </h2>
                        {'id' in quote && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                شماره: {quote.quoteNumber} | نسخه: {quote.version}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {('id' in quote) && (
                        <button onClick={() => setIsPrintOpen(true)} className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                            <PrinterIcon className="w-5 h-5 ml-2" />
                            چاپ
                        </button>
                    )}
                    {quoteData?.status === 'تایید شده' && (
                        <button onClick={() => onCreateInvoiceFromQuote(quoteData)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <DocumentDuplicateIcon className="w-5 h-5 ml-2" />
                            ایجاد فاکتور
                        </button>
                    )}
                    
                    {!isQuoteApproved ? (
                        <button onClick={handleSaveClick} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            {'id' in quote ? 'ثبت نسخه جدید' : 'ذخیره'}
                        </button>
                    ) : (
                        <div className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                            این پیش‌فاکتور تایید شده و قابل ویرایش نیست.
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 border rounded-lg dark:border-gray-700">
                    <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-sm font-medium mb-1">مشتری</label>
                        <select value={quote.customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" required disabled={isQuoteApproved}>
                            <option value="">انتخاب کنید...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ صدور</label>
                        <input type="text" value={quote.issueDate} placeholder="مثلا: 1403/05/01" onChange={e => setQuote({...quote, issueDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" disabled={isQuoteApproved} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ انقضا</label>
                        <input type="text" value={quote.expiryDate} placeholder="مثلا: 1403/05/15" onChange={e => setQuote({...quote, expiryDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" disabled={isQuoteApproved} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">وضعیت</label>
                        <select value={quote.status} onChange={e => setQuote({...quote, status: e.target.value as QuoteStatus})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" required disabled={isQuoteApproved}>
                            <option value="پیش‌نویس">پیش‌نویس</option>
                            <option value="ارسال شده">ارسال شده</option>
                            <option value="تایید شده">تایید شده</option>
                            <option value="رد شده">رد شده</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-2 text-right w-[20%]">محصول</th>
                                <th className="p-2 text-center w-[8%]">تعداد</th>
                                <th className="p-2 text-center w-[12%]">قیمت واحد</th>
                                <th className="p-2 text-center w-[12%]">قیمت کل</th>
                                <th className="p-2 text-center w-[15%]">تخفیف</th>
                                <th className="p-2 text-center w-[12%]">پس از تخفیف</th>
                                <th className="p-2 text-center w-[8%]">مالیات (%)</th>
                                <th className="p-2 text-left w-[13%]">مبلغ نهایی</th>
                                <th className="p-2 w-[5%]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quote.items.map((item, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="p-1"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" disabled={isQuoteApproved}><option value="">انتخاب محصول</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                    <td className="p-1"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} min="1" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" disabled={isQuoteApproved} /></td>
                                    <td className="p-1"><input type="text" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" disabled={isQuoteApproved} /></td>
                                    <td className="p-1">
                                        <input type="text" value={item.totalPrice.toLocaleString('fa-IR')} readOnly className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white cursor-default focus:outline-none" />
                                    </td>
                                    <td className="p-1">
                                        <div className="flex items-center">
                                            <input 
                                                type="number" 
                                                value={item.discount} 
                                                onChange={e => handleItemChange(index, 'discount', e.target.value)} 
                                                min="0" 
                                                className="w-full p-2 text-center bg-gray-50 border rounded-r-lg rounded-l-none text-gray-900 dark:bg-gray-700 dark:text-white focus:z-10" 
                                                disabled={isQuoteApproved} 
                                            />
                                            <select 
                                                value={item.discountType} 
                                                onChange={e => handleItemChange(index, 'discountType', e.target.value)}
                                                className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white border border-r-0 rounded-l-lg rounded-r-none text-xs focus:z-10"
                                                disabled={isQuoteApproved}
                                            >
                                                <option value="percent">%</option>
                                                <option value="amount">$</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="p-1">
                                        <input type="text" value={item.totalAfterDiscount.toLocaleString('fa-IR')} readOnly className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white cursor-default focus:outline-none" />
                                    </td>
                                    <td className="p-1"><input type="number" value={item.tax} onChange={e => handleItemChange(index, 'tax', e.target.value)} min="0" max="100" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" disabled={isQuoteApproved} /></td>
                                    <td className="p-1">
                                        <input type="text" value={item.totalWithTax.toLocaleString('fa-IR')} readOnly className="w-full p-2 text-left font-bold bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white cursor-default focus:outline-none" />
                                    </td>
                                    <td className="p-1 text-center">
                                        {!isQuoteApproved && <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isQuoteApproved && <button type="button" onClick={handleAddItem} className="mt-4 text-sm text-indigo-600 font-medium">+ افزودن آیتم جدید</button>}
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
        {('id' in quote) && (
             <PrintableDocument 
                isOpen={isPrintOpen} 
                onClose={() => setIsPrintOpen(false)} 
                type="quote" 
                data={quote as Quote} 
                companyInfo={companyInfo}
            />
        )}
        </>
    );
};

export default QuoteEditor;
