
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const toPersianDigits = (num: string | number | undefined | null): string => {
    if (num === undefined || num === null) return '';
    const str = num.toString();
    const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[0-9]/g, function (w) {
        return id[+w];
    });
}

export const toEnglishDigits = (str: string): string => {
    if (!str) return '';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, function (w) {
        return persianDigits.indexOf(w).toString();
    });
}

export const toShamsi = (date: string | Date | undefined | null, format: string = "YYYY/MM/DD"): string => {
    if (!date) return '-';
    
    // If it looks like a Shamsi date already (starts with 13 or 14 and has slashes), just localize digits
    if (typeof date === 'string' && (date.startsWith('13') || date.startsWith('14')) && date.indexOf('/') > -1) {
        return toPersianDigits(date);
    }

    try {
        // Convert Gregorian/ISO to Shamsi with Persian Locale
        const dateObj = new DateObject(new Date(date))
            .convert(persian, persian_fa);
        return dateObj.format(format);
    } catch (e) {
        return '-';
    }
};

export const formatTime = (date: string | Date | undefined): string => {
    if (!date) return '';
    try {
        return new DateObject(new Date(date))
            .convert(persian, persian_fa)
            .format("HH:mm");
    } catch (e) {
        return '';
    }
}

export const toIsoDate = (date: any): string => {
    if (!date) return '';
    if (typeof date === 'string') return date; // Assume already ISO or handle otherwise
    if (date instanceof DateObject) return date.toDate().toISOString();
    if (date instanceof Date) return date.toISOString();
    // Handle react-multi-date-picker generic object if not instance of DateObject
    if (date.toDate && typeof date.toDate === 'function') return date.toDate().toISOString();
    return '';
}
