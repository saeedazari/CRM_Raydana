import React, { useState, useMemo, useEffect } from 'react';
import { Customer, CustomerType } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

const statusColors: { [key in Customer['status']]: string } = {
  'فعال': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'غیرفعال': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
  'معلق': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const ITEMS_PER_PAGE = 8;

type CustomerFormState = Omit<Customer, 'id'>;

const initialCustomerState: CustomerFormState = {
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    accountManager: 'نامشخص',
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
};

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: (customer: CustomerFormState) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const Customers: React.FC<CustomersProps> = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerFormData, setCustomerFormData] = useState<CustomerFormState>(initialCustomerState);

  useEffect(() => {
    if (editingCustomer) {
        setCustomerFormData(editingCustomer);
    } else {
        setCustomerFormData(initialCustomerState);
    }
  }, [editingCustomer]);


  const filteredCustomers = useMemo(() => 
    customers.filter(customer =>
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.companyName.localeCompare(b.companyName)),
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
        onUpdateCustomer({ ...customerFormData, id: editingCustomer.id });
    } else {
        onAddCustomer(customerFormData);
    }
    closePanel();
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm('آیا از حذف این مشتری اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
        onDeleteCustomer(customerId);
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

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="جستجوی مشتری..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-4 py-3">نام شرکت</th>
                      <th scope="col" className="px-4 py-3">شخص رابط</th>
                      <th scope="col" className="px-4 py-3">ایمیل</th>
                      <th scope="col" className="px-4 py-3">تلفن</th>
                      <th scope="col" className="px-4 py-3">مدیر حساب</th>
                      <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                      <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                  </tr>
              </thead>
              <tbody>
                  {paginatedCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{customer.companyName}</td>
                          <td className="px-4 py-3">{customer.contactPerson}</td>
                          <td className="px-4 py-3">{customer.email}</td>
                          <td className="px-4 py-3">{customer.phone}</td>
                          <td className="px-4 py-3">{customer.accountManager}</td>
                          <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[customer.status]}`}>
                                  {customer.status}
                              </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                                  <button onClick={() => openPanel(customer)} className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Edit">
                                      <PencilIcon className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleDelete(customer.id)} className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete">
                                      <TrashIcon className="w-5 h-5" />
                                  </button>
                            </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
              <div>
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                      صفحه <span className="font-semibold">{currentPage}</span> از <span className="font-semibold">{totalPages}</span>
                  </span>
              </div>
              <div className="flex items-center gap-2">
                  <button 
                      onClick={handleNextPage} 
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center p-2 text-gray-500 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <span className="sr-only">بعدی</span>
                      <ChevronRightIcon className="w-5 h-5" />
                  </button>
                  <button 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center p-2 text-gray-500 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <span className="sr-only">قبلی</span>
                      <ChevronLeftIcon className="w-5 h-5" />
                  </button>
              </div>
          </div>
        )}
      </div>

      {/* Add/Edit Customer Panel */}
      <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`}
          onClick={closePanel}
        ></div>
        
        {/* Panel */}
        <div 
          className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-xl shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-semibold">{editingCustomer ? 'ویرایش مشتری' : 'افزودن مشتری جدید'}</h3>
            <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="flex flex-col overflow-hidden flex-grow">
            <div className="p-6 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="companyName" className="block mb-2 text-sm font-medium">نام شرکت</label>
                      <input type="text" name="companyName" id="companyName" value={customerFormData.companyName} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                  <div>
                      <label htmlFor="contactPerson" className="block mb-2 text-sm font-medium">نام شخص تماس</label>
                      <input type="text" name="contactPerson" id="contactPerson" value={customerFormData.contactPerson} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                   <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium">ایمیل</label>
                      <input type="email" name="email" id="email" value={customerFormData.email} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                   <div>
                      <label htmlFor="website" className="block mb-2 text-sm font-medium">وبسایت</label>
                      <input type="url" name="website" id="website" value={customerFormData.website} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="https://example.com" />
                  </div>
                   <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium">تلفن</label>
                      <input type="tel" name="phone" id="phone" value={customerFormData.phone} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                   <div>
                      <label htmlFor="mobile" className="block mb-2 text-sm font-medium">موبایل</label>
                      <input type="tel" name="mobile" id="mobile" value={customerFormData.mobile} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                   <div>
                      <label htmlFor="province" className="block mb-2 text-sm font-medium">استان</label>
                      <input type="text" name="province" id="province" value={customerFormData.province} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium">شهر</label>
                      <input type="text" name="city" id="city" value={customerFormData.city} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div className="md:col-span-2">
                       <label htmlFor="fullAddress" className="block mb-2 text-sm font-medium">آدرس کامل</label>
                      <textarea name="fullAddress" id="fullAddress" value={customerFormData.fullAddress} onChange={handleInputChange} rows={3} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                  </div>
                  <div>
                       <label htmlFor="postalCode" className="block mb-2 text-sm font-medium">کد پستی</label>
                      <input type="text" name="postalCode" id="postalCode" value={customerFormData.postalCode} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                      <label htmlFor="customerType" className="block mb-2 text-sm font-medium">نوع مشتری</label>
                      <select name="customerType" id="customerType" value={customerFormData.customerType} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                          <option value="شرکتی">شرکتی</option>
                          <option value="شخصی">شخصی</option>
                          <option value="کسب و کار">کسب و کار</option>
                      </select>
                  </div>
                  <div className="md:col-span-2">
                       <label htmlFor="industry" className="block mb-2 text-sm font-medium">صنعت</label>
                      <input type="text" name="industry" id="industry" value={customerFormData.industry} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="internalNotes" className="block mb-2 text-sm font-medium">یادداشت داخلی</label>
                      <textarea name="internalNotes" id="internalNotes" value={customerFormData.internalNotes} onChange={handleInputChange} rows={4} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
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

export default Customers;