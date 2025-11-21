
import React from 'react';
import { Attachment } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EyeIcon } from './icons/EyeIcon';

interface AttachmentListProps {
    attachments: Attachment[];
    onRemove?: (id: string) => void;
    readonly?: boolean;
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AttachmentList: React.FC<AttachmentListProps> = ({ attachments, onRemove, readonly = false }) => {
    if (attachments.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {attachments.map((file) => (
                <div key={file.id} className="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm group">
                    <div className="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                        {file.type.startsWith('image/') ? (
                            <img src={file.url} alt={file.name} className="w-8 h-8 object-cover rounded" />
                        ) : (
                            <DocumentIcon className="w-8 h-8 text-indigo-500" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0 mr-3 ml-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
                            {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                            title="مشاهده/دانلود"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </a>
                        {!readonly && onRemove && (
                            <button 
                                onClick={() => onRemove(file.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                                title="حذف"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttachmentList;
