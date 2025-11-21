
import React, { useState, useMemo } from 'react';
import { Payment } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';

interface PaymentsListProps {
    payments: Payment[];
    onRegisterPayment?: () => void;
    hideControls?: boolean;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, onRegisterPayment, hideControls = false }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPayments = useMemo(() => 
        payments.filter(p => 
            p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.referenceId?.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [payments, searchTerm]);

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {!hideControls && <h2 className="text-xl font-bold">مدیریت دریافت و پرداخت</h2>}
                <div className="relative w-full md:w-auto flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="جستجو در تراکنش‌ها..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                {!hideControls && onRegisterPayment && (
                    <button onClick={onRegisterPayment} className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 ml-2" />
                        <span>ثبت تراکنش جدید</span>
                    </button>
                )}
            </div>
             <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">نوع</th>
                            <th className="px-4 py-3">طرف حساب</th>
                            <th className="px-4 py-3">مبلغ (تومان)</th>
                            <th className="px-4 py-3">تاریخ</th>
                            <th className="px-4 py-3">روش پرداخت</th>
                            <th className="px-4 py-3">بابت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment) => (
                            <tr key={payment.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3">
                                    <div className={`flex items-center font-medium ${payment.type === 'دریافت' ? 'text-green-600' : 'text-red-600'}`}>
                                        {payment.type === 'دریافت' ? <ArrowDownIcon className="w-4 h-4 ml-1" /> : <ArrowUpIcon className="w-4 h-4 ml-1" />}
                                        {payment.type}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{payment.partyName}</td>
                                <td className="px-4 py-3 font-bold">{payment.amount.toLocaleString('fa-IR')}</td>
                                <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString('fa-IR')}</td>
                                <td className="px-4 py-3">{payment.method}</td>
                                <td className="px-4 py-3 text-xs font-mono">{payment.referenceId || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPayments.length === 0 && <p className="text-center py-8 text-gray-500">هیچ تراکنشی یافت نشد.</p>}
            </div>
        </div>
    );
}

export default PaymentsList;
