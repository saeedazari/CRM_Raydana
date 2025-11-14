import React, { useState, useMemo, useEffect } from 'react';
import { Customer } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';
import { KeyIcon } from '../icons/KeyIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { PlusIcon } from '../icons/PlusIcon';

interface CustomerUserManagementProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}


const CustomerUserManagement: React.FC<CustomerUserManagementProps> = ({ customers, setCustomers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPasswordPanelOpen, setIsPasswordPanelOpen] = useState(false);
    const [isEditPortalUserPanelOpen, setIsEditPortalUserPanelOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State for the new edit/add portal user panel
    const [selectedCustomerIdForEdit, setSelectedCustomerIdForEdit] = useState<string>('');
    const [portalUsername, setPortalUsername] = useState('');
    const [portalPassword, setPortalPassword] = useState('');


    const filteredCustomers = useMemo(() =>
        customers.filter(customer =>
            customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [customers, searchTerm]
    );

    useEffect(() => {
        if(selectedCustomerIdForEdit) {
            const customer = customers.find(c => c.id === selectedCustomerIdForEdit);
            if(customer) {
                setPortalUsername(customer.username || '');
                setPortalPassword(''); // Always clear password for security
            }
        } else {
             setPortalUsername('');
             setPortalPassword('');
        }
    }, [selectedCustomerIdForEdit, customers]);

    const openPasswordPanel = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsPasswordPanelOpen(true);
    };
    const closePasswordPanel = () => {
        setIsPasswordPanelOpen(false);
        setSelectedCustomer(null);
        setPassword('');
        setConfirmPassword('');
    };
    
    const openEditPortalUserPanel = () => {
        setSelectedCustomerIdForEdit('');
        setIsEditPortalUserPanelOpen(true);
    };
    const closeEditPortalUserPanel = () => {
        setIsEditPortalUserPanelOpen(false);
    };
    
    const handleSetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('رمزهای عبور مطابقت ندارند.');
            return;
        }
        if (password.length < 4) {
            alert('رمز عبور باید حداقل ۴ کاراکتر باشد.');
            return;
        }
        setCustomers(prev => prev.map(c => c.id === selectedCustomer?.id ? {...c, password} : c));
        alert(`رمز عبور برای ${selectedCustomer?.companyName} با موفقیت تنظیم شد.`);
        closePasswordPanel();
    };
    
     const handleSavePortalUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerIdForEdit) {
            alert('لطفاً یک مشتری را انتخاب کنید.');
            return;
        }
        if (portalPassword && portalPassword.length < 4) {
            alert('رمز عبور باید حداقل ۴ کاراکتر باشد.');
            return;
        }
        setCustomers(prevCustomers =>
            prevCustomers.map(c => {
                if (c.id === selectedCustomerIdForEdit) {
                    const updatedCustomer = { ...c, username: portalUsername };
                    if (portalPassword) {
                        (updatedCustomer as Customer).password = portalPassword;
                    }
                    return updatedCustomer;
                }
                return c;
            })
        );
        alert(`اطلاعات ورود برای مشتری با موفقیت به‌روز شد.`);
        closeEditPortalUserPanel();
    };
    

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="جستجوی مشتری..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                 <button onClick={openEditPortalUserPanel} className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 ml-2" />
                    <span>افزودن/ویرایش کاربر پورتال</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">نام شرکت</th>
                            <th scope="col" className="px-4 py-3">نام کاربری</th>
                            <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{customer.companyName}</td>
                                <td className="px-4 py-3 font-mono text-xs">{customer.username || <span className="text-gray-400">تعریف نشده</span>}</td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => openPasswordPanel(customer)} className="flex items-center justify-center mx-auto px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                                        <KeyIcon className="w-4 h-4 ml-2" />
                                        تنظیم رمز عبور
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Set Password Panel */}
            <div className={`fixed inset-0 z-50 ${isPasswordPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPasswordPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePasswordPanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-md shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPasswordPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold">تنظیم رمز برای {selectedCustomer?.companyName}</h3>
                        <button onClick={closePasswordPanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleSetPassword} className="flex-grow flex flex-col">
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">رمز عبور جدید</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">تکرار رمز عبور جدید</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                            <button type="button" onClick={closePasswordPanel} className="px-4 py-2 ml-3 text-sm font-medium">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg">ذخیره رمز</button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Add/Edit Portal User Panel */}
            <div className={`fixed inset-0 z-50 ${isEditPortalUserPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isEditPortalUserPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closeEditPortalUserPanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isEditPortalUserPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold">افزودن/ویرایش کاربر پورتال</h3>
                        <button onClick={closeEditPortalUserPanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleSavePortalUser} className="flex-grow flex flex-col">
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block mb-2 text-sm font-medium">انتخاب مشتری</label>
                                <select 
                                    value={selectedCustomerIdForEdit} 
                                    onChange={e => setSelectedCustomerIdForEdit(e.target.value)} 
                                    className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                                    required
                                >
                                    <option value="">یک مشتری را انتخاب کنید...</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>{customer.companyName}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedCustomerIdForEdit && (
                                <>
                                    <hr className="dark:border-gray-600 my-4" />
                                    <div>
                                        <label className="block mb-2 text-sm font-medium">نام کاربری پورتال</label>
                                        <input 
                                            type="text" 
                                            name="username" 
                                            value={portalUsername} 
                                            onChange={(e) => setPortalUsername(e.target.value)} 
                                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium">رمز عبور</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={portalPassword} 
                                            onChange={(e) => setPortalPassword(e.target.value)} 
                                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" 
                                            placeholder="برای تغییر یا ثبت رمز جدید وارد کنید"
                                        />
                                         <p className="text-xs text-gray-500 mt-1">اگر این فیلد را خالی بگذارید، رمز عبور قبلی تغییر نخواهد کرد.</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                            <button type="button" onClick={closeEditPortalUserPanel} className="px-4 py-2 ml-3 text-sm font-medium">انصراف</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg">ذخیره</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CustomerUserManagement;