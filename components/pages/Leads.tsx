
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    ... (Same as before)
*/
import React, { useState } from 'react';
import LeadsTable from '../sales/LeadsTable';
import { Lead, User } from '../../types';

// Helper to create ISO dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    React.useEffect(() => {
        const mockUsers: User[] = [
          { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
          { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U3' },
        ];
        
        const mockLeads: Lead[] = [
            { id: 'L1', contactName: 'سارا محمدی', companyName: 'فروشگاه سارا', email: 'sara@shop.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 85, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(1), converted: false },
            { id: 'L2', contactName: 'رضا قاسمی', companyName: 'خدمات رضا', email: 'reza@service.com', phone: '09124445566', source: 'ارجاعی', status: 'واجد شرایط', score: 70, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(2), converted: false },
            { id: 'L3', contactName: 'مریم حسینی', companyName: 'بازرگانی حسینی', email: 'maryam@hoss.com', phone: '09127778899', source: 'تماس سرد', status: 'تماس گرفته شده', score: 50, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(3), converted: false },
            { id: 'L4', contactName: 'پیمان عزیزی', companyName: 'صنایع پیمان', email: 'peyman@ind.com', phone: '09121234567', source: 'شبکه اجتماعی', status: 'تبدیل شده', score: 95, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(10), converted: true },
            { id: 'L5', contactName: 'کیمیا راد', companyName: 'استودیو کیمیا', email: 'kimia@studio.com', phone: '09120001122', source: 'وبسایت', status: 'جدید', score: 40, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(11), converted: false },
            { id: 'L6', contactName: 'بهرام نوری', companyName: '', email: 'bahram@mail.com', phone: '09123334455', source: 'ارجاعی', status: 'واجد شرایط', score: 75, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(12), converted: false },
            { id: 'L7', contactName: 'الناز شریفی', companyName: 'گالری الناز', email: 'elnaz@gallery.com', phone: '09125556677', source: 'شبکه اجتماعی', status: 'از دست رفته', score: 20, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(15), converted: false },
            { id: 'L8', contactName: 'فرزاد کریمی', companyName: 'املاک فرزاد', email: 'farzad@realestate.com', phone: '09127778899', source: 'تماس سرد', status: 'تماس گرفته شده', score: 55, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(16), converted: false },
            { id: 'L9', contactName: 'نگار تهرانی', companyName: 'مشاوره نگار', email: 'negar@consult.com', phone: '09129990011', source: 'وبسایت', status: 'جدید', score: 60, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(17), converted: false },
            { id: 'L10', contactName: 'حمیدرضا پناهی', companyName: 'تولیدی پناهی', email: 'hamid@prod.com', phone: '09122223344', source: 'ارجاعی', status: 'واجد شرایط', score: 80, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(18), converted: false },
            { id: 'L11', contactName: 'لیلا عباسی', companyName: 'آموزشگاه لیلا', email: 'leila@edu.com', phone: '09124445566', source: 'شبکه اجتماعی', status: 'جدید', score: 45, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(19), converted: false },
            { id: 'L12', contactName: 'سعید مرادی', companyName: 'تعمیرگاه سعید', email: 'saeed@repair.com', phone: '09126667788', source: 'تماس سرد', status: 'تماس گرفته شده', score: 30, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(20), converted: false },
            { id: 'L13', contactName: 'پریناز ایزدی', companyName: 'دیزاین پریناز', email: 'parinaz@design.com', phone: '09128889900', source: 'وبسایت', status: 'واجد شرایط', score: 90, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(21), converted: false },
            { id: 'L14', contactName: 'محسن فراهانی', companyName: '', email: 'mohsen@mail.com', phone: '09121112222', source: 'ارجاعی', status: 'از دست رفته', score: 10, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: daysAgo(22), converted: false },
            { id: 'L15', contactName: 'آناهیتا صدر', companyName: 'انتشارات صدر', email: 'anahita@pub.com', phone: '09123334444', source: 'شبکه اجتماعی', status: 'تبدیل شده', score: 98, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: daysAgo(25), converted: true },
        ];
        
        setLeads(mockLeads);
        setUsers(mockUsers);
    }, []);

    const handleAddLead = (leadData: Omit<Lead, 'id' | 'assignedTo'>) => {
        const assignee = users.find(u => u.id === leadData.assignedToId);
        const newLead: Lead = {
            id: `L-${Date.now()}`,
            ...leadData,
            assignedTo: assignee
        };
        setLeads(prev => [newLead, ...prev]);
    };

    const handleUpdateLead = (leadToUpdate: Lead) => {
         const assignee = users.find(u => u.id === leadToUpdate.assignedToId);
        setLeads(prev => prev.map(lead => lead.id === leadToUpdate.id ? {...leadToUpdate, assignedTo: assignee} : lead));
    };

    const handleConvertLead = (leadToConvert: Lead, opportunityName: string, opportunityAmount: number) => {
        console.log(`Converting lead ${leadToConvert.id} to opportunity: ${opportunityName} with amount ${opportunityAmount}`);
        setLeads(prev => prev.map(lead => lead.id === leadToConvert.id ? { ...lead, status: 'تبدیل شده', converted: true } : lead));
    };

    return <LeadsTable 
        leads={leads}
        users={users}
        onAddLead={handleAddLead}
        onUpdateLead={handleUpdateLead}
        onConvertLead={handleConvertLead}
    />;
};

export default Leads;
