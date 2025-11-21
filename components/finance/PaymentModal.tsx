
import React, { useState, useEffect } from 'react';
import { Payment, Customer, Vendor, Invoice, PurchaseOrder, PaymentMethod, PaymentType } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payment: Omit<Payment, 'id'>) => void;
    customers: Customer[];
    vendors: Vendor[];
    invoices: Invoice[];
    purchaseOrders: PurchaseOrder[];
    currentUser: { id: string; name: string };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSave, customers, vendors, invoices, purchaseOrders, currentUser }) => {
    const [type, setType] = useState<PaymentType>('دریافت');
    const [partyId, setPartyId] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [method, setMethod] = useState<PaymentMethod>('واریز بانکی');
    const [description, setDescription] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setType('دریافت');
            setPartyId('');
            setReferenceId('');
            setAmount(0);
            setDescription('');
        }
    }, [isOpen]);

    // Auto-fill amount when reference (Invoice/PO) changes
    useEffect(() => {
        if (!referenceId) return;
        
        if (type === 'دریافت') {
            const inv = invoices.find(i => i.id === referenceId);
            if (inv) {
                const remaining = inv.totalAmount - (inv.amountPaid || 0);
                setAmount(remaining > 0 ? remaining : 0);
            }
        } else {
            const po = purchaseOrders.find(p => p.id === referenceId);
            if (po) {
                const remaining = po.totalAmount - (po.amountPaid || 0);
                setAmount(remaining > 0 ? remaining : 0);
            }
        }
    }, [referenceId, invoices, purchaseOrders, type]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let partyName = '';
        if (type === 'دریافت') {
            partyName = customers.find(c => c.id === partyId)?.name || '';
        } else {
            partyName = vendors.find(v => v.id === partyId)?.name || '';
        }

        onSave({
            type,
            amount,
            date,
            method,
            referenceId,
            referenceType: type === 'دریافت' ? 'invoice' : 'purchaseOrder',
            partyId,
            partyName,
            description,
            recordedBy: currentUser.id
        });
        onClose();
    };

    // Filter invoices/POs based on selected party
    const availableInvoices = invoices.filter(i => i.customerId === partyId && (i.status !== 'پرداخت شده' && i.status !== 'پیش‌نویس'));
    const availablePOs = purchaseOrders.filter(p => p.vendorId === partyId && (p.status !== 'لغو شده' && p.status !== 'پیش‌نویس'));

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={onClose}></div>
            <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-md shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ثبت تراکنش مالی</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                        {/* Type Selection */}
                        <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button
                                type="button"
                                onClick={() => { setType('دریافت'); setPartyId(''); setReferenceId(''); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'دریافت' ? 'bg-white dark:bg-gray-600 shadow text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                دریافت (ورودی)
                            </button>
                            <button
                                type="button"
                                onClick={() => { setType('پرداخت'); setPartyId(''); setReferenceId(''); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'پرداخت' ? 'bg-white dark:bg-gray-600 shadow text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                پرداخت (خروجی)
                            </button>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">{type === 'دریافت' ? 'مشتری' : 'تامین‌کننده'}</label>
                            <select value={partyId} onChange={e => setPartyId(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                                <option value="">انتخاب کنید...</option>
                                {type === 'دریافت' 
                                    ? customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                    : vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">{type === 'دریافت' ? 'بابت فاکتور فروش' : 'بابت سفارش خرید'}</label>
                            <select value={referenceId} onChange={e => setReferenceId(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required disabled={!partyId}>
                                <option value="">انتخاب کنید...</option>
                                {type === 'دریافت'
                                    ? availableInvoices.map(inv => <option key={inv.id} value={inv.id}>{inv.id} - مبلغ: {inv.totalAmount.toLocaleString()} - مانده: {(inv.totalAmount - (inv.amountPaid || 0)).toLocaleString()}</option>)
                                    : availablePOs.map(po => <option key={po.id} value={po.id}>{po.id} - مبلغ: {po.totalAmount.toLocaleString()} - مانده: {(po.totalAmount - (po.amountPaid || 0)).toLocaleString()}</option>)
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">مبلغ (تومان)</label>
                            <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required min="1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block mb-2 text-sm font-medium">تاریخ</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                             <div>
                                <label className="block mb-2 text-sm font-medium">روش پرداخت</label>
                                <select value={method} onChange={e => setMethod(e.target.value as PaymentMethod)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                    <option value="واریز بانکی">واریز بانکی</option>
                                    <option value="کارت به کارت">کارت به کارت</option>
                                    <option value="چک">چک</option>
                                    <option value="نقد">نقد</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">توضیحات</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-3 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">انصراف</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ثبت تراکنش</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
