
import React, { useState, useMemo } from 'react';
import { Quote, QuoteStatus, CompanyInfo } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { DocumentDuplicateIcon } from '../icons/DocumentDuplicateIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PrinterIcon } from '../icons/PrinterIcon';
import PrintableDocument from '../print/PrintableDocument';

interface QuotationsListProps {
    quotes: Quote[];
    onCreateNew?: () => void;
    onEdit: (quote: Quote) => void;
    onCreateInvoiceFromQuote: (quote: Quote) => void;
    hideControls?: boolean;
    companyInfo: CompanyInfo;
}

const statusColors: { [key in QuoteStatus]: string } = {
    'پیش‌نویس': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
    'ارسال شده': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'تایید شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'رد شده': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};


const QuotationsList: React.FC<QuotationsListProps> = ({ quotes, onCreateNew, onEdit, onCreateInvoiceFromQuote, hideControls = false, companyInfo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [printingQuote, setPrintingQuote] = useState<Quote | null>(null);

    const filteredQuotes = useMemo(() => 
        quotes.filter(quote => 
            quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (quote.quoteNumber || quote.id).toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            // Sort by Quote Number desc, then Version desc
            if (a.quoteNumber !== b.quoteNumber) {
                return b.quoteNumber.localeCompare(a.quoteNumber);
            }
            return b.version - a.version;
        }), 
    [quotes, searchTerm]);

    return (
        <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {!hideControls && <h2 className="text-xl font-bold">مدیریت پیش‌فاکتورها</h2>}
                
                <div className="relative w-full md:w-auto flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="جستجو (نام مشتری، شماره پیش‌فاکتور)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {!hideControls && onCreateNew && (
                    <button onClick={onCreateNew} className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 ml-2" />
                        <span>پیش‌فاکتور جدید</span>
                    </button>
                )}
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">شماره</th>
                            <th scope="col" className="px-4 py-3">نسخه</th>
                            <th scope="col" className="px-4 py-3">مشتری</th>
                            <th scope="col" className="px-4 py-3">تاریخ صدور</th>
                            <th scope="col" className="px-4 py-3">مبلغ کل (تومان)</th>
                            <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                            <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuotes.map((quote) => (
                            <tr key={quote.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{quote.quoteNumber || quote.id}</td>
                                <td className="px-4 py-3"><span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Ver {quote.version}</span></td>
                                <td className="px-4 py-3">{quote.customerName}</td>
                                <td className="px-4 py-3">{quote.issueDate}</td>
                                <td className="px-4 py-3">{quote.totalAmount.toLocaleString('fa-IR')}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[quote.status]}`}>{quote.status}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        {quote.status === 'تایید شده' && (
                                            <button onClick={() => onCreateInvoiceFromQuote(quote)} className="p-1 text-gray-500 hover:text-green-600" title="ایجاد فاکتور" aria-label="Create Invoice">
                                                <DocumentDuplicateIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button onClick={() => setPrintingQuote(quote)} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" title="چاپ">
                                            <PrinterIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onEdit(quote)} className="p-1 text-gray-500 hover:text-indigo-600" title="ویرایش/مشاهده">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredQuotes.length === 0 && <p className="text-center py-8 text-gray-500">هیچ پیش‌فاکتوری یافت نشد.</p>}
            </div>
        </div>
        {printingQuote && (
            <PrintableDocument 
                isOpen={!!printingQuote} 
                onClose={() => setPrintingQuote(null)} 
                type="quote" 
                data={printingQuote} 
                companyInfo={companyInfo}
            />
        )}
        </>
    );
};

export default QuotationsList;
