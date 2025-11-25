
import React from 'react';
import { PersonnelRequest, RequestStatus, LeaveType, PersonnelRequestType } from '../../types';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { toShamsi } from '../../utils/date';

interface TeamRequestsProps {
    requests: PersonnelRequest[];
    onUpdateStatus: (requestId: string, status: RequestStatus) => void;
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

const TeamRequests: React.FC<TeamRequestsProps> = ({ requests, onUpdateStatus }) => {
    
    const handleApprove = (id: string) => {
        if (window.confirm('آیا از تایید این درخواست اطمینان دارید؟')) {
            onUpdateStatus(id, 'approved');
        }
    };

    const handleReject = (id: string) => {
        if (window.confirm('آیا از رد این درخواست اطمینان دارید؟')) {
            onUpdateStatus(id, 'rejected');
        }
    };

    return (
        <div className="overflow-x-auto h-full">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th className="px-6 py-3">پرسنل</th>
                        <th className="px-6 py-3">نوع درخواست</th>
                        <th className="px-6 py-3">جزئیات</th>
                        <th className="px-6 py-3">تاریخ / زمان</th>
                        <th className="px-6 py-3">توضیحات</th>
                        <th className="px-6 py-3 text-center">وضعیت</th>
                        <th className="px-6 py-3 text-center">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                {req.user?.avatar && <img src={req.user.avatar} alt="" className="w-6 h-6 rounded-full" />}
                                {req.user?.name || 'کاربر ناشناس'}
                            </td>
                            <td className="px-6 py-4">
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
                            <td className="px-6 py-4 text-center">
                                {req.status === 'pending' ? (
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => handleApprove(req.id)}
                                            className="flex items-center justify-center text-green-600 hover:text-green-800 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                                            title="تایید درخواست"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleReject(req.id)}
                                            className="flex items-center justify-center text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                                            title="رد درخواست"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                درخواستی برای بررسی وجود ندارد.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TeamRequests;
