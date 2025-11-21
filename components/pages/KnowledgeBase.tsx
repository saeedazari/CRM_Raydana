
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { KnowledgeBaseArticle, KnowledgeBaseCategory, User } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { BoldIcon } from '../icons/BoldIcon';
import { ItalicIcon } from '../icons/ItalicIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { PhotoIcon } from '../icons/PhotoIcon';
import { ListBulletIcon } from '../icons/ListBulletIcon';
import { ListNumberIcon } from '../icons/ListNumberIcon';
import { ArrowUturnLeftIcon } from '../icons/ArrowUturnLeftIcon';
import { CodeBracketIcon } from '../icons/CodeBracketIcon';
import { UnderlineIcon } from '../icons/UnderlineIcon';
import { toShamsi } from '../../utils/date';


interface KnowledgeBaseProps {
    articles: KnowledgeBaseArticle[];
    setArticles: React.Dispatch<React.SetStateAction<KnowledgeBaseArticle[]>>;
    categories: KnowledgeBaseCategory[];
    setCategories: React.Dispatch<React.SetStateAction<KnowledgeBaseCategory[]>>;
    currentUser: User;
}

const initialArticleState: Omit<KnowledgeBaseArticle, 'id' | 'createdAt' | 'authorId' | 'authorName' | 'categoryName'> = {
    title: '',
    content: '',
    categoryId: '',
    tags: [],
    visibility: 'internal',
};

const ToolbarButton: React.FC<{ onClick: () => void; icon: React.ReactNode; title?: string; active?: boolean }> = ({ onClick, icon, title, active }) => (
    <button 
        type="button" 
        onClick={onClick} 
        title={title}
        className={`p-2 rounded-md transition-colors ${active ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
    >
        {icon}
    </button>
);

const RichTextEditor: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);
    
    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    const execCmd = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };
    
    const handleLink = () => {
        const url = prompt('آدرس لینک را وارد کنید:', 'https://');
        if (url) {
            execCmd('createLink', url);
        }
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            execCmd('insertImage', url);
            
            // Wait for DOM update then verify size constraints if needed (optional)
            setTimeout(() => {
                if (editorRef.current) {
                    onChange(editorRef.current.innerHTML);
                }
            }, 100);
        }
    };

    return (
        <div className="border rounded-lg dark:border-gray-600 overflow-hidden flex flex-col h-full shadow-sm">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
                
                {/* History */}
                <div className="flex items-center gap-1 border-l pl-2 ml-2 border-gray-300 dark:border-gray-700">
                    <ToolbarButton onClick={() => execCmd('undo')} icon={<ArrowUturnLeftIcon className="w-5 h-5" />} title="بازگردانی" />
                </div>

                {/* Text Style */}
                <div className="flex items-center gap-1 border-l pl-2 ml-2 border-gray-300 dark:border-gray-700">
                    <select 
                        onChange={(e) => execCmd('formatBlock', e.target.value)} 
                        className="p-1.5 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600 outline-none w-24"
                        defaultValue="P"
                    >
                        <option value="P">پاراگراف</option>
                        <option value="H1">تیتر ۱</option>
                        <option value="H2">تیتر ۲</option>
                        <option value="H3">تیتر ۳</option>
                    </select>
                </div>

                {/* Formatting */}
                <div className="flex items-center gap-1 border-l pl-2 ml-2 border-gray-300 dark:border-gray-700">
                    <ToolbarButton onClick={() => execCmd('bold')} icon={<BoldIcon className="w-5 h-5"/>} title="Bold" />
                    <ToolbarButton onClick={() => execCmd('italic')} icon={<ItalicIcon className="w-5 h-5"/>} title="Italic" />
                    <ToolbarButton onClick={() => execCmd('underline')} icon={<UnderlineIcon className="w-5 h-5"/>} title="Underline" />
                    <ToolbarButton onClick={() => execCmd('formatBlock', 'PRE')} icon={<CodeBracketIcon className="w-5 h-5"/>} title="Code Block" />
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 border-l pl-2 ml-2 border-gray-300 dark:border-gray-700">
                    <ToolbarButton onClick={() => execCmd('insertUnorderedList')} icon={<ListBulletIcon className="w-5 h-5"/>} title="Bullet List" />
                    <ToolbarButton onClick={() => execCmd('insertOrderedList')} icon={<ListNumberIcon className="w-5 h-5"/>} title="Numbered List" />
                </div>

                {/* Insert */}
                <div className="flex items-center gap-1">
                    <ToolbarButton onClick={handleLink} icon={<LinkIcon className="w-5 h-5"/>} title="Insert Link" />
                    <ToolbarButton onClick={() => fileInputRef.current?.click()} icon={<PhotoIcon className="w-5 h-5"/>} title="Insert Image" />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                    />
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-grow bg-white dark:bg-gray-800 relative">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleContentChange}
                    className="w-full h-96 p-4 overflow-y-auto outline-none prose dark:prose-invert max-w-none"
                    style={{ minHeight: '300px' }}
                ></div>
            </div>
        </div>
    );
};

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ articles, setArticles, categories, setCategories, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<KnowledgeBaseArticle | null>(null);
    const [articleFormData, setArticleFormData] = useState(initialArticleState);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (isPanelOpen && editingArticle) {
            setArticleFormData({
                ...editingArticle,
                tags: editingArticle.tags || [],
            });
        } else {
            setArticleFormData(initialArticleState);
        }
    }, [isPanelOpen, editingArticle]);

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

    const openPanel = (article: KnowledgeBaseArticle | null = null) => {
        setEditingArticle(article);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setEditingArticle(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setArticleFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setArticleFormData(prev => ({...prev, tags}));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingArticle) {
            setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...editingArticle, ...articleFormData } : a));
        } else {
            const newArticle: KnowledgeBaseArticle = {
                id: `KBA-${Date.now()}`,
                ...articleFormData,
                authorId: currentUser.id,
                authorName: currentUser.name,
                createdAt: new Date().toISOString(),
            };
            setArticles(prev => [newArticle, ...prev]);
        }
        closePanel();
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory: KnowledgeBaseCategory = {
                id: `KBC-${Date.now()}`,
                name: newCategoryName.trim(),
            };
            setCategories(prev => [...prev, newCategory]);
            setNewCategoryName('');
        }
    };
    
    const handleDeleteCategory = (categoryId: string) => {
        const isCategoryInUse = articles.some(article => article.categoryId === categoryId);
        if (isCategoryInUse) {
            alert('این دسته‌بندی حاوی مقاله است و قابل حذف نیست.');
            return;
        }
        if (window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
            setCategories(prev => prev.filter(c => c.id !== categoryId));
        }
    };
    
    const ArticleView: React.FC<{ article: KnowledgeBaseArticle }> = ({ article }) => (
        <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{article.title}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>دسته‌بندی: {article.categoryName}</span> | 
                <span> نویسنده: {article.authorName || currentUser.name}</span> | 
                <span> تاریخ: {toShamsi(article.createdAt)}</span>
            </div>
             <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full text-gray-800 dark:text-gray-300">{tag}</span>
                ))}
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>
    );

    return (
        <div className="flex h-full bg-white dark:bg-gray-800">
            {/* Sidebar with categories & articles */}
            <div className="w-full md:w-1/3 xl:w-1/4 border-l dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="relative">
                        <input type="text" placeholder="جستجو..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400"/></div>
                    </div>
                </div>
                 <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-bold">مقالات</h2>
                     <button onClick={() => openPanel()} className="flex items-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-4 h-4 ml-1" /> مقاله جدید
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {/* Category Management */}
                    <div className="p-3">
                         <h3 className="font-semibold mb-2 text-gray-600 dark:text-gray-300">دسته‌بندی‌ها</h3>
                        {categories.map(category => (
                            <div key={category.id} className="group flex justify-between items-center pr-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                <button onClick={() => setSelectedCategory(category.id)} className={`flex-grow text-right py-1.5 ${selectedCategory === category.id ? 'text-indigo-600 font-bold' : ''}`}>
                                    {category.name}
                                </button>
                                <button onClick={() => handleDeleteCategory(category.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <div className="mt-4 flex items-center gap-2">
                             <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="نام دسته‌بندی جدید" className="flex-grow p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                             <button onClick={handleAddCategory} className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"><PlusIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                    
                    <div className="border-t dark:border-gray-700 mt-4">
                        <h3 className="font-semibold p-3 bg-gray-50 dark:bg-gray-700/50">همه مقالات</h3>
                        <ul>
                            {filteredArticles.map(article => (
                                <li key={article.id}>
                                    <a href="#" onClick={e => {e.preventDefault(); setSelectedArticle(article);}} className={`block p-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedArticle?.id === article.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`}>
                                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{article.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{__html: article.content.substring(0, 80).replace(/<[^>]*>?/gm, '') + '...'}}></p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {selectedArticle ? <ArticleView article={selectedArticle} /> : <div className="p-8 text-center text-gray-500">مقاله‌ای را برای مشاهده انتخاب کنید.</div>}
            </div>

             {/* Add/Edit Panel */}
            <div className={`fixed inset-0 z-50 ${isPanelOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isPanelOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={closePanel}></div>
                <div className={`absolute inset-y-0 left-0 bg-white dark:bg-gray-800 h-full w-full max-w-4xl shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                        <h3 className="text-lg font-semibold">{editingArticle ? 'ویرایش مقاله' : 'ایجاد مقاله جدید'}</h3>
                        <button onClick={closePanel} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="flex-grow flex flex-col overflow-hidden">
                        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                            <div><label className="block text-sm font-medium mb-2">عنوان مقاله</label><input type="text" name="title" value={articleFormData.title} onChange={handleFormChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required placeholder="مثلا: راهنمای نصب نرم‌افزار" /></div>
                            
                            <div className="flex-grow flex flex-col" style={{ minHeight: '400px' }}>
                                <label className="block text-sm font-medium mb-2">محتوای مقاله</label>
                                <div className="flex-grow">
                                    <RichTextEditor value={articleFormData.content} onChange={value => setArticleFormData(prev => ({ ...prev, content: value }))} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium mb-2">دسته‌بندی</label><select name="categoryId" value={articleFormData.categoryId} onChange={handleFormChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required><option value="">انتخاب کنید</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                <div><label className="block text-sm font-medium mb-2">قابلیت مشاهده</label><select name="visibility" value={articleFormData.visibility} onChange={handleFormChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"><option value="internal">داخلی (فقط تیم)</option><option value="public">عمومی (قابل مشاهده برای مشتریان)</option></select></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-2">برچسب‌ها (با کاما جدا کنید)</label><input type="text" name="tags" value={articleFormData.tags.join(', ')} onChange={handleTagsChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="آموزشی, فنی, مهم"/></div>
                        </div>
                        <div className="p-4 border-t dark:border-gray-700 mt-auto flex justify-end gap-3 flex-shrink-0">
                             <button type="button" onClick={closePanel} className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">انصراف</button>
                             <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-colors">ذخیره مقاله</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
