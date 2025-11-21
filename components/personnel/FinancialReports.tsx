
import React, { useState, useMemo } from 'react';
import { PersonnelRequest, PersonnelRequestType, LeaveType, RequestStatus } from '../../types';
import { toShamsi, toIsoDate } from '../../utils/date';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ArrowDownTrayIcon } from '../icons/ArrowDownTrayIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { exportToCSV } from '../../utils/export';

interface FinancialReportsProps {
    requests: PersonnelRequest[];
}

const requestTypeLabels: Record<PersonnelRequestType, string> = {
    'leave_hourly': 'مرخصی ساعتی',
    'leave_daily': 'مرخصی روزانه',
    'mission': 'ماموریت',
    'overtime': 'اضافه کاری',
    'remote_work': 'دورکاری'
};

const leaveTypeLabels: Record<LeaveType, string> = {
    'estihghaghi': 'استحقاقی',
    'estelaji': 'استعلاجی',
    'bedoon_hoghoogh': 'بدون حقوق'
};

const statusLabels: Record<RequestStatus, string> = {
    'pending': 'در انتظار',
    'approved': 'تایید شده',
    'rejected': 'رد شده',
};

const FinancialReports: React.FC<FinancialReportsProps> = ({ requests }) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(1))); // First day of current month
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRequests = useMemo(() => {
        let result = requests;

        // Date Filter
        if (startDate) {
            const startIso = toIsoDate(startDate).split('T')[0];
            result = result.filter(r => r.startDate.split('T')[0] >= startIso);
        }
        if (endDate) {
            const endIso = toIsoDate(endDate).split('T')[0];
            result = result.filter(r => r.startDate.split('T')[0] <= endIso);
        }

        // Search Filter
        if (searchTerm) {
            result = result.filter(r => r.user?.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sort by User Name then Date
        return result.sort((a, b) => {
            if (a.user?.name === b.user?.name) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return (a.user?.name || '').localeCompare(b.user?.name || '');
        });
    }, [requests, startDate, endDate, searchTerm]);

    const handleExport = () => {
        const exportData = filteredRequests.map(req => ({
            'نام پرسنل': req.user?.name || 'ناشناس',
            'نوع درخواست': requestTypeLabels[req.type],
            'جزئیات': req.leaveType ? leaveTypeLabels[req.leaveType] : (req.destination || '-'),
            'تاریخ شروع': toShamsi(req.startDate),
            'تاریخ پایان': req.endDate ? toShamsi(req.endDate) : '-',
            'زمان': req.startTime ? `${req.startTime} تا ${req.endTime}` : '-',
            'وضعیت': statusLabels[req.status],
            'توضیحات': req.description || '-',
            'تاریخ ثبت': toShamsi(req.createdAt)
        }));

        exportToCSV(exportData, 'personnel_report');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                <div className="w-full md:w-auto">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">از تاریخ</label>
                    <DatePicker 
                        value={startDate}
                        onChange={(d: any) => setStartDate(d ? new Date(d) : null)}
                        calendar={persian}
                        locale={persian_fa}
                        inputClass="w-full md:w-40 p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        portal
                        zIndex={2000}
                    />
                </div>
                <div className="w-full md:w-auto">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">تا تاریخ</label>
                    <DatePicker 
                        value={endDate}
                        onChange={(d: any) => setEndDate(d ? new Date(d) : null)}
                        calendar={persian}
                        locale={persian_fa}
                        inputClass="w-full md:w-40 p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        portal
                        zIndex={2000}
                    />
                </div>
                <div className="w-full md:w-64">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">نام پرسنل</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="جستجو..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                    </div>
                </div>
                <div className="w-full md:w-auto mr-auto">
                    <button 
                        onClick={handleExport}
                        className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm h-[38px]"
                        disabled={filteredRequests.length === 0}
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 ml-2" />
                        <span>خروجی اکسل</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto border rounded-lg dark:border-gray-700">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">نام پرسنل</th>
                            <th className="px-6 py-3">نوع درخواست</th>
                            <th className="px-6 py-3">جزئیات</th>
                            <th className="px-6 py-3">تاریخ</th>
                            <th className="px-6 py-3">وضعیت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    {req.user?.name}
                                </td>
                                <td className="px-6 py-4">
                                    {requestTypeLabels[req.type]}
                                </td>
                                <td className="px-6 py-4">
                                    {req.leaveType && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{leaveTypeLabels[req.leaveType]}</span>}
                                    {req.destination && <span className="block text-xs text-indigo-600 dark:text-indigo-400">{req.destination}</span>}
                                    {req.startTime && <span className="block text-xs text-gray-500">{req.startTime} - {req.endTime}</span>}
                                </td>
                                <td className="px-6 py-4">
                                    {toShamsi(req.startDate)} {req.endDate ? ` تا ${toShamsi(req.endDate)}` : ''}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                                        ${req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                          req.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                          'bg-yellow-100 text-yellow-800'}`}>
                                        {statusLabels[req.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    داده‌ای یافت نشد.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-xs text-gray-500">
                تعداد رکوردها: {filteredRequests.length}
            </div>
        </div>
    );
};

export default FinancialReports;
