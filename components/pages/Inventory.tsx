
import React, { useState, useMemo } from 'react';
import { Product, InventoryTransaction, InventoryTransactionType } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { EyeIcon } from '../icons/EyeIcon';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toShamsi, toIsoDate } from '../../utils/date';

interface InventoryProps {
    products: Product[];
    transactions: InventoryTransaction[];
    onAddTransaction: (transaction: Omit<InventoryTransaction, 'id' | 'productName' | 'userId'>) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, transactions, onAddTransaction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedProductForHistory, setSelectedProductForHistory] = useState<Product | null>(null);
    
    const [newTransaction, setNewTransaction] = useState<{
        productId: string;
        type: InventoryTransactionType;
        quantity: number;
        date: string;
        description: string;
    }>({
        productId: '',
        type: 'receipt',
        quantity: 1,
        date: new Date().toISOString(),
        description: ''
    });

    // Filter products to only show physical items (type === 'product')
    const filteredProducts = useMemo(() => 
        products.filter(p => 
            p.type === 'product' &&
            (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()))
        ), [products, searchTerm]
    );

    // Only allow selecting 'product' types in manual transaction form
    const productOptions = useMemo(() => products.filter(p => p.type === 'product'), [products]);

    const getProductHistory = (productId: string) => {
        return transactions.filter(t => t.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const handleOpenHistory = (product: Product) => {
        setSelectedProductForHistory(product);
        setIsHistoryModalOpen(true);
    };

    const handleSubmitTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTransaction.productId) {
            alert('لطفاً یک کالا را انتخاب کنید.');
            return;
        }
        onAddTransaction(newTransaction);
        setIsModalOpen(false);
        setNewTransaction({
            productId: '',
            type: 'receipt',
            quantity: 1,
            date: new Date().toISOString(),
            description: ''
        });
    };

    const getTypeLabel = (type: InventoryTransactionType) => {
        switch (type) {
            case 'receipt': return { text: 'ورود به انبار', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' };
            case 'issue': return { text: 'خروج از انبار', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
            case 'sales_return': return { text: 'مرجوعی فروش', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
            case 'purchase_return': return { text: 'برگشت از خرید', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' };
        }
    };

    const getTypeIcon = (type: InventoryTransactionType) => {
         switch (type) {
            case 'receipt': case 'sales_return': return <ArrowDownIcon className="w-4 h-4" />;
            case 'issue': case 'purchase_return': return <ArrowUpIcon className="w-4 h-4" />;
        }
    };

    return (
        <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ArchiveBoxIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    مدیریت موجودی انبار
                </h2>
                
                <div className="relative w-full md:w-auto flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="جستجوی کالا..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>سند انبار جدید</span>
                </button>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3 hidden sm:table-cell">کد کالا</th>
                            <th className="px-4 py-3">نام کالا</th>
                            <th className="px-4 py-3 text-center">موجودی</th>
                            <th className="px-4 py-3 text-center hidden md:table-cell">وضعیت</th>
                            <th className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const stockStatus = product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                            const stockLabel = product.stock > 10 ? 'موجود' : product.stock > 0 ? 'روبه اتمام' : 'ناموجود';
                            
                            return (
                                <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs hidden sm:table-cell">{product.code || '-'}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                    <td className="px-4 py-3 text-center font-bold text-lg">{product.stock}</td>
                                    <td className="px-4 py-3 text-center hidden md:table-cell">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus}`}>
                                            {stockLabel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button 
                                            onClick={() => handleOpenHistory(product)} 
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4 ml-1" />
                                            کاردکس
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredProducts.length === 0 && <p className="text-center py-8 text-gray-500">هیچ کالایی یافت نشد.</p>}
            </div>
        </div>

        {/* Transaction Drawer */}
        <div className={`fixed inset-0 z-50 ${isModalOpen ? '' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isModalOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={() => setIsModalOpen(false)}></div>
            <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full md:w-auto md:min-w-[24rem] md:max-w-md shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isModalOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ثبت سند انبار</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmitTransaction} className="flex-grow flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                        <div>
                            <label className="block text-sm font-medium mb-1">نوع عملیات</label>
                            <select 
                                value={newTransaction.type} 
                                onChange={e => setNewTransaction({...newTransaction, type: e.target.value as InventoryTransactionType})} 
                                className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="receipt">ورود کالا (Receipt)</option>
                                <option value="issue">خروج کالا (Issue)</option>
                                <option value="sales_return">مرجوعی فروش (Sales Return)</option>
                                <option value="purchase_return">برگشت از خرید (Purchase Return)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">کالا</label>
                            <select 
                                value={newTransaction.productId} 
                                onChange={e => setNewTransaction({...newTransaction, productId: e.target.value})} 
                                className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                <option value="">انتخاب کنید...</option>
                                {productOptions.map(p => <option key={p.id} value={p.id}>{p.name} (موجودی: {p.stock})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">تعداد</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={newTransaction.quantity} 
                                    onChange={e => setNewTransaction({...newTransaction, quantity: parseInt(e.target.value)})} 
                                    className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">تاریخ</label>
                                <DatePicker 
                                    value={new Date(newTransaction.date)}
                                    onChange={(d) => setNewTransaction(prev => ({...prev, date: toIsoDate(d)}))}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="top-right"
                                    inputClass="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">توضیحات</label>
                            <textarea 
                                rows={3} 
                                value={newTransaction.description} 
                                onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} 
                                className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto flex-shrink-0">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">انصراف</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ثبت سند</button>
                    </div>
                </form>
            </div>
        </div>

        {/* History Modal */}
        {isHistoryModalOpen && selectedProductForHistory && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            کاردکس کالا: <span className="text-indigo-600">{selectedProductForHistory.name}</span>
                        </h3>
                        <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex justify-between mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                             <span>موجودی فعلی:</span>
                             <span className="font-bold text-lg">{selectedProductForHistory.stock}</span>
                        </div>
                        <table className="w-full text-sm text-right">
                            <thead className="text-xs text-gray-500 uppercase border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-2 py-2">تاریخ</th>
                                    <th className="px-2 py-2">نوع سند</th>
                                    <th className="px-2 py-2 hidden sm:table-cell">مرجع</th>
                                    <th className="px-2 py-2 text-center">تعداد</th>
                                    <th className="px-2 py-2 hidden sm:table-cell">توضیحات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProductHistory(selectedProductForHistory.id).map(t => {
                                    const typeInfo = getTypeLabel(t.type);
                                    const isAdd = ['receipt', 'sales_return'].includes(t.type);
                                    return (
                                        <tr key={t.id} className="border-b dark:border-gray-700">
                                            <td className="px-2 py-3">{toShamsi(t.date)}</td>
                                            <td className="px-2 py-3">
                                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs w-fit ${typeInfo.color}`}>
                                                    {getTypeIcon(t.type)}
                                                    {typeInfo.text}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 font-mono text-xs text-gray-500 hidden sm:table-cell">{t.referenceId || '-'}</td>
                                            <td className={`px-2 py-3 text-center font-bold ${isAdd ? 'text-green-600' : 'text-red-600'}`}>
                                                {isAdd ? '+' : '-'}{t.quantity}
                                            </td>
                                            <td className="px-2 py-3 text-xs text-gray-500 hidden sm:table-cell">{t.description || '-'}</td>
                                        </tr>
                                    )
                                })}
                                {getProductHistory(selectedProductForHistory.id).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">هیچ تراکنشی ثبت نشده است.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                        <button onClick={() => setIsHistoryModalOpen(false)} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">بستن</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Inventory;
