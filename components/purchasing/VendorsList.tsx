
import React, { useState, useMemo } from 'react';
import { Vendor } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

interface VendorsListProps {
    vendors: Vendor[];
    setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
}

const initialVendorState: Omit<Vendor, 'id'> = {
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    economicCode: '',
    nationalId: '',
    postalCode: '',
    status: 'فعال',
};

const VendorsList: React.FC<VendorsListProps> = ({ vendors, setVendors }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const [formData, setFormData] = useState(initialVendorState);

    const filteredVendors = useMemo(() => 
        vendors.filter(vendor =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase())
        ), [vendors, searchTerm]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVendor) {
            setVendors(prev => prev.map(v => v.id === editingVendor.id ? { ...v, ...formData } : v));
        } else {
            const newVendor: Vendor = {
                id: `V-${Date.now()}`,
                ...formData
            };
            setVendors(prev => [...prev, newVendor]);
        }
        closePanel();
    };

    const handleDelete = (id: string) => {
        if(window.confirm('آیا از حذف این تامین‌کننده اطمینان دارید؟')) {
            setVendors(prev => prev.filter(v => v.id !== id));
        }
    };

    const openPanel = (vendor: Vendor | null = null) => {
        setEditingVendor(vendor);
        setFormData(vendor || initialVendorState);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setEditingVendor(null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="جستجوی تامین‌کننده..."
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
                    <span>تامین‌کننده جدید</span>
                </button>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">نام شرکت</th>
                            <th className="px-4 py-3">شخص رابط</th>
                            <th className="px-4 py-3 hidden sm:table-cell">تلفن</th>
                            <th className="px-4 py-3 hidden md:table-cell">ایمیل</th>
                            <th className="px-4 py-3 text-center hidden sm:table-cell">وضعیت</th>
                            <th className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendors.map(vendor => (
                            <tr key={vendor.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                    {vendor.name}
                                    <div className="sm:hidden text-xs text-gray-500 font-normal mt-1">{vendor.phone}</div>
                                </td>
                                <td className="px-4 py-3">{vendor.contactName}</td>
                                <td className="px-4 py-3 hidden sm:table-cell">{vendor.phone}</td>
                                <td className="px-4 py-3 hidden md:table-cell">{vendor.email}</td>
                                <td className="px-4 py-3 text-center hidden sm:table-cell">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${vendor.status === 'فعال' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <button onClick={() => openPanel(vendor)} className="p-1 text-gray-500 hover:text-indigo-600"><PencilIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(vendor.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredVendors.length === 0 && <p className="text-center py-8 text-gray-500">هیچ تامین‌کننده‌ای یافت نشد.</p>}
            </div>

            {/* Add/Edit Panel */}
            <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full md:w-auto md:min-w-[30rem] md:max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                        <h3 className="text-lg font-semibold">{editingVendor ? 'ویرایش تامین‌کننده' : 'افزودن تامین‌کننده'}</h3>
                        <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow overflow-hidden">
                        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div><label className="block text-sm font-medium mb-1">نام شرکت</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required /></div>
                            <div><label className="block text-sm font-medium mb-1">شخص رابط</label><input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium mb-1">تلفن</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium mb-1">ایمیل</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">کد اقتصادی</label><input type="text" name="economicCode" value={formData.economicCode || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" /></div>
                                <div><label className="block text-sm font-medium mb-1">شناسه ملی</label><input type="text" name="nationalId" value={formData.nationalId || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-1">آدرس</label><textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" /></div>
                            <div><label className="block text-sm font-medium mb-1">کد پستی</label><input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" /></div>
                             <div><label className="block text-sm font-medium mb-1">وبسایت</label><input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" /></div>
                            <div>
                                <label className="block text-sm font-medium mb-1">وضعیت</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700">
                                    <option value="فعال">فعال</option>
                                    <option value="غیرفعال">غیرفعال</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 flex-shrink-0">
                            <button type="button" onClick={closePanel} className="px-4 py-2 ml-3 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ذخیره</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VendorsList;
