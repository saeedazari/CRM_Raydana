import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

interface ProductsListProps {
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
}

const initialNewProductState: Omit<Product, 'id'> = {
    code: '',
    name: '',
    description: '',
    price: 0,
};

const ProductsList: React.FC<ProductsListProps> = ({ products, onAddProduct, onUpdateProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productFormData, setProductFormData] = useState(initialNewProductState);
    
    useEffect(() => {
        if (editingProduct) {
            setProductFormData(editingProduct);
        } else {
            setProductFormData(initialNewProductState);
        }
    }, [editingProduct]);

    const filteredProducts = useMemo(() => 
        products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.code || '').toLowerCase().includes(searchTerm.toLowerCase())
        ), [products, searchTerm]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            onUpdateProduct({ ...productFormData, id: editingProduct.id });
        } else {
            onAddProduct(productFormData);
        }
        closePanel();
    };

    const openPanel = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsPanelOpen(true);
    };
    const closePanel = () => {
        setIsPanelOpen(false);
        setEditingProduct(null);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="جستجوی محصول..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <button onClick={() => openPanel()} className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 ml-2" />
                        <span>افزودن محصول/خدمت</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">کد کالا</th>
                                <th scope="col" className="px-4 py-3">نام محصول/خدمت</th>
                                <th scope="col" className="px-4 py-3">توضیحات</th>
                                <th scope="col" className="px-4 py-3">قیمت واحد (تومان)</th>
                                <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3 font-mono text-xs">{product.code || '-'}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                    <td className="px-4 py-3 truncate max-w-xs">{product.description || '-'}</td>
                                    <td className="px-4 py-3">{product.price.toLocaleString('fa-IR')}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => openPanel(product)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                            <button className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Product Panel */}
            <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold">{editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h3>
                        <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
                        <div className="p-6 space-y-4 overflow-y-auto">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium">نام محصول/خدمت</label>
                                    <input type="text" name="name" id="name" value={productFormData.name} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                                <div>
                                    <label htmlFor="code" className="block mb-2 text-sm font-medium">کد کالا</label>
                                    <input type="text" name="code" id="code" value={productFormData.code} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium">توضیحات</label>
                                <textarea name="description" id="description" value={productFormData.description} onChange={handleInputChange} rows={4} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium">قیمت واحد (تومان)</label>
                                <input type="number" name="price" id="price" value={productFormData.price} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 space-i-3 mt-auto">
                            <button type="button" onClick={closePanel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ذخیره</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductsList;