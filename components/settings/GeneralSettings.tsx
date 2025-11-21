
import React, { useState, useEffect } from 'react';
import { CompanyInfo } from '../../types';

interface GeneralSettingsProps {
    companyInfo: CompanyInfo;
    setCompanyInfo: (info: CompanyInfo) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ companyInfo, setCompanyInfo }) => {
    const [formData, setFormData] = useState<CompanyInfo>(companyInfo);

    useEffect(() => {
        setFormData(companyInfo);
    }, [companyInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCompanyInfo(formData);
        alert('تنظیمات با موفقیت ذخیره شد.');
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6">تنظیمات عمومی و مشخصات شرکت</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium mb-2">نام شرکت (فروشنده)</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                            required 
                        />
                        <p className="text-xs text-gray-500 mt-1">این نام در فاکتورها و پیش‌فاکتورها نمایش داده می‌شود.</p>
                    </div>
                    
                    <div>
                        <label htmlFor="economicCode" className="block text-sm font-medium mb-2">کد اقتصادی</label>
                        <input 
                            type="text" 
                            name="economicCode" 
                            id="economicCode" 
                            value={formData.economicCode || ''} 
                            onChange={handleChange} 
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>

                    <div>
                        <label htmlFor="nationalId" className="block text-sm font-medium mb-2">شناسه ملی</label>
                        <input 
                            type="text" 
                            name="nationalId" 
                            id="nationalId" 
                            value={formData.nationalId || ''} 
                            onChange={handleChange} 
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">تلفن تماس</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            dir="ltr"
                            placeholder="021-..."
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-left" 
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">ایمیل</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            dir="ltr"
                            placeholder="info@example.com"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-left" 
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium mb-2">آدرس پستی</label>
                        <textarea 
                            name="address" 
                            id="address" 
                            rows={3}
                            value={formData.address} 
                            onChange={handleChange} 
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>

                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium mb-2">کد پستی</label>
                        <input 
                            type="text" 
                            name="postalCode" 
                            id="postalCode" 
                            value={formData.postalCode || ''} 
                            onChange={handleChange} 
                            dir="ltr"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-left" 
                        />
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="website" className="block text-sm font-medium mb-2">وبسایت</label>
                        <input 
                            type="url" 
                            name="website" 
                            id="website" 
                            value={formData.website} 
                            onChange={handleChange} 
                            dir="ltr"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-left" 
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="logoUrl" className="block text-sm font-medium mb-2">آدرس لوگو (URL)</label>
                        <input 
                            type="url" 
                            name="logoUrl" 
                            id="logoUrl" 
                            value={formData.logoUrl || ''} 
                            onChange={handleChange} 
                            dir="ltr"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-left" 
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-colors"
                    >
                        ذخیره تغییرات
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GeneralSettings;