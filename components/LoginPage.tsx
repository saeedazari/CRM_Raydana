import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { CustomersIcon } from './icons/CustomersIcon';

interface LoginPageProps {
    onLogin: (type: 'user' | 'customer', username: string, pass: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'user' | 'customer'>('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(activeTab, username, password);
        if (!success) {
            setError('نام کاربری یا رمز عبور نامعتبر است.');
        }
    };
    
    const changeTab = (tab: 'user' | 'customer') => {
        setActiveTab(tab);
        setUsername('');
        setPassword('');
        setError('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">CRM Pro</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">به پنل مدیریت خود خوش آمدید</p>
                </div>
                
                <div>
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => changeTab('user')}
                            className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'user'
                                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <UserIcon className="w-5 h-5" />
                            ورود کاربران
                        </button>
                        <button
                            onClick={() => changeTab('customer')}
                            className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'customer'
                                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                           <CustomersIcon className="w-5 h-5" />
                            ورود مشتریان
                        </button>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username" className="sr-only">نام کاربری</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="نام کاربری"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">رمز عبور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="رمز عبور"
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                فراموشی رمز عبور
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex justify-center w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            ورود به پنل
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;