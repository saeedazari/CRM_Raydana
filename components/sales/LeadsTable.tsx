import React, { useState, useMemo, useEffect } from 'react';
import { Lead, LeadStatus, LeadSource, User } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { ArrowPathIcon } from '../icons/ArrowPathIcon';

const statusColors: { [key in LeadStatus]: string } = {
    'جدید': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'تماس گرفته شده': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'واجد شرایط': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    'تبدیل شده': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'از دست رفته': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const ITEMS_PER_PAGE = 10;

const initialLeadState: Omit<Lead, 'id'> = {
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    source: 'وبسایت',
    status: 'جدید',
    score: 50,
    assignedTo: '',
    createdAt: new Date().toLocaleDateString('fa-IR-u-nu-latn'),
    converted: false,
};


interface LeadsTableProps {
    leads: Lead[];
    onConvertLead: (lead: Lead, opportunityName: string, opportunityAmount: number) => void;
    onAddLead: (lead: Omit<Lead, 'id'>) => void;
    onUpdateLead: (lead: Lead) => void;
    users: User[];
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onConvertLead, onAddLead, onUpdateLead, users }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [leadFormData, setLeadFormData] = useState<Omit<Lead, 'id'>>(initialLeadState);

    const [isConvertPanelOpen, setIsConvertPanelOpen] = useState(false);
    const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
    const [opportunityName, setOpportunityName] = useState('');
    const [opportunityAmount, setOpportunityAmount] = useState(0);
    
    useEffect(() => {
        if (editingLead) {
            setLeadFormData(editingLead);
        } else {
            setLeadFormData(initialLeadState);
        }
    }, [editingLead]);

    const filteredLeads = useMemo(() =>
        leads.filter(lead =>
            (lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'all' || lead.status === statusFilter) &&
            (sourceFilter === 'all' || lead.source === sourceFilter)
        ).sort((a, b) => new Date(b.createdAt.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')).getTime() - new Date(a.createdAt.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')).getTime()),
        [searchTerm, statusFilter, sourceFilter, leads]
    );

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredLeads, currentPage]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLeadFormData(prev => ({...prev, [name]: name === 'score' ? parseInt(value) : value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLead) {
            onUpdateLead({ ...leadFormData, id: editingLead.id });
        } else {
            onAddLead(leadFormData);
        }
        closePanel();
    };
    
    const openPanel = (lead: Lead | null = null) => {
        setEditingLead(lead);
        setIsPanelOpen(true);
    };
    const closePanel = () => {
        setIsPanelOpen(false);
        setEditingLead(null);
    };
    
    const openConvertPanel = (lead: Lead) => {
        setLeadToConvert(lead);
        setOpportunityName(`پروژه برای ${lead.companyName || lead.contactName}`);
        setOpportunityAmount(0);
        setIsConvertPanelOpen(true);
    };
    const closeConvertPanel = () => {
        setIsConvertPanelOpen(false);
        setLeadToConvert(null);
    };
    const handleConvert = (e: React.FormEvent) => {
        e.preventDefault();
        if (leadToConvert) {
            onConvertLead(leadToConvert, opportunityName, opportunityAmount);
            closeConvertPanel();
        }
    };

    return (
        <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                     <div className="relative w-full sm:w-auto">
                        <input type="text" placeholder="جستجوی سرنخ..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full sm:w-56 pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
                    </div>
                     <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="all">همه وضعیت‌ها</option>
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                     <select value={sourceFilter} onChange={e => {setSourceFilter(e.target.value); setCurrentPage(1);}} className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="all">همه منابع</option>
                        <option value="وبسایت">وبسایت</option>
                        <option value="ارجاعی">ارجاعی</option>
                        <option value="تماس سرد">تماس سرد</option>
                        <option value="شبکه اجتماعی">شبکه اجتماعی</option>
                    </select>
                 </div>
                <button onClick={() => openPanel()} className="flex-shrink-0 flex items-center justify-center w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                    <LightBulbIcon className="w-5 h-5 ml-2" />
                    <span>سرنخ جدید</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-3">نام رابط</th>
                            <th scope="col" className="px-4 py-3">شرکت</th>
                            <th scope="col" className="px-4 py-3">منبع</th>
                            <th scope="col" className="px-4 py-3 text-center">امتیاز</th>
                            <th scope="col" className="px-4 py-3">کارشناس</th>
                            <th scope="col" className="px-4 py-3 text-center">وضعیت</th>
                            <th scope="col" className="px-4 py-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLeads.map(lead => (
                            <tr key={lead.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.contactName}</td>
                                <td className="px-4 py-3">{lead.companyName || '-'}</td>
                                <td className="px-4 py-3">{lead.source}</td>
                                <td className="px-4 py-3 text-center">{lead.score}</td>
                                <td className="px-4 py-3">{lead.assignedTo}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>{lead.status}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        {lead.converted ? (
                                            <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-semibold">
                                                <CheckBadgeIcon className="w-5 h-5 ml-1"/>
                                                تبدیل شده
                                            </span>
                                        ) : (
                                            <button onClick={() => openConvertPanel(lead)} className="p-1 text-gray-500 hover:text-green-600 dark:hover:text-green-400" aria-label="Convert Lead"><ArrowPathIcon className="w-5 h-5" /></button>
                                        )}
                                        <button onClick={() => openPanel(lead)} className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Edit"><PencilIcon className="w-5 h-5" /></button>
                                        <button className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add/Edit Lead Panel */}
        <div className={`fixed inset-0 z-40 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
            <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold">{editingLead ? 'ویرایش سرنخ' : 'افزودن سرنخ جدید'}</h3>
                    <button onClick={closePanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contactName" className="block mb-2 text-sm">نام رابط</label>
                                <input type="text" name="contactName" value={leadFormData.contactName} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required />
                            </div>
                            <div>
                                <label htmlFor="companyName" className="block mb-2 text-sm">شرکت</label>
                                <input type="text" name="companyName" value={leadFormData.companyName} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm">ایمیل</label>
                                <input type="email" name="email" value={leadFormData.email} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block mb-2 text-sm">تلفن</label>
                                <input type="tel" name="phone" value={leadFormData.phone} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" />
                            </div>
                            <div>
                                <label htmlFor="source" className="block mb-2 text-sm">منبع</label>
                                <select name="source" value={leadFormData.source} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700">
                                    <option value="وبسایت">وبسایت</option>
                                    <option value="ارجاعی">ارجاعی</option>
                                    <option value="تماس سرد">تماس سرد</option>
                                    <option value="شبکه اجتماعی">شبکه اجتماعی</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="status" className="block mb-2 text-sm">وضعیت</label>
                                <select name="status" value={leadFormData.status} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700">
                                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="assignedTo" className="block mb-2 text-sm">کارشناس</label>
                                <select name="assignedTo" value={leadFormData.assignedTo} onChange={handleFormChange} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700" required>
                                    <option value="">انتخاب کنید</option>
                                    {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="score" className="block mb-2 text-sm">امتیاز ({leadFormData.score})</label>
                                <input type="range" name="score" min="0" max="100" value={leadFormData.score} onChange={handleFormChange} className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                        <button type="button" onClick={closePanel} className="px-4 py-2 ml-3 text-sm font-medium">انصراف</button>
                        <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg">ذخیره</button>
                    </div>
                </form>
            </div>
        </div>

        {/* Convert Lead Panel */}
      <div className={`fixed inset-0 z-50 ${isConvertPanelOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isConvertPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closeConvertPanel}></div>
        <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-lg shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isConvertPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-semibold">تبدیل سرنخ</h3>
            <button onClick={closeConvertPanel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleConvert} className="flex flex-col overflow-hidden flex-grow">
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">اطلاعات سرنخ</h4>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                        <p><strong>نام رابط:</strong> {leadToConvert?.contactName}</p>
                        <p><strong>شرکت:</strong> {leadToConvert?.companyName || 'ندارد'}</p>
                        <p><strong>ایمیل:</strong> {leadToConvert?.email || 'ندارد'}</p>
                    </div>
                </div>
                 <hr className="dark:border-gray-600"/>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">ایجاد فرصت فروش جدید</h4>
                    <div>
                        <label htmlFor="opportunityName" className="block mb-2 text-sm font-medium">نام فرصت</label>
                        <input type="text" name="opportunityName" id="opportunityName" value={opportunityName} onChange={(e) => setOpportunityName(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                     <div className="mt-4">
                        <label htmlFor="opportunityAmount" className="block mb-2 text-sm font-medium">مبلغ تخمینی (تومان)</label>
                        <input type="number" name="opportunityAmount" id="opportunityAmount" value={opportunityAmount} onChange={(e) => setOpportunityAmount(Number(e.target.value))} className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                    با تبدیل این سرنخ، یک <strong>مشتری جدید</strong> و یک <strong>فرصت فروش جدید</strong> در سیستم ایجاد خواهد شد.
                </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 space-i-3 flex-shrink-0">
              <button type="button" onClick={closeConvertPanel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">انصراف</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800">تایید و تبدیل</button>
            </div>
          </form>
        </div>
      </div>
        </>
    );
};

export default LeadsTable;