

import React, { useState, useMemo } from 'react';
import { Interaction, Ticket, User } from '../../types';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toIsoDate, toShamsi } from '../../utils/date';
import { PhoneIcon } from '../icons/PhoneIcon';
import { EnvelopeIcon } from '../icons/EnvelopeIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { TicketsIcon } from '../icons/TicketsIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

interface UserActivityReportProps {
    users: User[];
    interactions: Interaction[];
    tickets: Ticket[];
}

type ActivityType = 'interaction' | 'ticket_created' | 'ticket_reply';

interface ActivityItem {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    type: ActivityType;
    subType?: string; // For interaction type or ticket category
    date: string;
    description: string;
    details?: string;
    relatedTo?: string; // Customer name
}

const UserActivityReport: React.FC<UserActivityReportProps> = ({ users, interactions, tickets }) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [selectedUser, setSelectedUser] = useState<string>('all');

    const activities: ActivityItem[] = useMemo(() => {
        const list: ActivityItem[] = [];
        const startIso = startDate ? toIsoDate(startDate).split('T')[0] : '';
        const endIso = endDate ? toIsoDate(endDate).split('T')[0] : '';

        // Helper to check date range
        const isInRange = (dateStr: string) => {
            const d = dateStr.split('T')[0];
            if (startIso && d < startIso) return false;
            if (endIso && d > endIso) return false;
            return true;
        };

        // Helper for customers map (optional optimization)
        const customersMap: Record<string, string> = {}; // If we passed customers prop, we could fill this.

        // 1. Process Interactions
        interactions.forEach(interaction => {
            if (isInRange(interaction.createdAt)) {
                list.push({
                    id: interaction.id,
                    userId: interaction.userId,
                    userName: interaction.user.name,
                    userAvatar: interaction.user.avatar,
                    type: 'interaction',
                    subType: interaction.type,
                    date: interaction.createdAt,
                    description: interaction.text,
                    relatedTo: customersMap[interaction.customerId] || 'مشتری' // We need customer map, but for now let's rely on context if available or just ID
                });
            }
        });

        // 2. Process Ticket Creations
        tickets.forEach(ticket => {
            if (isInRange(ticket.createdAt) && ticket.assigneeId) { // Assuming assignee created it or we track creator separately. For now using assignee as proxy or just list it.
                 // Note: Ticket structure usually has 'creator', but here we might assume assignee worked on it. 
                 // Better logic: Iterate replies for true user activity. 
                 // However, if we want "Ticket Created", we need a creatorId field. 
                 // Let's assume for this report we focus on REPLIES and Interactions which are clearly user actions.
            }
        });

        // 3. Process Ticket Replies (Actual User Work)
        tickets.forEach(ticket => {
            ticket.replies?.forEach(reply => {
                if (reply.authorType === 'User' && isInRange(reply.createdAt) && reply.authorId) {
                     const user = users.find(u => u.id === reply.authorId);
                     list.push({
                        id: reply.id,
                        userId: reply.authorId,
                        userName: reply.authorName || user?.name || 'Unknown',
                        userAvatar: reply.authorAvatar || user?.avatar,
                        type: 'ticket_reply',
                        subType: ticket.category,
                        date: reply.createdAt,
                        description: reply.text,
                        details: `پاسخ به تیکت #${ticket.id}: ${ticket.subject}`,
                        relatedTo: ticket.customer.name
                    });
                }
            });
        });

        // Filter by selected user
        const filtered = selectedUser === 'all' ? list : list.filter(a => a.userId === selectedUser);

        // Sort by date desc
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    }, [startDate, endDate, selectedUser, interactions, tickets, users]);

    // Group by User
    const groupedActivities: Record<string, ActivityItem[]> = useMemo(() => {
        const groups: Record<string, ActivityItem[]> = {};
        activities.forEach(act => {
            if (!groups[act.userId]) groups[act.userId] = [];
            groups[act.userId].push(act);
        });
        return groups;
    }, [activities]);

    const getIcon = (type: ActivityType, subType?: string) => {
        if (type === 'ticket_reply') return <ChatBubbleLeftRightIcon className="w-5 h-5 text-teal-500" />;
        switch (subType) {
            case 'تماس': return <PhoneIcon className="w-5 h-5 text-blue-500" />;
            case 'ایمیل': return <EnvelopeIcon className="w-5 h-5 text-green-500" />;
            case 'جلسه': return <UsersIcon className="w-5 h-5 text-purple-500" />;
            default: return <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getActionTitle = (type: ActivityType, subType?: string) => {
        if (type === 'ticket_reply') return 'پاسخ به تیکت';
        return `ثبت تعامل (${subType})`;
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col md:flex-row gap-4 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">از تاریخ</label>
                    <DatePicker 
                        value={startDate}
                        onChange={(d: any) => setStartDate(d ? new Date(d) : null)}
                        calendar={persian}
                        locale={persian_fa}
                        inputClass="w-full md:w-40 p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">تا تاریخ</label>
                    <DatePicker 
                        value={endDate}
                        onChange={(d: any) => setEndDate(d ? new Date(d) : null)}
                        calendar={persian}
                        locale={persian_fa}
                        inputClass="w-full md:w-40 p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">کاربر</label>
                    <select 
                        value={selectedUser} 
                        onChange={e => setSelectedUser(e.target.value)} 
                        className="w-full md:w-48 p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="all">همه کاربران</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
                {Object.keys(groupedActivities).length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg">
                        هیچ فعالیتی در این بازه زمانی یافت نشد.
                    </div>
                ) : (
                    Object.entries(groupedActivities).map(([userId, userActs]) => {
                        const user = users.find(u => u.id === userId) || { name: 'کاربر حذف شده', avatar: '' };
                        return (
                            <div key={userId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{userActs.length} فعالیت ثبت شده</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {userActs.map(act => (
                                        <div key={act.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex gap-4">
                                            <div className="mt-1 flex-shrink-0">
                                                {getIcon(act.type, act.subType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {getActionTitle(act.type, act.subType)}
                                                        {act.relatedTo && <span className="font-normal text-gray-500 dark:text-gray-400"> برای <span className="text-indigo-600 dark:text-indigo-400">{act.relatedTo}</span></span>}
                                                    </p>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap mr-2" dir="ltr">
                                                        {toShamsi(act.date, "HH:mm")}
                                                    </span>
                                                </div>
                                                {act.details && <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">{act.details}</p>}
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{act.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default UserActivityReport;