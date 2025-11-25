






import React, { useRef } from 'react';
import { Invoice, Quote, PurchaseOrder, CompanyInfo, Customer, Vendor } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { PrinterIcon } from '../icons/PrinterIcon';
import { toShamsi } from '../../utils/date';

interface PrintableDocumentProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'invoice' | 'quote' | 'purchaseOrder';
    data: Invoice | Quote | PurchaseOrder | null;
    companyInfo: CompanyInfo;
}

const PrintableDocument: React.FC<PrintableDocumentProps> = ({ isOpen, onClose, type, data, companyInfo }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    // Helper to get title based on type
    const getTitle = () => {
        switch (type) {
            case 'invoice': 
                return 'isOfficial' in data && (data as Invoice).isOfficial ? 'فاکتور رسمی فروش کالا و خدمات' : 'فاکتور فروش';
            case 'quote': return 'پیش‌فاکتور';
            case 'purchaseOrder': return 'فاکتور خرید';
            default: return 'سند';
        }
    };

    // Helper to get party label (Buyer/Seller)
    const getPartyLabel = () => {
        if (type === 'purchaseOrder') return { from: 'خریدار', to: 'فروشنده (تامین‌کننده)' };
        return { from: 'فروشنده', to: 'خریدار' };
    };

    // Determine document ID and Date
    const docId = data ? ('quoteNumber' in data ? `${data.quoteNumber} (نسخه ${data.version})` : data.id) : '';
    const docDate = data ? ('issueDate' in data ? toShamsi(data.issueDate) : '') : '';
    const items = data ? ('items' in data ? data.items : []) : [];
    const note = data && 'note' in data ? data.note : null;
    
    // Determine specific fields
    const customerName = data ? ('customerName' in data ? data.customerName : ('vendorName' in data ? data.vendorName : '')) : '';

    if (!isOpen || !data) return null;

    const labels = getPartyLabel();

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/75 block overflow-auto print:bg-white print:static print:inset-auto print:h-auto print:overflow-visible">
            
            {/* Print Controls - Hidden when printing */}
            <div className="fixed top-4 right-4 flex gap-2 print:hidden z-[110]">
                <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                    <PrinterIcon className="w-5 h-5 ml-2" />
                    چاپ / PDF
                </button>
                <button onClick={onClose} className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100">
                    <XMarkIcon className="w-5 h-5 ml-2" />
                    بستن
                </button>
            </div>

            {/* Printable Area (A4 Size) */}
            <div 
                ref={printRef}
                className="bg-white text-black w-[210mm] min-w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl my-8 mx-auto print:my-0 print:shadow-none print:w-full print:min-w-0 print:min-h-0 box-border relative flex flex-col"
                dir="rtl"
            >
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-black">{getTitle()}</h1>
                        <div className="text-sm space-y-1 text-gray-900 print:text-black">
                            <p><span className="font-bold">شماره:</span> {docId}</p>
                            <p><span className="font-bold">تاریخ:</span> {docDate}</p>
                            {type === 'quote' && 'expiryDate' in data && <p><span className="font-bold">اعتبار تا:</span> {toShamsi(data.expiryDate)}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-gray-900 print:text-black">
                         {companyInfo.logoUrl ? (
                             <img src={companyInfo.logoUrl} alt="Logo" className="h-16 w-auto mb-2 object-contain" />
                         ) : (
                            <div className="text-2xl font-bold text-gray-400 mb-2 print:text-gray-600">LOGO</div> 
                         )}
                        <p className="font-bold text-2xl">{companyInfo.name}</p>
                    </div>
                </div>

                {/* Parties Details (Official) */}
                <div className="flex justify-between mb-8 gap-4">
                    {/* Party 1 (Usually Company/Seller) */}
                    <div className="w-1/2 p-4 border rounded-lg bg-gray-50 print:bg-transparent print:border-gray-400 text-gray-900 print:text-black">
                        <h3 className="font-bold text-lg mb-2 text-indigo-800 print:text-black border-b border-gray-300 pb-1">{labels.from}</h3>
                        {type === 'purchaseOrder' ? (
                             // We are the buyer in PO
                            <div className="text-xs space-y-1.5">
                                <p><span className="font-bold">نام:</span> {companyInfo.name}</p>
                                <p><span className="font-bold">کد اقتصادی:</span> {companyInfo.economicCode || '-'}</p>
                                <p><span className="font-bold">شناسه ملی:</span> {companyInfo.nationalId || '-'}</p>
                                <p><span className="font-bold">کد پستی:</span> {companyInfo.postalCode || '-'}</p>
                                <p><span className="font-bold">نشانی:</span> {companyInfo.address}</p>
                                <p><span className="font-bold">تلفن:</span> {companyInfo.phone}</p>
                            </div>
                        ) : (
                            // We are the seller in Invoice/Quote
                             <div className="text-xs space-y-1.5">
                                <p><span className="font-bold">نام:</span> {companyInfo.name}</p>
                                <p><span className="font-bold">کد اقتصادی:</span> {companyInfo.economicCode || '-'}</p>
                                <p><span className="font-bold">شناسه ملی:</span> {companyInfo.nationalId || '-'}</p>
                                <p><span className="font-bold">کد پستی:</span> {companyInfo.postalCode || '-'}</p>
                                <p><span className="font-bold">نشانی:</span> {companyInfo.address}</p>
                                <p><span className="font-bold">تلفن:</span> {companyInfo.phone}</p>
                            </div>
                        )}
                    </div>

                    {/* Party 2 (Customer/Vendor) */}
                    <div className="w-1/2 p-4 border rounded-lg bg-gray-50 print:bg-transparent print:border-gray-400 text-gray-900 print:text-black">
                        <h3 className="font-bold text-lg mb-2 text-indigo-800 print:text-black border-b border-gray-300 pb-1">{labels.to}</h3>
                         <div className="text-xs space-y-1.5">
                            <p><span className="font-bold">نام:</span> {customerName}</p>
                            <p><span className="font-bold">کد اقتصادی:</span> {'economicCode' in data ? (data as any).economicCode : '-'}</p>
                            <p><span className="font-bold">شناسه ملی:</span> {'nationalId' in data ? (data as any).nationalId : '-'}</p>
                            {/* We assume postal code might be present or retrieved. Currently showing placeholder/fallback. */}
                            <p><span className="font-bold">کد پستی:</span> {'postalCode' in data ? (data as any).postalCode : '-'}</p>
                            <p><span className="font-bold">نشانی:</span> -</p>
                        </div>
                    </div>
                </div>

                {/* Items Table - New Detailed Columns */}
                <table className="w-full text-xs mb-8 border-collapse text-gray-900 print:text-black">
                    <thead>
                        <tr className="bg-gray-100 print:bg-gray-200 text-gray-900 print:text-black border-b border-gray-400">
                            <th className="p-2 border border-gray-400 w-8 text-center">#</th>
                            <th className="p-2 border border-gray-400 text-right">شرح کالا / خدمات</th>
                            <th className="p-2 border border-gray-400 w-12 text-center">تعداد</th>
                            <th className="p-2 border border-gray-400 w-24 text-center">قیمت واحد</th>
                            <th className="p-2 border border-gray-400 w-24 text-center">مبلغ کل</th>
                            <th className="p-2 border border-gray-400 w-24 text-center">تخفیف</th>
                            <th className="p-2 border border-gray-400 w-24 text-center">مبلغ پس از تخفیف</th>
                            <th className="p-2 border border-gray-400 w-12 text-center">عوارض و مالیات</th>
                            <th className="p-2 border border-gray-400 w-28 text-left">جمع کل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, index: number) => {
                            // Fallback calculations if old data structure
                            const qty = item.quantity || 0;
                            const unit = item.unitPrice || 0;
                            const total = item.totalPrice || (qty * unit);
                            
                            let discountVal = 0;
                            if (item.discountType === 'amount') discountVal = item.discount || 0;
                            else discountVal = total * ((item.discount || 0) / 100);

                            const afterDisc = item.totalAfterDiscount || (total - discountVal);
                            const taxVal = afterDisc * ((item.tax || 0) / 100);
                            const final = item.totalWithTax || (afterDisc + taxVal);

                            return (
                                <tr key={index} className="border-b border-gray-400 text-gray-900 print:text-black">
                                    <td className="p-2 text-center border border-gray-400">{index + 1}</td>
                                    <td className="p-2 text-right border border-gray-400">{item.productName}</td>
                                    <td className="p-2 text-center border border-gray-400">{qty.toLocaleString('fa-IR')}</td>
                                    <td className="p-2 text-center border border-gray-400">{unit.toLocaleString('fa-IR')}</td>
                                    <td className="p-2 text-center border border-gray-400">{total.toLocaleString('fa-IR')}</td>
                                    <td className="p-2 text-center border border-gray-400">{discountVal.toLocaleString('fa-IR')}</td>
                                    <td className="p-2 text-center border border-gray-400">{afterDisc.toLocaleString('fa-IR')}</td>
                                    <td className="p-2 text-center border border-gray-400">{taxVal.toLocaleString('fa-IR')} ({item.tax.toLocaleString('fa-IR')}%)</td>
                                    <td className="p-2 text-left border border-gray-400 font-bold">{final.toLocaleString('fa-IR')}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end text-gray-900 print:text-black">
                    <div className="w-1/2 md:w-1/3 border rounded-lg bg-gray-50 p-4 print:bg-transparent print:border-gray-400">
                        <div className="flex justify-between mb-2">
                            <span>جمع کل:</span>
                            <span>{data.subtotal?.toLocaleString('fa-IR')}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-red-600 print:text-black">
                            <span>کسر می‌شود تخفیفات:</span>
                            <span>{'discountAmount' in data ? data.discountAmount.toLocaleString('fa-IR') : '0'}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-green-600 print:text-black">
                            <span>اضافه می‌شود مالیات و عوارض:</span>
                            <span>{data.taxAmount?.toLocaleString('fa-IR')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-2 mt-2">
                            <span>مبلغ قابل پرداخت:</span>
                            <span>{data.totalAmount?.toLocaleString('fa-IR')} تومان</span>
                        </div>
                    </div>
                </div>
                
                {/* Note Section */}
                {note && (
                    <div className="mt-6 border rounded-lg p-4 bg-gray-50 print:bg-transparent print:border-gray-400 text-gray-900 print:text-black">
                        <h4 className="font-bold text-sm mb-2 border-b border-gray-300 print:border-gray-400 pb-1 w-fit">توضیحات و شرایط:</h4>
                        <p className="text-sm whitespace-pre-wrap">{note}</p>
                    </div>
                )}

                {/* Footer / Signatures */}
                <div className="mt-auto pt-12 flex justify-between text-center print:mt-auto text-gray-900 print:text-black">
                    <div className="w-1/3">
                        <p className="font-bold mb-16">مهر و امضای {labels.from}</p>
                        <div className="border-b border-gray-400 w-2/3 mx-auto"></div>
                    </div>
                    <div className="w-1/3">
                        <p className="font-bold mb-16">مهر و امضای {labels.to}</p>
                        <div className="border-b border-gray-400 w-2/3 mx-auto"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PrintableDocument;