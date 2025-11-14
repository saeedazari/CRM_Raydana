export function getJwtExpiry(token: string): string | null {
    if (!token) {
        return null;
    }

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) {
            return 'توکن نامعتبر';
        }
        const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decodedPayload);

        if (payload && typeof payload.exp === 'number') {
            const expiryDate = new Date(payload.exp * 1000);
            if (expiryDate < new Date()) {
                return 'منقضی شده';
            }
            return expiryDate.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return 'تاریخ انقضا یافت نشد';
    } catch (error) {
        console.error("Error parsing JWT:", error);
        return 'توکن نامعتبر';
    }
}
