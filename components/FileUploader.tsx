
import React, { useRef, useState } from 'react';
import { CloudArrowUpIcon } from './icons/CloudArrowUpIcon';
import { Attachment } from '../types';

interface FileUploaderProps {
    onUpload: (attachments: Attachment[]) => void;
    multiple?: boolean;
    compact?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, multiple = true, compact = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        
        const newAttachments: Attachment[] = [];
        Array.from(files).forEach(file => {
            // Mocking file upload by creating object URL
            const attachment: Attachment = {
                id: `FILE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString(),
            };
            newAttachments.push(attachment);
        });
        
        onUpload(newAttachments);
        
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    if (compact) {
        return (
            <>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </>
        )
    }

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple={multiple}
                onChange={(e) => handleFiles(e.target.files)}
            />
            <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">کلیک کنید</span> یا فایل را اینجا بکشید
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                (حداکثر ۱۰ مگابایت)
            </p>
        </div>
    );
};

export default FileUploader;
