
import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus, CompanyInfo } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PrinterIcon } from '../icons/PrinterIcon';
import PrintableDocument from '../print/PrintableDocument';
import { ArrowDownTrayIcon } from '../icons/ArrowDownTrayIcon';
import { exportToCSV } from '../../utils/export';
import { toShamsi } from '../../utils/date';

interface InvoicesListProps {
    invoices: Invoice[];
    onCreateNew?: () => void;
    onEdit: (invoice: Invoice) => void;
    hideControls?: boolean;
    companyInfo: CompanyInfo;
}

const statusColors: { [key in InvoiceStatus]: string } = {
    'پیش‌نویس': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
    'ارسال شده': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'پرداخت جزئی': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'پرداخت شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'سررسید گذشته': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, onCreateNew, onEdit, hideControls = false, companyInfo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [printingInvoice, setPrintingInvoice] = useState<Invoice | null>(null);

    const filteredInvoices = useMemo(() => 
        invoices.filter(invoice => 
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()),
    [invoices, searchTerm]);

    return (
        <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {!hideControls && <h2 className="text-xl font-bold">مدیریت فاکتورها</h2>}
                
                <div className="relative w-full md:w-auto flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="جستجو در فاکتورها (نام مشتری، شناسه)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => exportToCSV(filteredInvoices, 'invoices')}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition"
                        title="خروجی اکسل"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    {!hideControls && onCreateNew && (
                        <button onClick={onCreateNew} className="flex items-center justify-center flex-grow md:flex-grow-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <PlusIcon className="w-5 h-5 ml-2" />
                            <span>فاکتور جدید</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">شناسه فاکتور</th>
                            <th scope="col" className="px-4 py-3">مشتری</th>
                            <th scope="col" className="px-4 py-3 hidden md:table-cell">تاریخ صدور</th>
                            <th scope="col" className="px-4 py-3">مبلغ کل (تومان)</th>
                            <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                            <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{invoice.id}</td>
                                <td className="px-4 py-3">
                                    {invoice.customerName}
                                    <div className="md:hidden text-xs text-gray-500 mt-1">{toShamsi(invoice.issueDate)}</div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">{toShamsi(invoice.issueDate)}</td>
                                <td className="px-4 py-3">{invoice.totalAmount.toLocaleString('fa-IR')}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[invoice.status]}`}>{invoice.status}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <button onClick={() => setPrintingInvoice(invoice)} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hidden sm:block" title="چاپ">
                                            <PrinterIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onEdit(invoice)} className="p-1 text-gray-500 hover:text-indigo-600" title="ویرایش/مشاهده">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredInvoices.length === 0 && <p className="text-center py-8 text-gray-500">هیچ فاکتوری یافت نشد.</p>}
            </div>
        </div>
        {printingInvoice && (
            <PrintableDocument 
                isOpen={!!printingInvoice} 
                onClose={() => setPrintingInvoice(null)} 
                type="invoice" 
                data={printingInvoice}
                companyInfo={companyInfo}
            />
        )}
        </>
    );
};

export default InvoicesList;
