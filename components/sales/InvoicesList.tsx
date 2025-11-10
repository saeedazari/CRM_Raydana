import React from 'react';
import { Invoice, InvoiceStatus } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';

interface InvoicesListProps {
    invoices: Invoice[];
    onCreateNew: () => void;
    onEdit: (invoice: Invoice) => void;
}

const statusColors: { [key in InvoiceStatus]: string } = {
    'پیش‌نویس': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
    'ارسال شده': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'پرداخت شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'سررسید گذشته': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, onCreateNew, onEdit }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">مدیریت فاکتورها</h2>
                <button onClick={onCreateNew} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>فاکتور جدید</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">شناسه فاکتور</th>
                            <th scope="col" className="px-4 py-3">مشتری</th>
                            <th scope="col" className="px-4 py-3">تاریخ سررسید</th>
                            <th scope="col" className="px-4 py-3">مبلغ کل (تومان)</th>
                            <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                            <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{invoice.id}</td>
                                <td className="px-4 py-3">{invoice.customerName}</td>
                                <td className="px-4 py-3">{invoice.dueDate}</td>
                                <td className="px-4 py-3">{invoice.totalAmount.toLocaleString('fa-IR')}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[invoice.status]}`}>{invoice.status}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                     <button onClick={() => onEdit(invoice)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {invoices.length === 0 && <p className="text-center py-8 text-gray-500">هیچ فاکتوری یافت نشد.</p>}
            </div>
        </div>
    );
};

export default InvoicesList;
