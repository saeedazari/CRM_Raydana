
import React, { useState } from 'react';
import { PersonnelRequest, PersonnelRequestType, LeaveType } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { toIsoDate } from '../../utils/date';

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (request: Omit<PersonnelRequest, 'id' | 'status' | 'createdAt' | 'userId' | 'managerId'>) => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [type, setType] = useState<PersonnelRequestType>('leave_hourly');
    const [leaveType, setLeaveType] = useState<LeaveType>('estihghaghi');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [destination, setDestination] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!startDate) {
            alert('لطفا تاریخ شروع را وارد کنید.');
            return;
        }

        onSubmit({
            type,
            leaveType: (type === 'leave_hourly' || type === 'leave_daily') ? leaveType : undefined,
            startDate: toIsoDate(startDate),
            endDate: (type === 'leave_daily' && endDate) ? toIsoDate(endDate) : undefined,
            startTime: (type !== 'leave_daily' && type !== 'remote_work') ? startTime : undefined,
            endTime: (type !== 'leave_daily' && type !== 'remote_work') ? endTime : undefined,
            destination: type === 'mission' ? destination : undefined,
            description
        });
        onClose();
    };

    const requestTypes: { id: PersonnelRequestType; label: string }[] = [
        { id: 'leave_hourly', label: 'مرخصی ساعتی' },
        { id: 'leave_daily', label: 'مرخصی روزانه' },
        { id: 'mission', label: 'ماموریت' },
        { id: 'overtime', label: 'اضافه کاری' },
        { id: 'remote_work', label: 'دورکاری' },
    ];

    const isDateRange = type === 'leave_daily' || type === 'remote_work';
    const isTimeRange = type === 'leave_hourly' || type === 'mission' || type === 'overtime';

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={onClose}></div>
            <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-md shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ثبت درخواست جدید</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                        
                        {/* Request Type */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">نوع درخواست</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value as PersonnelRequestType)} 
                                className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            >
                                {requestTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>

                        {/* Leave Type (Conditional) */}
                        {(type === 'leave_hourly' || type === 'leave_daily') && (
                            <div>
                                <label className="block mb-2 text-sm font-medium">نوع مرخصی</label>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1 text-sm cursor-pointer">
                                        <input type="radio" name="leaveType" value="estihghaghi" checked={leaveType === 'estihghaghi'} onChange={() => setLeaveType('estihghaghi')} />
                                        استحقاقی
                                    </label>
                                    <label className="flex items-center gap-1 text-sm cursor-pointer">
                                        <input type="radio" name="leaveType" value="estelaji" checked={leaveType === 'estelaji'} onChange={() => setLeaveType('estelaji')} />
                                        استعلاجی
                                    </label>
                                    <label className="flex items-center gap-1 text-sm cursor-pointer">
                                        <input type="radio" name="leaveType" value="bedoon_hoghoogh" checked={leaveType === 'bedoon_hoghoogh'} onChange={() => setLeaveType('bedoon_hoghoogh')} />
                                        بدون حقوق
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">{isDateRange ? 'تاریخ شروع' : 'تاریخ'}</label>
                                <DatePicker 
                                    value={startDate}
                                    onChange={(d: any) => setStartDate(d ? new Date(d) : null)}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    inputClass="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            {isDateRange && (
                                <div>
                                    <label className="block mb-2 text-sm font-medium">تاریخ پایان</label>
                                    <DatePicker 
                                        value={endDate}
                                        onChange={(d: any) => setEndDate(d ? new Date(d) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        inputClass="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Time Selection (Conditional) */}
                        {isTimeRange && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium">ساعت شروع</label>
                                    <input 
                                        type="time" 
                                        value={startTime} 
                                        onChange={e => setStartTime(e.target.value)} 
                                        className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ltr-input text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium">ساعت پایان</label>
                                    <input 
                                        type="time" 
                                        value={endTime} 
                                        onChange={e => setEndTime(e.target.value)} 
                                        className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ltr-input text-center"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Destination (Mission only) */}
                        {type === 'mission' && (
                            <div>
                                <label className="block mb-2 text-sm font-medium">مقصد ماموریت</label>
                                <input 
                                    type="text" 
                                    value={destination} 
                                    onChange={e => setDestination(e.target.value)} 
                                    className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="نام شهر یا محل"
                                    required
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">توضیحات (علت)</label>
                            <textarea 
                                rows={3} 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            ></textarea>
                        </div>

                    </div>
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700 mt-auto">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-3 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">انصراف</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">ثبت درخواست</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
