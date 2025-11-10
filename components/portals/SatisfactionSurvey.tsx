import React, { useState } from 'react';
import { Ticket } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { StarIcon } from '../icons/StarIcon';

interface SatisfactionSurveyProps {
    ticket: Ticket;
    onClose: () => void;
    onSubmit: (rating: number, feedback: string, tags: string[]) => void;
}

const positiveFeedbackTags = [
    'پاسخ سریع', 'راه حل مناسب', 'برخورد عالی کارشناس', 'دانش فنی بالا', 'پیگیری خوب'
];

const negativeFeedbackTags = [
    'زمان پاسخ طولانی', 'مشکل حل نشد', 'نیاز به پیگیری زیاد', 'برخورد نامناسب', 'عدم درک مشکل'
];

const SatisfactionSurvey: React.FC<SatisfactionSurveyProps> = ({ ticket, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit(rating, feedback, selectedTags);
        } else {
            alert('لطفا حداقل یک ستاره امتیاز دهید.');
        }
    };

    const renderTags = () => {
        if (rating === 0) return null;

        const tagsToShow = rating >= 4 ? positiveFeedbackTags : negativeFeedbackTags;

        return (
            <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">چه چیزی خوب بود؟ / چه چیزی نیاز به بهبود دارد؟</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {tagsToShow.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1.5 text-sm rounded-full transition-colors border
                                    ${isSelected 
                                        ? 'bg-indigo-600 text-white border-indigo-600' 
                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`
                                }
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold">نظرسنجی رضایت از تیکت</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 text-center">
                        <p className="mb-2 text-gray-700 dark:text-gray-300">چقدر از پاسخ‌دهی به تیکت زیر رضایت داشتید؟</p>
                        <p className="font-bold mb-4">"{ticket.subject}"</p>
                        
                        <div className="flex justify-center items-center text-4xl mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <StarIcon 
                                        className={`cursor-pointer transition-colors 
                                            ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    />
                                </button>
                            ))}
                        </div>

                        {renderTags()}

                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                            placeholder="بازخورد شما (اختیاری)..."
                            className="w-full p-2.5 bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mt-6"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700">
                        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400" disabled={rating === 0}>
                            ثبت نظر
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SatisfactionSurvey;