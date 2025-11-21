
import React, { useState } from 'react';
import { User, PersonnelRequest, RequestStatus } from '../../types';
import RequestModal from '../personnel/RequestModal';
import MyRequests from '../personnel/MyRequests';
import TeamRequests from '../personnel/TeamRequests';
import FinancialReports from '../personnel/FinancialReports';
import { PlusIcon } from '../icons/PlusIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { DocumentChartBarIcon } from '../icons/DocumentChartBarIcon';

interface PersonnelProps {
    currentUser: User;
    requests: PersonnelRequest[];
    onAddRequest: (request: Omit<PersonnelRequest, 'id' | 'status' | 'createdAt' | 'userId' | 'managerId'>) => void;
    onUpdateRequestStatus: (requestId: string, status: RequestStatus) => void;
}

type ActiveTab = 'my_requests' | 'team_requests' | 'financial_reports';

const Personnel: React.FC<PersonnelProps> = ({ currentUser, requests, onAddRequest, onUpdateRequestStatus }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('my_requests');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter requests for the current user
    const myRequests = requests.filter(req => req.userId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter requests where current user is the manager
    const teamRequests = requests.filter(req => req.managerId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pendingCount = teamRequests.filter(r => r.status === 'pending').length;

    return (
        <div className="h-full flex flex-col">
            {/* Header and Tabs */}
            <div className="bg-white dark:bg-gray-800 p-6 pb-0 rounded-t-lg shadow-sm border-b dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BriefcaseIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        امور پرسنلی و مرخصی
                    </h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 ml-2" />
                        <span>ثبت درخواست جدید</span>
                    </button>
                </div>

                <div className="flex space-i-8 overflow-x-auto pt-3">
                    <button
                        onClick={() => setActiveTab('my_requests')}
                        className={`pb-4 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                            ${activeTab === 'my_requests' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        درخواست‌های من
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('team_requests')}
                        className={`pb-4 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 relative whitespace-nowrap
                            ${activeTab === 'team_requests' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <UserGroupIcon className="w-4 h-4" />
                        کارتابل مدیریت
                        {pendingCount > 0 && (
                            <span className="absolute -top-1 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-sm">
                                {pendingCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('financial_reports')}
                        className={`pb-4 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
                            ${activeTab === 'financial_reports' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <DocumentChartBarIcon className="w-4 h-4" />
                        گزارشات
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-md overflow-hidden">
                {activeTab === 'my_requests' && <MyRequests requests={myRequests} />}
                {activeTab === 'team_requests' && <TeamRequests requests={teamRequests} onUpdateStatus={onUpdateRequestStatus} />}
                {activeTab === 'financial_reports' && <FinancialReports requests={requests} />}
            </div>

            {/* Request Modal */}
            <RequestModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onAddRequest}
            />
        </div>
    );
};

export default Personnel;
