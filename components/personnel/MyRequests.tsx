
import React from 'react';
import { PersonnelRequest, PersonnelRequestType, LeaveType } from '../../types';
import { toShamsi, formatTime } from '../../utils/date';

interface MyRequestsProps {
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

const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels: Record<string, string> = {
    'pending': 'در انتظار تایید',
    'approved': 'تایید شده',
    'rejected': 'رد شده',
};

const MyRequests: React.FC<MyRequestsProps> = ({ requests }) => {
    return (
        <div className="overflow-x-auto h-full">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th className="px-6 py-3">نوع درخواست</th>
                        <th className="px-6 py-3">جزئیات</th>
                        <th className="px-6 py-3">تاریخ / زمان</th>
                        <th className="px-6 py-3">توضیحات</th>
                        <th className="px-6 py-3 text-center">وضعیت</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {requestTypeLabels[req.type]}
                            </td>
                            <td className="px-6 py-4">
                                {req.leaveType && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{leaveTypeLabels[req.leaveType]}</span>}
                                {req.destination && <span className="block text-xs text-indigo-600 dark:text-indigo-400">مقصد: {req.destination}</span>}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span>{toShamsi(req.startDate)} {req.endDate ? ` تا ${toShamsi(req.endDate)}` : ''}</span>
                                    {req.startTime && (
                                        <span className="text-xs text-gray-500 mt-1">
                                            {req.startTime} تا {req.endTime}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate" title={req.description}>
                                {req.description || '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[req.status]}`}>
                                    {statusLabels[req.status]}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                درخواستی یافت نشد.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyRequests;
