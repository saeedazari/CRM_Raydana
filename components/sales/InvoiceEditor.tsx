
import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, InvoiceItem, Product, Customer, Quote, CompanyInfo } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { PrinterIcon } from '../icons/PrinterIcon';
import PrintableDocument from '../print/PrintableDocument';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toShamsi, toPersianDigits, toEnglishDigits } from '../../utils/date';

const initialInvoiceState: Omit<Invoice, 'id'> = {
    customerId: '',
    customerName: '',
    issueDate: toShamsi(new Date()),
    status: 'پیش‌نویس',
    isOfficial: false,
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    note: '',
};

const InvoiceEditor: React.FC<{
    invoiceData?: Invoice;
    prefillData?: any;
    quotes: Quote[];
    customers: Customer[];
    products: Product[];
    onSave: (invoice: Omit<Invoice, 'id'> | Invoice) => void;
    onCancel: () => void;
    companyInfo: CompanyInfo;
    noteTemplates: string[];
    setNoteTemplates: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ invoiceData, prefillData, quotes, customers, products, onSave, onCancel, companyInfo, noteTemplates, setNoteTemplates }) => {
    
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
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    
    const approvedQuotes = useMemo(() => quotes.filter(q => q.status === 'تایید شده'), [quotes]);
    
    useEffect(() => {
        if (prefillData?.quoteId) {
            handleLoadFromQuote(prefillData.quoteId);
        }
    }, [prefillData]);

    // Calculate Grand Totals whenever items change
    useEffect(() => {
        const newSubtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const newDiscountAmount = items.reduce((sum, item) => sum + ((item.totalPrice || 0) - (item.totalAfterDiscount || 0)), 0);
        const newTaxAmount = items.reduce((sum, item) => sum + ((item.totalAfterDiscount || 0) * (item.tax / 100)), 0);
        const newTotalAmount = newSubtotal - newDiscountAmount + newTaxAmount;

        setInvoice(inv => ({
            ...inv,
            items: items, // Update reference
            subtotal: newSubtotal,
            discountAmount: newDiscountAmount,
            taxAmount: newTaxAmount,
            totalAmount: newTotalAmount
        }));
    }, [items]);

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                item.productName = product.name;
                item.unitPrice = product.price;
                // Auto-fill tax based on official status
                item.tax = invoice.isOfficial ? (product.tax || 0) : 0;
            }
             item.productId = value;
        } else if (field === 'discountType') {
            item.discountType = value as 'percent' | 'amount';
        } else {
             const englishValue = typeof value === 'string' ? toEnglishDigits(value) : value;
             const numericValue = parseFloat(englishValue);
             (item[field] as any) = isNaN(numericValue) ? 0 : numericValue;
        }
        
        // --- Perform Row Calculations Immediately ---
        const qty = item.quantity || 0;
        const unitPrice = item.unitPrice || 0;
        const totalPrice = qty * unitPrice;
        
        let itemDiscount = 0;
        if (item.discountType === 'percent') {
            itemDiscount = totalPrice * ((item.discount || 0) / 100);
        } else {
            itemDiscount = item.discount || 0;
        }
        
        const totalAfterDiscount = totalPrice - itemDiscount;
        const itemTax = totalAfterDiscount * ((item.tax || 0) / 100);
        const totalWithTax = totalAfterDiscount + itemTax;

        // Update calculated fields
        item.totalPrice = totalPrice;
        item.totalAfterDiscount = totalAfterDiscount;
        item.totalWithTax = totalWithTax;

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
                isOfficial: selectedQuote.isOfficial || false, // Inherit official status
                items: selectedQuote.items, 
                subtotal: selectedQuote.subtotal,
                discountAmount: selectedQuote.discountAmount,
                taxAmount: selectedQuote.taxAmount,
                totalAmount: selectedQuote.totalAmount,
                note: selectedQuote.note,
            };
            setInvoice(invoiceFromQuote);
            setItems(invoiceFromQuote.items);
        }
    };

    const handleAddTemplate = () => {
        if (invoice.note && !noteTemplates.includes(invoice.note)) {
            setNoteTemplates(prev => [...prev, invoice.note!]);
            alert('به لیست قالب‌ها اضافه شد.');
        }
    };
    
    const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedTemplate(val);
        if (val) {
            setInvoice(prev => ({ ...prev, note: val }));
        }
    };

    const handleIsOfficialChange = (checked: boolean) => {
        setInvoice(prev => ({ ...prev, isOfficial: checked }));
        
        // Update tax for all existing items based on official status
        const updatedItems = items.map(item => {
            const product = products.find(p => p.id === item.productId);
            const newTax = checked ? (product?.tax || 0) : 0;
            
            // Recalculate row totals
            const qty = item.quantity || 0;
            const unitPrice = item.unitPrice || 0;
            const totalPrice = qty * unitPrice;
            
            let itemDiscount = 0;
            if (item.discountType === 'percent') {
                itemDiscount = totalPrice * ((item.discount || 0) / 100);
            } else {
                itemDiscount = item.discount || 0;
            }
            
            const totalAfterDiscount = totalPrice - itemDiscount;
            const itemTax = totalAfterDiscount * (newTax / 100);
            const totalWithTax = totalAfterDiscount + itemTax;

            return {
                ...item,
                tax: newTax,
                totalPrice,
                totalAfterDiscount,
                totalWithTax
            };
        });
        setItems(updatedItems);
    };

    return (
        <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-wrap gap-2">
                <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-2 md:ml-4 flex-shrink-0">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <div className="overflow-hidden">
                        <h2 className="text-lg md:text-xl font-bold truncate">{ 'id' in invoice ? `ویرایش فاکتور ${invoice.id}` : 'ایجاد فاکتور جدید'}</h2>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <label className="flex items-center gap-2 ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={invoice.isOfficial} 
                            onChange={e => handleIsOfficialChange(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        رسمی
                    </label>
                    {('id' in invoice) && (
                        <button onClick={() => setIsPrintOpen(true)} className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 text-sm">
                            <PrinterIcon className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                            چاپ
                        </button>
                    )}
                    <button onClick={() => onSave(invoice)} className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">ذخیره</button>
                </div>
            </div>
            <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6">
                <div className="mb-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="text-sm font-medium flex-shrink-0">ایجاد از روی پیش‌فاکتور:</label>
                    <select value={quoteToLoad} onChange={e => setQuoteToLoad(e.target.value)} className="w-full sm:flex-grow p-2 bg-white border rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">انتخاب پیش‌فاکتور تایید شده...</option>
                        {approvedQuotes.map(q => <option key={q.id} value={q.id}>#{q.quoteNumber} (Ver {q.version}) - {q.customerName}</option>)}
                    </select>
                    <button onClick={() => handleLoadFromQuote(quoteToLoad)} disabled={!quoteToLoad} className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">بارگذاری</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 border rounded-lg dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">مشتری</label>
                        <select value={invoice.customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" required>
                            <option value="">انتخاب کنید...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ صدور</label>
                        <DatePicker 
                            value={invoice.issueDate}
                            onChange={(date) => setInvoice({...invoice, issueDate: date?.toString() || ''})}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
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
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b dark:border-gray-700">
                                        <td className="p-1"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px]"><option value="">انتخاب محصول</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                        <td className="p-1">
                                            <input 
                                                type="text" 
                                                value={toPersianDigits(item.quantity)} 
                                                onChange={e => handleItemChange(index, 'quantity', e.target.value)} 
                                                className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" 
                                            />
                                        </td>
                                        <td className="p-1">
                                            <input 
                                                type="text" 
                                                value={toPersianDigits(item.unitPrice)} 
                                                onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} 
                                                className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white min-w-[80px]" 
                                            />
                                        </td>
                                        <td className="p-1">
                                            <input type="text" value={item.totalPrice.toLocaleString('fa-IR')} readOnly className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white cursor-default focus:outline-none" />
                                        </td>
                                        <td className="p-1">
                                            <div className="flex items-center">
                                                <input 
                                                    type="text" 
                                                    value={toPersianDigits(item.discount)} 
                                                    onChange={e => handleItemChange(index, 'discount', e.target.value)} 
                                                    className="w-full p-2 text-center bg-gray-50 border rounded-r-lg rounded-l-none text-gray-900 dark:bg-gray-700 dark:text-white focus:z-10 min-w-[60px]" 
                                                />
                                                <select 
                                                    value={item.discountType} 
                                                    onChange={e => handleItemChange(index, 'discountType', e.target.value)}
                                                    className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white border border-r-0 rounded-l-lg rounded-r-none text-xs focus:z-10"
                                                >
                                                    <option value="percent">%</option>
                                                    <option value="amount">$</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-1">
                                            <input type="text" value={item.totalAfterDiscount.toLocaleString('fa-IR')} readOnly className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white cursor-default focus:outline-none" />
                                        </td>
                                        <td className="p-1">
                                            <input 
                                                type="text" 
                                                value={toPersianDigits(item.tax)} 
                                                onChange={e => handleItemChange(index, 'tax', e.target.value)} 
                                                className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" 
                                            />
                                        </td>
                                        <td className="p-1">
                                            <input type="text" value={item.totalWithTax.toLocaleString('fa-IR')} readOnly className="w-full p-2 text-left font-bold bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white cursor-default focus:outline-none" />
                                        </td>
                                        <td className="p-1 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
                        <button type="button" onClick={handleAddItem} className="text-sm text-indigo-600 font-medium px-2 py-1">+ افزودن آیتم جدید</button>
                    </div>
                </div>
                
                <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-grow max-w-2xl">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">توضیحات و شرایط</label>
                            <div className="flex gap-2 mb-2 flex-wrap">
                                <select 
                                    value={selectedTemplate} 
                                    onChange={handleTemplateSelect} 
                                    className="flex-grow p-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">-- انتخاب از قالب‌ها --</option>
                                    {noteTemplates.map((tmpl, idx) => (
                                        <option key={idx} value={tmpl}>{tmpl.substring(0, 60)}...</option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    onClick={handleAddTemplate} 
                                    className="px-3 py-2 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 whitespace-nowrap"
                                >
                                    ذخیره به عنوان قالب
                                </button>
                            </div>
                            <textarea 
                                value={invoice.note || ''} 
                                onChange={e => setInvoice({...invoice, note: e.target.value})} 
                                rows={4} 
                                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                placeholder="توضیحات تکمیلی، شرایط پرداخت، شماره حساب و..."
                            ></textarea>
                        </div>
                        <div className="w-full max-w-sm space-y-2 text-sm self-end">
                            <div className="flex justify-between"><span>جمع کل (قبل از تخفیف):</span><span>{invoice.subtotal?.toLocaleString('fa-IR')} تومان</span></div>
                            <div className="flex justify-between text-red-600"><span>مبلغ تخفیف:</span><span>- {invoice.discountAmount?.toLocaleString('fa-IR')} تومان</span></div>
                            <div className="flex justify-between text-green-600"><span>مالیات بر ارزش افزوده:</span><span>+ {invoice.taxAmount?.toLocaleString('fa-IR')} تومان</span></div>
                            <div className="flex justify-between font-bold text-lg border-t dark:border-gray-600 pt-2 mt-2"><span>مبلغ نهایی:</span><span>{invoice.totalAmount?.toLocaleString('fa-IR')} تومان</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {('id' in invoice) && (
             <PrintableDocument 
                isOpen={isPrintOpen} 
                onClose={() => setIsPrintOpen(false)} 
                type="invoice" 
                data={invoice as Invoice} 
                companyInfo={companyInfo}
            />
        )}
        </>
    );
};

export default InvoiceEditor;
