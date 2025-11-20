/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    این کامپوننت مسئولیت مدیریت مشتریان (CRUD) را بر عهده دارد.

    1. دریافت لیست مشتریان (Read)
    - Route: /api/customers
    - Method: GET
    - Expected Query Params: ?page={number}&limit={number}&search={string}
    - Response JSON Schema: { "data": [Customer], "totalPages": number, "currentPage": number }
    - توضیح منطق بکند مورد نیاز: یک کنترلر برای مشتریان که قابلیت فیلتر بر اساس نام، شخص رابط و ایمیل و همچنین صفحه‌بندی (pagination) را داشته باشد. باید اطلاعات مدیر حساب (accountManager) را join کند و برگرداند.
    - Dependencies: نیاز به Auth Token، نیاز به Pagination.

    2. افزودن مشتری جدید (Create)
    - Route: /api/customers
    - Method: POST
    - Expected Body JSON Schema: Partial<Customer> (تمام فیلدهای فرم افزودن مشتری)
    - Response JSON Schema: Customer (مشتری جدید ایجاد شده)
    - توضیح منطق بکند مورد نیاز: اعتبارسنجی داده‌های ورودی (مانند یکتا بودن نام کاربری و ایمیل). ایجاد رکورد جدید در دیتابیس.
    - Dependencies: نیاز به Auth Token.

    3. ویرایش مشتری (Update)
    - Route: /api/customers/:id
    - Method: PUT
    - Expected Body JSON Schema: Partial<Customer> (تمام فیلدهای فرم ویرایش مشتری)
    - Response JSON Schema: Customer (مشتری ویرایش شده)
    - توضیح منطق بکند مورد نیاز: اعتبارسنجی داده‌ها و به‌روزرسانی رکورد مشتری در دیتابیس.
    - Dependencies: نیاز به Auth Token.

    4. حذف مشتری (Delete)
    - Route: /api/customers/:id
    - Method: DELETE
    - Response JSON Schema: { "success": true }
    - توضیح منطق بکند مورد نیاز: حذف مشتری از دیتابیس. می‌توان به جای حذف فیزیکی، از soft delete استفاده کرد.
    - Dependencies: نیاز به Auth Token.

    5. دریافت لیست کاربران (برای dropdown مدیر حساب)
    - Route: /api/users?role=sales_manager_or_similar
    - Method: GET
    - Response JSON Schema: { "data": [User] }
    - توضیح منطق بکند مورد نیاز: لیستی از کاربران که می‌توانند به عنوان مدیر حساب انتخاب شوند.
    - Dependencies: نیاز به Auth Token.
*/
import React, { useState, useMemo, useEffect } from 'react';
import { Customer, CustomerType, User, Contact } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { getJwtExpiry } from '../../utils/jwt';
import { StarIcon } from '../icons/StarIcon';

const ITEMS_PER_PAGE = 8;

const initialCustomerState: Partial<Customer> = {
    name: '',
    contacts: [],
    username: '',
    password: '',
    email: '',
    phone: '',
    status: 'فعال',
    mobile: '',
    city: '',
    province: '',
    fullAddress: '',
    postalCode: '',
    website: '',
    customerType: 'شرکتی',
    industry: '',
    internalNotes: '',
    portalToken: '',
    supportEndDate: '',
};

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onViewInteractions: (customerId: string) => void;
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers, onViewInteractions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerFormData, setCustomerFormData] = useState<Partial<Customer>>(initialCustomerState);
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);
  
  const statusColors: { [key in Customer['status']]: string } = {
    'فعال': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'غیرفعال': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
    'معلق': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  useEffect(() => {
    if (editingCustomer) {
        setCustomerFormData({
            ...initialCustomerState,
            ...editingCustomer,
            password: '',
        });
    } else {
        setCustomerFormData(initialCustomerState);
    }
  }, [editingCustomer, isPanelOpen]);
  
  useEffect(() => {
      const expiry = getJwtExpiry(customerFormData.portalToken || '');
      setTokenExpiry(expiry);
  }, [customerFormData.portalToken]);

  const filteredCustomers = useMemo(() => 
    customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contacts.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name)),
    [searchTerm, customers]
  );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
        setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...customerFormData } as Customer : c));
    } else {
        const newCustomer: Customer = {
            id: `C-${Date.now()}`,
            ...initialCustomerState,
            ...customerFormData,
        } as Customer;
        setCustomers([...customers, newCustomer]);
    }
    closePanel();
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm('آیا از حذف این مشتری اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
        setCustomers(customers.filter(c => c.id !== customerId));
    }
  };
  
  const openPanel = (customer: Customer | null = null) => {
    setEditingCustomer(customer);
    setIsPanelOpen(true);
  };
  
  const closePanel = () => {
      setIsPanelOpen(false);
      setEditingCustomer(null);
      setCustomerFormData(initialCustomerState);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleContactsChange = (contacts: Contact[]) => {
      setCustomerFormData(prev => ({ ...prev, contacts }));
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="جستجوی مشتری..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-64 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <button 
            onClick={() => openPanel()}
            className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
            <PlusIcon className="w-5 h-5 ml-2" />
            <span>افزودن مشتری</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-4 py-3">نام مشتری</th>
                      <th scope="col" className="px-4 py-3">رابط اصلی</th>
                      <th scope="col" className="px-4 py-3">نام کاربری پورتال</th>
                      <th scope="col" className="px-4 py-3">تلفن</th>
                      <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                      <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                  </tr>
              </thead>
              <tbody>
                  {paginatedCustomers.map((customer) => {
                      const primaryContact = customer.contacts.find(c => c.isPrimary);
                      return (
                      <tr key={customer.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{customer.name}</td>
                          <td className="px-4 py-3">{primaryContact?.name || '-'}</td>
                          <td className="px-4 py-3 font-mono text-xs">{customer.username}</td>
                          <td className="px-4 py-3">{customer.phone}</td>
                          <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[customer.status]}`}>
                                  {customer.status}
                              </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                                  <button onClick={() => onViewInteractions(customer.id)} className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" aria-label="View Interactions">
                                      <EyeIcon className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => openPanel(customer)} className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Edit">
                                      <PencilIcon className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleDelete(customer.id)} className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete">
                                      <TrashIcon className="w-5 h-5" />
                                  </button>
                            </div>
                          </td>
                      </tr>
                  )})}
              </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
              <div>
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                      صفحه <span className="font-semibold">{currentPage}</span> از <span className="font-semibold">{totalPages}</span>
                  </span>
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={handleNextPage} disabled={currentPage === totalPages} className="flex items-center justify-center p-2 text-gray-500 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon className="w-5 h-5" /></button>
                  <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center justify-center p-2 text-gray-500 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="w-5 h-5" /></button>
              </div>
          </div>
        )}
      </div>

      <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
        <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-2xl shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-semibold">{editingCustomer ? 'ویرایش مشتری' : 'افزودن مشتری جدید'}</h3>
            <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleFormSubmit} className="flex flex-col overflow-hidden flex-grow">
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
              
              <h4 className="text-md font-semibold">اطلاعات اصلی مشتری</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium">نام مشتری (شرکت یا شخص)</label>
                      <input type="text" name="name" id="name" value={customerFormData.name || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                  <div>
                      <label htmlFor="customerType" className="block mb-2 text-sm font-medium">نوع مشتری</label>
                      <select name="customerType" id="customerType" value={customerFormData.customerType} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                          <option value="شرکتی">شرکتی</option>
                          <option value="شخصی">شخصی</option>
                          <option value="کسب و کار">کسب و کار</option>
                      </select>
                  </div>
                   <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium">ایمیل عمومی</label>
                      <input type="email" name="email" id="email" value={customerFormData.email || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                   <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium">تلفن عمومی</label>
                      <input type="tel" name="phone" id="phone" value={customerFormData.phone || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                  <div className="md:col-span-2">
                       <label htmlFor="website" className="block mb-2 text-sm font-medium">وبسایت</label>
                      <input type="url" name="website" id="website" value={customerFormData.website || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="https://example.com" />
                  </div>
              </div>

              <hr className="dark:border-gray-600"/>
              <h4 className="text-md font-semibold">اشخاص رابط</h4>
              <ContactManager contacts={customerFormData.contacts || []} setContacts={handleContactsChange} />


              <hr className="dark:border-gray-600"/>
              <h4 className="text-md font-semibold">اطلاعات ورود به پورتال</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium">نام کاربری</label>
                      <input type="text" name="username" id="username" value={customerFormData.username || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium">رمز عبور</label>
                      <input type="password" name="password" id="password" value={customerFormData.password || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder={editingCustomer ? "برای تغییر وارد کنید" : ""} />
                  </div>
              </div>

              <hr className="dark:border-gray-600"/>
              <h4 className="text-md font-semibold">اطلاعات تکمیلی و فنی</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                      <label htmlFor="status" className="block mb-2 text-sm font-medium">وضعیت</label>
                      <select name="status" id="status" value={customerFormData.status} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                          <option value="فعال">فعال</option>
                          <option value="غیرفعال">غیرفعال</option>
                          <option value="معلق">معلق</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="supportEndDate" className="block mb-2 text-sm font-medium">تاریخ پایان پشتیبانی</label>
                      <input type="text" name="supportEndDate" id="supportEndDate" value={customerFormData.supportEndDate || ''} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="مثلا: 1404/05/01" />
                  </div>
                  <div className="md:col-span-2">
                       <label htmlFor="portalToken" className="block mb-2 text-sm font-medium">توکن پورتال مشتری</label>
                       <input 
                          type="text" 
                          name="portalToken" 
                          id="portalToken" 
                          value={customerFormData.portalToken || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                          placeholder="توکن JWT مشتری را اینجا وارد کنید"
                          style={{ direction: 'ltr', textAlign: 'left' }}
                        />
                        {tokenExpiry && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                تاریخ انقضا: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tokenExpiry}</span>
                            </p>
                        )}
                  </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 space-i-3 flex-shrink-0">
              <button type="button" onClick={closePanel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                انصراف
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">
                ذخیره
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


const ContactManager: React.FC<{ contacts: Contact[], setContacts: (contacts: Contact[]) => void }> = ({ contacts, setContacts }) => {
    const handleContactChange = (index: number, field: keyof Omit<Contact, 'id' | 'isPrimary'>, value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    const handleAddContact = () => {
        const newContact: Contact = {
            id: `P-${Date.now()}`,
            name: '',
            position: '',
            phone: '',
            isPrimary: contacts.length === 0, // First contact is primary by default
        };
        setContacts([...contacts, newContact]);
    };

    const handleRemoveContact = (id: string) => {
        const contactToRemove = contacts.find(c => c.id === id);
        const newContacts = contacts.filter(c => c.id !== id);
        // If the primary contact is deleted, make the first one in the list primary
        if (contactToRemove?.isPrimary && newContacts.length > 0) {
            newContacts[0].isPrimary = true;
        }
        setContacts(newContacts);
    };

    const setPrimary = (id: string) => {
        const newContacts = contacts.map(c => ({
            ...c,
            isPrimary: c.id === id,
        }));
        setContacts(newContacts);
    };

    return (
        <div className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="space-y-3">
                {contacts.map((contact, index) => (
                    <div key={contact.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-12 sm:col-span-3">
                            <input type="text" placeholder="نام" value={contact.name} onChange={e => handleContactChange(index, 'name', e.target.value)} className="w-full text-sm p-2 bg-white border rounded-lg dark:bg-gray-700" required />
                        </div>
                        <div className="col-span-12 sm:col-span-3">
                             <input type="text" placeholder="سمت" value={contact.position || ''} onChange={e => handleContactChange(index, 'position', e.target.value)} className="w-full text-sm p-2 bg-white border rounded-lg dark:bg-gray-700" />
                        </div>
                        <div className="col-span-12 sm:col-span-3">
                            <input type="tel" placeholder="موبایل" value={contact.phone || ''} onChange={e => handleContactChange(index, 'phone', e.target.value)} className="w-full text-sm p-2 bg-white border rounded-lg dark:bg-gray-700" />
                        </div>
                         <div className="col-span-12 sm:col-span-3 flex items-center gap-1">
                             <button type="button" onClick={() => setPrimary(contact.id)} title="تنظیم به عنوان رابط اصلی">
                                <StarIcon className={`w-5 h-5 cursor-pointer ${contact.isPrimary ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                            </button>
                            <button type="button" onClick={() => handleRemoveContact(contact.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddContact} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                + افزودن شخص رابط
            </button>
        </div>
    );
};


export default Customers;