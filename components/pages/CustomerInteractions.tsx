import React, { useState, useRef, useEffect } from 'react';
import { Customer, Interaction, User } from '../../types';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { EnvelopeIcon } from '../icons/EnvelopeIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';


// FIX: Removed 'email' property and added 'username' to align with the 'User' type definition.
const mockUsers: User[] = [
  { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
  { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2' },
];

// FIX: Added required 'username' property to align with the 'Customer' type definition.
const mockCustomers: Customer[] = [
  { id: 'C1', companyName: 'شرکت آلفا', contactPerson: 'آقای الف', username: 'alpha', email: 'alpha@co.com', phone: '021-123', status: 'فعال', accountManagerId: 'U1', accountManager: mockUsers[0] },
  { id: 'C2', companyName: 'تجارت بتا', contactPerson: 'خانم ب', username: 'beta', email: 'beta@co.com', phone: '021-456', status: 'غیرفعال', accountManagerId: 'U2', accountManager: mockUsers[1] },
];

const mockInteractions: Interaction[] = [
    { id: 'I1', customerId: 'C1', userId: 'U1', user: mockUsers[0], createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), text: 'تماس اولیه برقرار شد. مشتری به دموی محصول علاقه‌مند است.', type: 'تماس' },
    { id: 'I2', customerId: 'C1', userId: 'U2', user: mockUsers[1], createdAt: new Date(Date.now() - 86400000).toISOString(), text: 'ایمیل حاوی اطلاعات دمو و قیمت ارسال شد.', type: 'ایمیل' },
    { id: 'I3', customerId: 'C1', userId: 'U1', user: mockUsers[0], createdAt: new Date().toISOString(), text: 'جلسه دمو برای هفته آینده تنظیم شد.', type: 'جلسه' },
];


interface CustomerInteractionsProps {
    customerId: string;
    customers: Customer[];
    currentUser: User;
    onBack: () => void;
}

const interactionIcons: Record<Interaction['type'], React.ReactNode> = {
    'یادداشت': <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />,
    'تماس': <PhoneIcon className="w-5 h-5 text-blue-500" />,
    'ایمیل': <EnvelopeIcon className="w-5 h-5 text-green-500" />,
    'جلسه': <UsersIcon className="w-5 h-5 text-purple-500" />,
};

const CustomerInteractions: React.FC<CustomerInteractionsProps> = ({ customerId, customers, currentUser, onBack }) => {
    const [customer, setCustomer] = useState<Customer | null>(() => customers.find(c => c.id === customerId) || null);
    const [interactions, setInteractions] = useState<Interaction[]>(() => mockInteractions.filter(i => i.customerId === customerId));
    
    const [newInteractionText, setNewInteractionText] = useState('');
    const [newInteractionType, setNewInteractionType] = useState<Interaction['type']>('یادداشت');
    const timelineEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [interactions]);

    const handleAddInteraction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newInteractionText.trim() === '' || !customer) return;

        const newInteraction: Interaction = {
            id: `INT-${Date.now()}`,
            customerId: customer.id,
            userId: currentUser.id,
            user: currentUser,
            text: newInteractionText,
            type: newInteractionType,
            createdAt: new Date().toISOString(),
        };

        setInteractions(prev => [...prev, newInteraction]);
        setNewInteractionText('');
        setNewInteractionType('یادداشت');
    };

    if (!customer) return <div className="p-8 text-center">مشتری یافت نشد.</div>

    return (
        <div className="bg-white dark:bg-gray-800 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center">
                     <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-4">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">
                        تعاملات با <span className="text-indigo-600 dark:text-indigo-400">{customer.companyName}</span>
                    </h2>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="relative border-r-2 border-gray-200 dark:border-gray-700 mr-4">
                    {interactions.map((interaction) => (
                        <div key={interaction.id} className="mb-8 flex items-start">
                            <div className="absolute -right-[1.4rem] top-1 bg-white dark:bg-gray-800 p-1 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center h-10 w-10">
                                {interactionIcons[interaction.type]}
                            </div>
                            <div className="mr-8 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={interaction.user.avatar} alt={interaction.user.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{interaction.user.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(interaction.createdAt).toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{interaction.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={timelineEndRef}></div>
                     {interactions.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            هیچ تعاملی برای این مشتری ثبت نشده است.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Interaction Form */}
            <div className="p-4 border-t dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-900/50">
                <form onSubmit={handleAddInteraction} className="flex items-start gap-4">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full mt-2" />
                    <div className="flex-1">
                        <textarea
                            value={newInteractionText}
                            onChange={(e) => setNewInteractionText(e.target.value)}
                            rows={3}
                            placeholder="یادداشت خود را اینجا بنویسید..."
                            className="w-full p-2.5 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" value="یادداشت" checked={newInteractionType === 'یادداشت'} onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} className="form-radio text-indigo-600"/> یادداشت</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" value="تماس" checked={newInteractionType === 'تماس'} onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} className="form-radio text-indigo-600"/> تماس</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" value="ایمیل" checked={newInteractionType === 'ایمیل'} onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} className="form-radio text-indigo-600"/> ایمیل</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" value="جلسه" checked={newInteractionType === 'جلسه'} onChange={(e) => setNewInteractionType(e.target.value as Interaction['type'])} className="form-radio text-indigo-600"/> جلسه</label>
                            </div>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800">
                                ثبت تعامل
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerInteractions;