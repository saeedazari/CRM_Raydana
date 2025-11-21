
export const exportToCSV = (data: any[], fileName: string) => {
    if (!data || data.length === 0) {
        alert("داده‌ای برای خروجی وجود ندارد.");
        return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content handling UTF-8 BOM for Excel compatibility
    const csvContent = [
        headers.join(","),
        ...data.map(row => headers.map(fieldName => {
            let value = row[fieldName];
            // Handle strings with commas or quotes
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`; 
            }
            // Handle objects/arrays vaguely
            if (typeof value === 'object' && value !== null) {
                 value = `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return value;
        }).join(","))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
