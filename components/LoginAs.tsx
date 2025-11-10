import React, { useState, useRef, useEffect } from 'react';
import { User, Customer } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface LoginAsProps {
    users: User[];
    customers: Customer[];
    currentUser: User | Customer | null;
    onLoginAs: (userOrCustomer: User | Customer, type: 'crm' | 'portal') => void;
}

const LoginAs: React.FC<LoginAsProps> = ({ users, customers, currentUser, onLoginAs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (userOrCustomer: User | Customer, type: 'crm' | 'portal') => {
        onLoginAs(userOrCustomer, type);
        setIsOpen(false);
    }
    
    const currentUserName = currentUser ? ('name' in currentUser ? currentUser.name : currentUser.companyName) : "ورود";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-i-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                {'avatar' in (currentUser || {}) ? (
                    <img src={(currentUser as User).avatar} alt={currentUserName} className="w-8 h-8 rounded-full" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-gray-500" />
                    </div>
                )}

                <span className="hidden sm:inline font-medium">{currentUserName}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-900/50">ورود به عنوان کارشناس</div>
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                <a href="#" onClick={e => {e.preventDefault(); handleSelect(user, 'crm')}} className="flex items-center p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <img src={user.avatar} className="w-6 h-6 rounded-full ml-2" />
                                    {user.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                     <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">ورود به عنوان مشتری (پورتال)</div>
                     <ul>
                        {customers.map(customer => (
                             <li key={customer.id}>
                                <a href="#" onClick={e => {e.preventDefault(); handleSelect(customer, 'portal')}} className="flex items-center p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <UserCircleIcon className="w-6 h-6 text-gray-400 ml-2" />
                                    {customer.companyName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LoginAs;
