
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatChannel, ChatMessage, Attachment } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';
import { HamburgerIcon } from '../icons/HamburgerIcon';
import { ClipboardDocumentCheckIcon } from '../icons/ClipboardDocumentCheckIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import AttachmentList from '../AttachmentList';

const renderMessageText = (text: string, users: User[]) => {
  const userNames = users.map(u => u.name);
  const regex = new RegExp(`@(${userNames.join('|')})`, 'g');
  
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (userNames.includes(part)) {
      return <strong key={index} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded px-1 font-medium">@{part}</strong>;
    }
    return part;
  });
};


const Message: React.FC<{ message: ChatMessage; onOpenThread: (message: ChatMessage) => void; users: User[]; onCreateTaskFromMessage: (text: string, authorName: string) => void; onOpenReminderModal: (data: any) => void; }> = ({ message, onOpenThread, users, onCreateTaskFromMessage, onOpenReminderModal }) => {
    const hasThread = message.thread && message.thread.length > 0;
    const messageContainerClasses = `
        flex items-start space-i-3 py-4 px-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg group
        ${hasThread ? 'border-r-2 border-indigo-400 dark:border-indigo-600 bg-gray-50 dark:bg-gray-800/30' : ''}
    `;
    
    const handleCreateReminder = () => {
        onOpenReminderModal({
            title: `یادآوری پیام ${message.user.name}`,
            description: `متن پیام: ${message.text.substring(0, 100)}...`,
            sourceType: 'chat',
            sourceId: message.id,
            sourcePreview: message.text.substring(0, 60) + '...'
        });
    };

    return (
        <div className={messageContainerClasses}>
            <img src={message.user.avatar} alt={message.user.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-baseline">
                    <span className="font-bold mr-2 text-gray-800 dark:text-gray-100">{message.user.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 break-words">{renderMessageText(message.text, users)}</div>
                 {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                        <AttachmentList attachments={message.attachments} readonly={true} />
                    </div>
                )}
                {hasThread && (
                    <button onClick={() => onOpenThread(message)} className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                        {message.thread.length} پاسخ
                    </button>
                )}
            </div>
             <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onCreateTaskFromMessage(message.text, message.user.name)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="ایجاد وظیفه" title="ایجاد وظیفه">
                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                 <button onClick={handleCreateReminder} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="ایجاد یادآور" title="ایجاد یادآور">
                    <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button onClick={() => onOpenThread(message)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="پاسخ در ترد" title="پاسخ">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
            </div>
        </div>
    );
};

const ThreadView: React.FC<{ message: ChatMessage; onClose: () => void; onAddReply: (parentMessageId: string, text: string) => void; users: User[]; }> = ({ message, onClose, onAddReply, users }) => {
    const [reply, setReply] = useState('');
    const threadScrollRef = useRef<HTMLDivElement>(null);

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (reply.trim()) {
            onAddReply(message.id, reply);
            setReply('');
        }
    };
    
    useEffect(() => {
         if (threadScrollRef.current) {
            threadScrollRef.current.scrollTop = threadScrollRef.current.scrollHeight;
        }
    }, [message.thread]);

    return (
        <div className="border-r border-gray-200 dark:border-gray-700 flex flex-col h-full w-full bg-white dark:bg-gray-800">
            <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">ترد</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">پاسخ به {message.user.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={threadScrollRef}>
                <div className="flex items-start space-i-3 py-2">
                    <img src={message.user.avatar} alt={message.user.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-baseline"><span className="font-bold mr-2">{message.user.name}</span><span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleTimeString('fa-IR')}</span></div>
                        <p>{renderMessageText(message.text, users)}</p>
                        {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2">
                                <AttachmentList attachments={message.attachments} readonly={true} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="border-b dark:border-gray-600 my-2"></div>
                {message.thread?.map(replyMsg => (
                     <div key={replyMsg.id} className="flex items-start space-i-3 py-2">
                        <img src={replyMsg.user.avatar} alt={replyMsg.user.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-baseline"><span className="font-bold mr-2 text-sm">{replyMsg.user.name}</span><span className="text-xs text-gray-400">{new Date(replyMsg.timestamp).toLocaleTimeString('fa-IR')}</span></div>
                            <p className="text-sm">{renderMessageText(replyMsg.text, users)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                 <form onSubmit={handleSendReply}>
                    <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder={`پاسخ در ترد...`} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700" />
                </form>
            </div>
        </div>
    );
};

interface ChatProps {
    currentUser: User;
    onCreateTask: (text: string, authorName: string) => void;
    onOpenReminderModal?: (data: any) => void;
}

const Chat: React.FC<ChatProps> = ({ currentUser, onCreateTask, onOpenReminderModal }) => {
    const [channels, setChannels] = useState<ChatChannel[]>([]);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [users, setUsers] = useState<User[]>([]);

    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const [activeThread, setActiveThread] = useState<ChatMessage | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isChannelListOpen, setIsChannelListOpen] = useState(false);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        const mockUsers: User[] = [
          { id: 'U1', name: 'علی رضایی', username: 'ali', roleId: 'R1', avatar: 'https://i.pravatar.cc/40?u=U1' },
          { id: 'U2', name: 'زهرا احمدی', username: 'zahra', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U2' },
          { id: 'U3', name: 'محمد کریمی', username: 'mohammad', roleId: 'R2', avatar: 'https://i.pravatar.cc/40?u=U3' },
        ];
        const mockChannels: ChatChannel[] = [
            { id: 'CH1', name: 'عمومی', description: 'بحث‌های کلی تیم', members: ['U1', 'U2', 'U3'] },
            { id: 'CH2', name: 'پشتیبانی', description: 'مربوط به تیکت‌های پشتیبانی', members: ['U1', 'U2'] },
            { id: 'CH3', name: 'فروش', description: 'بحث در مورد سرنخ‌ها و فرصت‌ها', members: ['U1', 'U3'] },
        ];
        const initialMessages: Record<string, ChatMessage[]> = {
            'CH1': [
                { id: 'MSG1', user: mockUsers[1], text: 'سلام به همگی!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), thread: [] },
                { id: 'MSG2', user: mockUsers[2], text: 'سلام زهرا، @علی رضایی در مورد گزارش فروش سوال داشتم.', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), thread: [
                    { id: 'MSG2-1', user: mockUsers[0], text: 'بفرمایید محمد جان.', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() }
                ]},
            ],
            'CH2': [ { id: 'MSG3', user: mockUsers[0], text: 'لطفا یکی تیکت #721 رو بررسی کنه.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), thread: [] }], 'CH3': [],
        };

        setUsers(mockUsers);
        setChannels(mockChannels);
        setMessages(initialMessages);
        setActiveChannelId(mockChannels[0]?.id || null);
    }, []);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if ((newMessage.trim() || attachments.length > 0) && activeChannelId) {
            const message: ChatMessage = {
                id: `MSG-${Date.now()}`,
                user: currentUser,
                text: newMessage,
                timestamp: new Date().toISOString(),
                attachments: attachments
            };
            setMessages(prev => ({
                ...prev,
                [activeChannelId]: [...(prev[activeChannelId] || []), message],
            }));
            setNewMessage('');
            setAttachments([]);
        }
    };
    
    const handleAddReply = (parentMessageId: string, text: string) => {
        if (activeChannelId) {
            const reply: ChatMessage = {
                id: `MSG-${Date.now()}`,
                user: currentUser,
                text: text,
                timestamp: new Date().toISOString(),
            };
            const newMessages = messages[activeChannelId].map(msg => {
                if (msg.id === parentMessageId) {
                    const updatedMsg = { ...msg, thread: [...(msg.thread || []), reply] };
                    setActiveThread(updatedMsg); // Keep thread view updated
                    return updatedMsg;
                }
                return msg;
            });
            setMessages(prev => ({ ...prev, [activeChannelId]: newMessages }));
        }
    };
    
     const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
             const newAttachments: Attachment[] = [];
             Array.from(e.target.files).forEach((file: File) => {
                newAttachments.push({
                    id: `FILE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    uploadedAt: new Date().toISOString(),
                });
             });
             setAttachments(prev => [...prev, ...newAttachments]);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, activeChannelId]);

    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <div className="flex h-full relative overflow-hidden bg-white dark:bg-gray-900">
             {(isChannelListOpen || activeThread) && <div onClick={() => { setIsChannelListOpen(false); setActiveThread(null); }} className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>}
             <div className={`w-full max-w-xs sm:w-1/3 md:w-1/4 xl:w-1/5 bg-gray-50 dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col fixed md:static inset-y-0 right-0 z-20 transform transition-transform ${isChannelListOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
                <div className="p-4 border-b dark:border-gray-700 flex-shrink-0 flex justify-between items-center"><h2 className="font-bold text-lg">گروه‌ها</h2><button onClick={() => setIsChannelListOpen(false)} className="md:hidden p-1"><XMarkIcon className="w-6 h-6" /></button></div>
                <nav className="flex-1 p-2 overflow-y-auto">
                    <ul>{channels.map(channel => (<li key={channel.id}><a href="#" onClick={e => { e.preventDefault(); setActiveChannelId(channel.id); setActiveThread(null); setIsChannelListOpen(false); }} className={`flex p-3 rounded-lg font-medium ${activeChannelId === channel.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}># {channel.name}</a></li>))}</ul>
                </nav>
            </div>
            <div className="flex-1 flex flex-col h-full relative">
                <div className="p-4 border-b dark:border-gray-700 flex-shrink-0 flex items-center">
                     <button onClick={() => setIsChannelListOpen(true)} className="md:hidden ml-4 p-1"><HamburgerIcon className="w-6 h-6" /></button>
                    <div><h3 className="font-bold text-xl"># {activeChannel?.name || 'گروهی را انتخاب کنید'}</h3><p className="text-sm text-gray-500">{activeChannel?.description}</p></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4" ref={scrollContainerRef}>
                    {activeChannelId && messages[activeChannelId]?.map(msg => <Message key={msg.id} message={msg} onOpenThread={setActiveThread} users={users} onCreateTaskFromMessage={onCreateTask} onOpenReminderModal={onOpenReminderModal || (() => {})} />)}
                </div>
                <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                    {attachments.length > 0 && (
                        <div className="mb-2 max-h-32 overflow-y-auto border rounded p-2 dark:border-gray-600">
                            <AttachmentList attachments={attachments} onRemove={(id) => setAttachments(prev => prev.filter(a => a.id !== id))} />
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500">
                            <PaperClipIcon className="w-6 h-6" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={`پیام در #${activeChannel?.name}`} className="flex-1 p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </form>
                </div>
            </div>
            <div className={`w-full max-w-xs sm:w-1/3 md:w-1/3 xl:w-1/4 flex-shrink-0 fixed md:static inset-y-0 left-0 z-20 transform transition-transform ${activeThread ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${!activeThread ? 'hidden md:flex' : 'flex'}`}>
                {activeThread && <ThreadView message={activeThread} onClose={() => setActiveThread(null)} onAddReply={handleAddReply} users={users} />}
            </div>
        </div>
    );
};

export default Chat;
