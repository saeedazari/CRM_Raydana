/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    این کامپوننت یک Wrapper برای کامپوننت LeadsTable است و منطق اصلی state را مدیریت می‌کند.

    1. دریافت لیست سرنخ‌ها (Leads)
    - Route: /api/leads
    - Method: GET
    - Expected Query Params: ?page, limit, search, status, source
    - Response JSON Schema: { "data": [Lead] }
    - توضیح منطق بکند مورد نیاز: دریافت لیست سرنخ‌ها با قابلیت فیلتر و صفحه‌بندی.

    2. افزودن سرنخ جدید
    - Route: /api/leads
    - Method: POST
    - Expected Body JSON Schema: Omit<Lead, 'id'>
    - Response JSON Schema: Lead (سرنخ جدید)

    3. ویرایش سرنخ
    - Route: /api/leads/:id
    - Method: PUT
    - Expected Body JSON Schema: Partial<Lead>
    - Response JSON Schema: Lead (سرنخ ویرایش شده)

    4. تبدیل سرنخ به فرصت و مشتری (Convert Lead)
    - Route: /api/leads/:id/convert
    - Method: POST
    - Expected Body JSON Schema: { "opportunityName": "string", "opportunityAmount": number }
    - Response JSON Schema: { "success": true, "customerId": "string", "opportunityId": "string" }
    - توضیح منطق بکند مورد نیاز: این یک عملیات پیچیده است. بک‌اند باید:
        1. وضعیت سرنخ را به "تبدیل شده" تغییر دهد.
        2. یک رکورد جدید در جدول مشتریان (Customers) بر اساس اطلاعات سرنخ ایجاد کند.
        3. یک رکورد جدید در جدول فرصت‌ها (Opportunities) با اطلاعات دریافتی ایجاد کند و آن را به مشتری جدید مرتبط سازد.
        4. این عملیات باید به صورت Transaction انجام شود تا در صورت خطا، تمام تغییرات rollback شوند.

    - Dependencies: تمام endpoint ها نیاز به Auth Token دارند.
*/
import React, { useState } from 'react';
import LeadsTable from '../sales/LeadsTable';
import { Lead, User } from '../../types';

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده‌ها موقتی هستند و باید از API دریافت شوند.
*/
// // FIX: Removed 'email' property and added 'username' to align with the 'User' type definition.
// const mockUsers: User[] = [
//   { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
//   { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U3' },
// ];

// const mockLeads: Lead[] = [
//     { id: 'L1', contactName: 'سارا محمدی', companyName: 'فروشگاه سارا', email: 'sara@shop.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 85, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: '1403/05/01', converted: false },
//     { id: 'L2', contactName: 'رضا قاسمی', companyName: 'خدمات رضا', email: 'reza@service.com', phone: '09124445566', source: 'ارجاعی', status: 'واجد شرایط', score: 70, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: '1403/04/28', converted: false },
//     { id: 'L3', contactName: 'مریم حسینی', companyName: '', email: 'maryam@mail.com', phone: '09127778899', source: 'تماس سرد', status: 'تماس گرفته شده', score: 50, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: '1403/04/25', converted: false },
//     { id: 'L4', contactName: 'پیمان عزیزی', companyName: 'صنایع پیمان', email: 'peyman@industry.com', phone: '09121234567', source: 'شبکه اجتماعی', status: 'تبدیل شده', score: 95, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: '1403/04/15', converted: true },
// ];

const Leads: React.FC = () => {
    // state ها باید از API دریافت شوند
    const [leads, setLeads] = useState<Lead[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    React.useEffect(() => {
        /*
          === API CALL REQUIRED HERE ===
          - Route: /api/leads, /api/users
          - Method: GET
          - Output: Lists of leads and users.
        */
        const mockUsers: User[] = [
          { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
          { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U3' },
        ];
        const mockLeads: Lead[] = [
            { id: 'L1', contactName: 'سارا محمدی', companyName: 'فروشگاه سارا', email: 'sara@shop.com', phone: '09121112233', source: 'وبسایت', status: 'جدید', score: 85, assignedToId: 'U1', assignedTo: mockUsers[0], createdAt: '1403/05/01', converted: false },
            { id: 'L2', contactName: 'رضا قاسمی', companyName: 'خدمات رضا', email: 'reza@service.com', phone: '09124445566', source: 'ارجاعی', status: 'واجد شرایط', score: 70, assignedToId: 'U3', assignedTo: mockUsers[1], createdAt: '1403/04/28', converted: false },
        ];
        setLeads(mockLeads);
        setUsers(mockUsers);
    }, []);

    const handleAddLead = (leadData: Omit<Lead, 'id' | 'assignedTo'>) => {
        /* === API CALL REQUIRED HERE (in LeadsTable.tsx) === */
        const assignee = users.find(u => u.id === leadData.assignedToId);
        const newLead: Lead = {
            id: `L-${Date.now()}`,
            ...leadData,
            assignedTo: assignee
        };
        setLeads(prev => [newLead, ...prev]);
    };

    const handleUpdateLead = (leadToUpdate: Lead) => {
        /* === API CALL REQUIRED HERE (in LeadsTable.tsx) === */
         const assignee = users.find(u => u.id === leadToUpdate.assignedToId);
        setLeads(prev => prev.map(lead => lead.id === leadToUpdate.id ? {...leadToUpdate, assignedTo: assignee} : lead));
    };

    const handleConvertLead = (leadToConvert: Lead, opportunityName: string, opportunityAmount: number) => {
        /* === API CALL REQUIRED HERE (in LeadsTable.tsx) === */
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