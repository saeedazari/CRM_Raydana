import React, { useState, useMemo } from 'react';
import { KnowledgeBaseArticle, KnowledgeBaseCategory } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface CustomerKnowledgeBaseProps {
    articles: KnowledgeBaseArticle[];
    categories: KnowledgeBaseCategory[];
}

const CustomerKnowledgeBase: React.FC<CustomerKnowledgeBaseProps> = ({ articles, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewingArticle, setViewingArticle] = useState<KnowledgeBaseArticle | null>(null);

    const filteredArticles = useMemo(() => {
        return articles.filter(article =>
            (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory === 'all' || article.categoryId === selectedCategory)
        ).map(article => ({
            ...article,
            categoryName: categories.find(c => c.id === article.categoryId)?.name || 'بدون دسته‌بندی'
        }));
    }, [articles, searchTerm, selectedCategory, categories]);
    
    if (viewingArticle) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                 <button onClick={() => setViewingArticle(null)} className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold mb-6">
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                    بازگشت به لیست مقالات
                </button>
                <h1 className="text-3xl font-bold mb-2">{viewingArticle.title}</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    دسته‌بندی: {viewingArticle.categoryName}
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: viewingArticle.content }}></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-2">پایگاه دانش</h2>
                <p className="text-center text-gray-500 mb-6">پاسخ سوالات خود را اینجا بیابید</p>
                <div className="max-w-2xl mx-auto">
                     <div className="relative">
                        <input type="text" placeholder="جستجو در مقالات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400"/></div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-3 px-2">دسته‌بندی‌ها</h3>
                         <ul>
                            <li>
                                <button onClick={() => setSelectedCategory('all')} className={`w-full text-right px-3 py-2 rounded-md ${selectedCategory === 'all' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    همه مقالات
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button onClick={() => setSelectedCategory(cat.id)} className={`w-full text-right px-3 py-2 rounded-md ${selectedCategory === cat.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="md:col-span-3 space-y-4">
                    {filteredArticles.map(article => (
                        <div key={article.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{__html: article.content.substring(0, 200).replace(/<[^>]*>?/gm, '') + '...'}}></p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{article.categoryName}</span>
                                <button onClick={() => setViewingArticle(article)} className="font-semibold text-indigo-600 dark:text-indigo-400">ادامه مطلب &larr;</button>
                            </div>
                        </div>
                    ))}
                     {filteredArticles.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-500">
                            مقاله‌ای یافت نشد.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerKnowledgeBase;