import React, { useState, useRef, useEffect } from 'react';
import { User, ChatChannel, ChatMessage } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';
import { HamburgerIcon } from '../icons/HamburgerIcon';

// Mock Data
const initialMockMessages: (users: User[]) => { [key: string]: ChatMessage[] } = (users) => {
    const usersMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<string, User>);
    
    const currentUser = { id: 'USER-4', name: 'مدیر سیستم', email: 'admin@example.com', roleId: 'ROLE-1', avatar: 'https://i.pravatar.cc/40?u=ADMIN' };
    usersMap[currentUser.id] = currentUser;

    return {
    'C-1': [
        { id: 'M-1-1', user: usersMap['USER-1'], text: 'سلام به همگی، جلسه هفتگی فردا ساعت ۱۰ صبحه. @زهرا محمدی لطفا دستور جلسه رو آماده کن.', timestamp: 'دیروز ۱۱:۳۰', 
          thread: [
            { id: 'T-1-1-1', user: usersMap['USER-3'], text: 'عالی، ممنون از اطلاع‌رسانی.', timestamp: 'دیروز ۱۱:۳۵' },
            { id: 'T-1-1-2', user: usersMap['USER-2'], text: 'حتما شرکت می‌کنم.', timestamp: 'دیروز ۱۱:۴۰' },
          ]
        },
        { id: 'M-1-2', user: usersMap['USER-2'], text: 'پروژه مشتری XYZ با موفقیت تحویل داده شد.', timestamp: 'امروز ۰۹:۱۵' },
    ],
    'C-2': [
        { id: 'M-2-1', user: usersMap['USER-3'], text: 'یک باگ در صفحه گزارش‌ها پیدا کردم. نمودار فروش گاهی اوقات لود نمیشه.', timestamp: '۱ ساعت پیش' },
        { id: 'M-2-2', user: usersMap['USER-2'], text: 'ممنون مریم جان. من بررسی می‌کنم. @مدیر سیستم لطفا دسترسی‌های لازم رو بهم بده.', timestamp: '۴۵ دقیقه پیش',
          thread: [
             { id: 'T-2-2-1', user: usersMap['USER-3'], text: 'بله حتما، الان می‌فرستم.', timestamp: '۴۴ دقیقه پیش' },
          ]
        },
    ],
    'C-3': [],
    };
};

const renderMessageText = (text: string, users: User[]) => {
  const userNames = users.map(u => u.name);
  // Create a regex that matches any of the user names when preceded by @
  const regex = new RegExp(`@(${userNames.join('|')})`, 'g');
  
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (userNames.includes(part)) {
      return <strong key={index} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded px-1 font-medium">@{part}</strong>;
    }
    return part;
  });
};


const Message: React.FC<{ message: ChatMessage; onOpenThread: (message: ChatMessage) => void; users: User[] }> = ({ message, onOpenThread, users }) => {
    const hasThread = message.thread && message.thread.length > 0;
    const messageContainerClasses = `
        flex items-start space-i-3 py-4 px-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg group
        ${hasThread ? 'border-r-2 border-indigo-400 dark:border-indigo-600 bg-gray-50 dark:bg-gray-800/30' : ''}
    `;
    return (
        <div className={messageContainerClasses}>
            <img src={message.user.avatar} alt={message.user.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-baseline">
                    <span className="font-bold mr-2 text-gray-800 dark:text-gray-100">{message.user.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{message.timestamp}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 break-words">{renderMessageText(message.text, users)}</div>
                {hasThread && (
                    <button onClick={() => onOpenThread(message)} className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                        {message.thread.length} پاسخ
                    </button>
                )}
            </div>
            <button onClick={() => onOpenThread(message)} className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity" aria-label="پاسخ در ترد">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
        </div>
    );
};

const ThreadView: React.FC<{ message: ChatMessage; onClose: () => void; onAddReply: (threadId: string, text: string) => void; users: User[]; }> = ({ message, onClose, onAddReply, users }) => {
    const [reply, setReply] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (reply.trim()) {
            onAddReply(message.id, reply);
            setReply('');
        }
    };
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Original Message */}
                <div className="flex items-start space-i-3 py-2">
                    <img src={message.user.avatar} alt={message.user.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-baseline">
                            <span className="font-bold mr-2">{message.user.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{message.timestamp}</span>
                        </div>
                        <p>{renderMessageText(message.text, users)}</p>
                    </div>
                </div>
                <div className="border-b dark:border-gray-600 my-2"></div>
                {/* Replies */}
                {message.thread?.map(replyMsg => (
                     <div key={replyMsg.id} className="flex items-start space-i-3 py-2">
                        <img src={replyMsg.user.avatar} alt={replyMsg.user.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-baseline">
                                <span className="font-bold mr-2 text-sm">{replyMsg.user.name}</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">{replyMsg.timestamp}</span>
                            </div>
                            <p className="text-sm">{renderMessageText(replyMsg.text, users)}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                 <form onSubmit={handleSendReply}>
                    <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder={`پاسخ در ترد...`} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </form>
            </div>
        </div>
    );
};

interface ChatProps {
    channels: ChatChannel[];
    users: User[];
}

const Chat: React.FC<ChatProps> = ({ channels, users }) => {
    const [messages, setMessages] = useState(initialMockMessages(users));
    const [activeChannelId, setActiveChannelId] = useState<string>(channels[0]?.id || '');
    const [activeThread, setActiveThread] = useState<ChatMessage | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isChannelListOpen, setIsChannelListOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    
    // Mention state
    const [isMentioning, setIsMentioning] = useState(false);
    const [mentionSearchTerm, setMentionSearchTerm] = useState('');
    const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
    
    // Notification State
    const [notifications, setNotifications] = useState<Record<string, boolean>>({});

    const activeChannel = channels.find(c => c.id === activeChannelId);
    const currentUser = users.find(u => u.roleId === 'ROLE-1')!; // Assume current user is admin

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const msg: ChatMessage = {
                id: `MSG-${Date.now()}`,
                user: currentUser,
                text: newMessage,
                timestamp: 'اکنون',
            };
            setMessages(prev => ({
                ...prev,
                [activeChannelId]: [...(prev[activeChannelId] || []), msg]
            }));
            setNewMessage('');
            setIsMentioning(false);

            // --- Notification Logic ---
            const mentionedUser = users.find(u => newMessage.includes(`@${u.name}`) && u.id !== currentUser.id);
            if (mentionedUser) {
                // Find a channel the mentioned user is in, but is not the active one
                const targetChannel = channels.find(c => c.members.includes(mentionedUser.id) && c.id !== activeChannelId);
                if (targetChannel) {
                    setNotifications(prev => ({ ...prev, [targetChannel.id]: true }));
                }
            }
        }
    };
    
    const handleAddReply = (threadParentId: string, text: string) => {
        const reply: ChatMessage = {
             id: `REPLY-${Date.now()}`,
             user: currentUser,
             text: text,
             timestamp: 'اکنون',
        };
        
        const updatedMessages = { ...messages };
        const channelMessages = [...updatedMessages[activeChannelId]];
        const parentMsgIndex = channelMessages.findIndex(m => m.id === threadParentId);

        if(parentMsgIndex !== -1) {
            const parentMsg = { ...channelMessages[parentMsgIndex] };
            parentMsg.thread = [...(parentMsg.thread || []), reply];
            channelMessages[parentMsgIndex] = parentMsg;
            updatedMessages[activeChannelId] = channelMessages;
            
            setMessages(updatedMessages);
            setActiveThread(parentMsg);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChannelId]);
    
    useEffect(() => {
        if (!channels.find(c => c.id === activeChannelId)) {
            setActiveChannelId(channels[0]?.id || '');
        }
    }, [channels, activeChannelId]);

    const handleChannelSelect = (channelId: string) => {
        setActiveChannelId(channelId);
        setActiveThread(null);
        setIsChannelListOpen(false);
        if (notifications[channelId]) {
            setNotifications(prev => ({ ...prev, [channelId]: false }));
        }
    };

    const handleNewMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setNewMessage(text);

        const cursorPos = e.target.selectionStart;
        const textUpToCursor = text.substring(0, cursorPos);
        const mentionMatch = textUpToCursor.match(/@(\S*)$/);

        if (mentionMatch) {
            const searchTerm = mentionMatch[1].toLowerCase();
            setIsMentioning(true);
            setMentionSearchTerm(searchTerm);
            setMentionSuggestions(
                users.filter(u => u.name.toLowerCase().includes(searchTerm) && u.id !== currentUser.id)
            );
        } else {
            setIsMentioning(false);
        }
    };

    const handleMentionSelect = (user: User) => {
        const text = newMessage;
        const cursorPos = messageInputRef.current?.selectionStart || 0;
        const textUpToCursor = text.substring(0, cursorPos);
        
        const newText = textUpToCursor.replace(/@(\S*)$/, `@${user.name} `) + text.substring(cursorPos);
        
        setNewMessage(newText);
        setIsMentioning(false);
        messageInputRef.current?.focus();
    };


    return (
        <div className="flex h-full relative overflow-hidden bg-white dark:bg-gray-900">
             {/* Mobile Overlays */}
            {(isChannelListOpen || activeThread) && (
                <div 
                    onClick={() => { 
                        setIsChannelListOpen(false); 
                        setActiveThread(null); 
                    }} 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                    aria-hidden="true"
                ></div>
            )}

            {/* Channels Panel */}
             <div className={`
                w-full max-w-xs sm:w-1/3 md:w-1/4 xl:w-1/5 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col
                fixed md:static inset-y-0 right-0 z-20 transform transition-transform duration-300 ease-in-out
                ${isChannelListOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0
            `}>
                <div className="p-4 border-b dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
                    <h2 className="font-bold text-lg">گروه‌ها</h2>
                     <button onClick={() => setIsChannelListOpen(false)} className="md:hidden p-1 text-gray-500 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-2 overflow-y-auto">
                    <ul>
                        {channels.map(channel => (
                            <li key={channel.id}>
                                <a href="#" onClick={e => { e.preventDefault(); handleChannelSelect(channel.id); }}
                                   className={`flex justify-between items-center p-3 rounded-lg font-medium transition-colors ${activeChannelId === channel.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                    <span># {channel.name}</span>
                                    {notifications[channel.id] && (
                                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Chat Panel */}
            <div className="flex-1 flex flex-col h-full relative">
                <div className="p-4 border-b dark:border-gray-700 flex-shrink-0 flex items-center">
                     <button onClick={() => setIsChannelListOpen(true)} className="md:hidden ml-4 p-1 text-gray-500">
                        <HamburgerIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h3 className="font-bold text-xl"># {activeChannel?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activeChannel?.description}</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {messages[activeChannelId]?.length > 0 ? (
                       messages[activeChannelId].map(msg => <Message key={msg.id} message={msg} onOpenThread={setActiveThread} users={users} />)
                    ) : (
                        <div className="text-center text-gray-500 py-10">هنوز پیامی در این گروه وجود ندارد.</div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {isMentioning && mentionSuggestions.length > 0 && (
                    <div className="absolute bottom-24 right-4 w-64 bg-white dark:bg-gray-900 border dark:border-gray-600 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                        <ul>
                            {mentionSuggestions.map(user => (
                                <li key={user.id} onClick={() => handleMentionSelect(user)} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full ml-2" />
                                    <span className="text-sm">{user.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="p-4 border-t dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSendMessage}>
                        <textarea 
                            ref={messageInputRef}
                            value={newMessage} 
                            onChange={handleNewMessageChange}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSendMessage(e); e.preventDefault(); } }}
                            placeholder={`پیام در #${activeChannel?.name}`} 
                            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={1}
                        />
                    </form>
                </div>
            </div>

            {/* Thread Panel */}
            <div className={`
                w-full max-w-xs sm:w-1/3 md:w-1/3 xl:w-1/4 flex-shrink-0
                fixed md:static inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out
                ${activeThread ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                ${!activeThread ? 'hidden md:flex' : 'flex'}
            `}>
                {activeThread && (
                    <ThreadView 
                        message={activeThread} 
                        onClose={() => setActiveThread(null)}
                        onAddReply={handleAddReply}
                        users={users}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;