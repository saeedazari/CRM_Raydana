import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';

interface UserProfileProps {
    user: User | null;
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
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

    if (!user) {
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                     <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white font-bold text-sm">
                        {user.name.charAt(0)}
                    </span>
                )}

                <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 origin-top-left bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full text-right flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 ml-3" />
                            <span>خروج از حساب</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;