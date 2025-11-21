
import React, { useState, useEffect } from 'react';
import { PurchaseOrder, QuoteItem, Product, Vendor, PurchaseOrderStatus, CompanyInfo } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { PrinterIcon } from '../icons/PrinterIcon';
import PrintableDocument from '../print/PrintableDocument';

const initialPOState: Omit<PurchaseOrder, 'id'> = {
    vendorId: '',
    vendorName: '',
    issueDate: new Date().toLocaleDateString('fa-IR-u-nu-latn'),
    status: 'پیش‌نویس',
    items: [],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    amountPaid: 0
};

interface PurchaseOrderEditorProps {
    poData?: PurchaseOrder;
    vendors: Vendor[];
    products: Product[]; // Using products as a base for items, though vendor items might differ
    onSave: (po: Omit<PurchaseOrder, 'id'> | PurchaseOrder) => void;
    onCancel: () => void;
    companyInfo: CompanyInfo;
}

const PurchaseOrderEditor: React.FC<PurchaseOrderEditorProps> = ({ poData, vendors, products, onSave, onCancel, companyInfo }) => {
    const [po, setPo] = useState(poData || initialPOState);
    const [items, setItems] = useState<QuoteItem[]>(poData?.items || []);
    const [isPrintOpen, setIsPrintOpen] = useState(false);

    useEffect(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        // Calculate tax but assume no discount on POs for simplicity, or add discount field if needed
        const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.tax / 100)), 0);
        const totalAmount = subtotal + taxAmount;

        setPo(p => ({ ...p, items, subtotal, taxAmount, totalAmount }));
    }, [items]);

    const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        const numericValue = parseFloat(value) || 0;

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                item.productName = product.name;
                // In real app, price might come from vendor pricelist
                item.unitPrice = product.price * 0.8; // Assuming buy price is 80% of sell price
            }
            item.productId = value;
        } else {
            (item[field] as any) = numericValue;
        }

        item.total = (item.quantity * item.unitPrice); // + tax calculated in global effect
        newItems[index] = item;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, tax: 0, total: 0 }]);
    };
    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleVendorChange = (vendorId: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        setPo(p => ({ ...p, vendorId, vendorName: vendor?.name || '' }));
    };

    return (
        <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-4">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">{ 'id' in po ? `ویرایش سفارش خرید ${po.id}` : 'ایجاد سفارش خرید جدید'}</h2>
                </div>
                <div className="flex items-center gap-2">
                     {('id' in po) && (
                        <button onClick={() => setIsPrintOpen(true)} className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                            <PrinterIcon className="w-5 h-5 ml-2" />
                            چاپ
                        </button>
                    )}
                    <button onClick={() => onSave(po)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">ذخیره</button>
                </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-medium mb-1">تامین‌کننده</label>
                        <select value={po.vendorId} onChange={(e) => handleVendorChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" required>
                            <option value="">انتخاب کنید...</option>
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">تاریخ صدور</label>
                        <input type="text" value={po.issueDate} onChange={e => setPo({...po, issueDate: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">وضعیت</label>
                        <select value={po.status} onChange={e => setPo({...po, status: e.target.value as PurchaseOrderStatus})} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="پیش‌نویس">پیش‌نویس</option>
                            <option value="سفارش داده شده">سفارش داده شده</option>
                            <option value="دریافت شده">دریافت شده</option>
                            <option value="لغو شده">لغو شده</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-2 text-right w-2/5">کالا/خدمت</th>
                                <th className="p-2 text-center w-1/12">تعداد</th>
                                <th className="p-2 text-center">قیمت خرید (تومان)</th>
                                <th className="p-2 text-center">مالیات (%)</th>
                                <th className="p-2 text-left">مبلغ کل</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="p-1"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 bg-gray-50 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"><option value="">انتخاب یا وارد کنید</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
                                    <td className="p-1"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} min="1" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" /></td>
                                    <td className="p-1"><input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" /></td>
                                    <td className="p-1"><input type="number" value={item.tax} onChange={e => handleItemChange(index, 'tax', e.target.value)} min="0" max="100" className="w-full p-2 text-center bg-gray-50 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white" /></td>
                                    <td className="p-1 text-left font-semibold text-gray-900 dark:text-white">{(item.quantity * item.unitPrice).toLocaleString('fa-IR')}</td>
                                    <td className="p-1 text-center"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={handleAddItem} className="mt-4 text-sm text-indigo-600 font-medium">+ افزودن آیتم جدید</button>
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between"><span>جمع کل:</span><span>{po.subtotal?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between text-green-600"><span>مالیات:</span><span>+ {po.taxAmount?.toLocaleString('fa-IR')} تومان</span></div>
                        <div className="flex justify-between font-bold text-lg border-t dark:border-gray-600 pt-2 mt-2"><span>مبلغ قابل پرداخت:</span><span>{po.totalAmount?.toLocaleString('fa-IR')} تومان</span></div>
                    </div>
                </div>
            </div>
        </div>
        {('id' in po) && (
             <PrintableDocument 
                isOpen={isPrintOpen} 
                onClose={() => setIsPrintOpen(false)} 
                type="purchaseOrder" 
                data={po as PurchaseOrder} 
                companyInfo={companyInfo}
            />
        )}
        </>
    );
};

export default PurchaseOrderEditor;
