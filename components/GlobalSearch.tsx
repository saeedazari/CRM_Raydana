
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Customer, Ticket, Lead, Task, Product, Quote, Invoice, PurchaseOrder, User } from '../types';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { CustomersIcon } from './icons/CustomersIcon';
import { TicketsIcon } from './icons/TicketsIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { CubeIcon } from './icons/CubeIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';

interface GlobalSearchProps {
    user: User;
    customers: Customer[];
    tickets: Ticket[];
    leads: Lead[];
    tasks: Task[];
    products: Product[];
    quotes: Quote[];
    invoices: Invoice[];
    purchaseOrders: PurchaseOrder[];
    onNavigate: (page: string, params?: any) => void;
}

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    type: 'customer' | 'ticket' | 'lead' | 'task' | 'product' | 'quote' | 'invoice' | 'purchaseOrder';
    data: any;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
    user, customers, tickets, leads, tasks, products, quotes, invoices, purchaseOrders, onNavigate 
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle search with Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasPermission = (permission: string) => {
      if (!permission) return true;
      if (!user.role || !user.role.permissions) return false;
      const perms = user.role.permissions.split(',');
      return perms.includes(permission);
    };

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        const allResults: SearchResult[] = [];

        const hasViewCustomers = hasPermission('view_customers');
        const hasViewTickets = hasPermission('view_tickets');
        const hasViewSales = hasPermission('view_sales');
        // Invoices often fall under view_sales or view_finance or view_invoices
        const hasViewInvoices = hasPermission('view_invoices') || hasPermission('view_sales') || hasPermission('view_finance');
        const hasViewInventory = hasPermission('view_inventory');
        const hasViewPurchases = hasPermission('manage_purchases'); // Or a specific view_purchases if defined

        // Customers
        if (hasViewCustomers) {
            customers.forEach(c => {
                if (c.name.toLowerCase().includes(lowerQuery) || c.email?.toLowerCase().includes(lowerQuery) || c.phone.includes(lowerQuery)) {
                    allResults.push({ id: c.id, title: c.name, subtitle: `مشتری - ${c.phone}`, type: 'customer', data: c });
                }
            });
        }

        // Tickets
        if (hasViewTickets) {
            tickets.forEach(t => {
                if (t.subject.toLowerCase().includes(lowerQuery) || t.id.toLowerCase().includes(lowerQuery)) {
                    allResults.push({ id: t.id, title: t.subject, subtitle: `تیکت ${t.id} - ${t.status}`, type: 'ticket', data: t });
                }
            });
        }

        // Leads
        if (hasViewSales) {
            leads.forEach(l => {
                if (l.contactName.toLowerCase().includes(lowerQuery) || l.companyName?.toLowerCase().includes(lowerQuery)) {
                    allResults.push({ id: l.id, title: l.contactName, subtitle: `سرنخ - ${l.companyName || 'شخصی'}`, type: 'lead', data: l });
                }
            });
        }

        // Tasks (Generally allowed for all users, usually filtered to their own, but global search might find assigned tasks)
        tasks.forEach(t => {
            if (t.title.toLowerCase().includes(lowerQuery)) {
                allResults.push({ id: t.id, title: t.title, subtitle: `وظیفه - ${t.status}`, type: 'task', data: t });
            }
        });

        // Products
        if (hasViewSales || hasViewInventory) {
            products.forEach(p => {
                if (p.name.toLowerCase().includes(lowerQuery) || p.code?.toLowerCase().includes(lowerQuery)) {
                    allResults.push({ id: p.id, title: p.name, subtitle: `محصول - ${p.price.toLocaleString()} تومان`, type: 'product', data: p });
                }
            });
        }

        // Invoices
        if (hasViewInvoices) {
            invoices.forEach(i => {
                if (i.customerName.toLowerCase().includes(lowerQuery) || i.id.toLowerCase().includes(lowerQuery)) {
                    allResults.push({ id: i.id, title: `فاکتور ${i.customerName}`, subtitle: `${i.id} - ${i.totalAmount.toLocaleString()} تومان`, type: 'invoice', data: i });
                }
            });
        }
        
        // Quotes
        if (hasViewSales) {
            quotes.forEach(q => {
                if (q.customerName.toLowerCase().includes(lowerQuery) || q.id.toLowerCase().includes(lowerQuery)) {
                    allResults.push({ id: q.id, title: `پیش‌فاکتور ${q.customerName}`, subtitle: `${q.id} - ${q.status}`, type: 'quote', data: q });
                }
            });
        }

        // Purchase Orders
        if (hasViewPurchases) {
            purchaseOrders.forEach(p => {
                if (p.vendorName.toLowerCase().includes(lowerQuery) || p.id.toLowerCase().includes(lowerQuery)) {
                    allResults.push({ id: p.id, title: `خرید از ${p.vendorName}`, subtitle: `${p.id} - ${p.status}`, type: 'purchaseOrder', data: p });
                }
            });
        }

        return allResults.slice(0, 10); // Limit to 10 results
    }, [query, customers, tickets, leads, tasks, products, quotes, invoices, purchaseOrders, user]);

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        
        switch (result.type) {
            case 'customer':
                onNavigate('customerInteractions', { customerId: result.id });
                break;
            case 'ticket':
                onNavigate('tickets'); // Ideal: pass ID to highlight/open
                break;
            case 'lead':
                onNavigate('leads');
                break;
            case 'task':
                onNavigate('tasks'); // Ideal: pass ID to open modal
                break;
            case 'product':
                onNavigate('products');
                break;
            case 'quote':
                onNavigate('quotes', { action: 'edit', entityId: result.id });
                break;
            case 'invoice':
                onNavigate('invoices', { action: 'edit', entityId: result.id });
                break;
            case 'purchaseOrder':
                onNavigate('purchaseOrders', { action: 'edit', entityId: result.id });
                break;
        }
    };

    const getIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'customer': return <CustomersIcon className="w-5 h-5 text-blue-500" />;
            case 'ticket': return <TicketsIcon className="w-5 h-5 text-green-500" />;
            case 'lead': return <LightBulbIcon className="w-5 h-5 text-yellow-500" />;
            case 'task': return <ClipboardDocumentCheckIcon className="w-5 h-5 text-purple-500" />;
            case 'product': return <CubeIcon className="w-5 h-5 text-red-500" />;
            case 'quote': return <DocumentDuplicateIcon className="w-5 h-5 text-indigo-500" />;
            case 'invoice': return <CreditCardIcon className="w-5 h-5 text-emerald-500" />;
            case 'purchaseOrder': return <ShoppingBagIcon className="w-5 h-5 text-orange-500" />;
            default: return <MagnifyingGlassIcon className="w-5 h-5" />;
        }
    };

    return (
        <div className="relative flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="block w-full pr-10 pl-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                    placeholder="جستجوی سراسری..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">Ctrl K</span>
                </div>
            </div>

            {isOpen && query.length > 0 && (
                <div ref={dropdownRef} className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto ring-1 ring-black ring-opacity-5">
                    <ul className="py-1">
                        {results.length > 0 ? (
                            results.map((result, index) => (
                                <li key={result.id + result.type}>
                                    <button
                                        onClick={() => handleSelect(result)}
                                        className={`w-full text-right px-4 py-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ${index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                                    >
                                        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-full p-2 ml-3">
                                            {getIcon(result.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{result.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                                        </div>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                نتیجه‌ای یافت نشد.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
