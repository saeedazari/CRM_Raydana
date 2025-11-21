
/* 
    === BACKEND SPEC ===
    توضیح کامل اینکه این کامپوننت یا صفحه چه API لازم دارد:
    این کامپوننت یک Wrapper برای کامپوننت ProductsList است و منطق اصلی state را برای مدیریت محصولات و خدمات مدیریت می‌کند.

    1. دریافت لیست محصولات (Read)
    - Route: /api/products
    - Method: GET
    - Expected Query Params: ?search={string}
    - Response JSON Schema: { "data": [Product] }

    2. افزودن محصول جدید
    - Route: /api/products
    - Method: POST
    - Expected Body JSON Schema: Omit<Product, 'id'>
    - Response JSON Schema: Product (محصول جدید)

    3. ویرایش محصول
    - Route: /api/products/:id
    - Method: PUT
    - Expected Body JSON Schema: Partial<Product>
    - Response JSON Schema: Product (محصول ویرایش شده)
    
    4. حذف محصول
    - Route: /api/products/:id
    - Method: DELETE
    - Response JSON Schema: { "success": true }

    - Dependencies: تمام endpoint ها نیاز به Auth Token دارند.
*/
import React, { useState } from 'react';
import ProductsList from '../sales/ProductsList';
import { Product } from '../../types';

/*
    === REMOVE OR REPLACE MOCK DATA ===
    این داده موقتی است و در نسخه اصلی باید از API دریافت شود.
    ساختار مورد انتظار پاسخ API: GET /api/products -> { "data": [Product] }
*/
// const mockProducts: Product[] = [
//     { id: 'P1', code: 'SRV-GOLD', name: 'سرویس پشتیبانی طلایی', description: 'پشتیبانی ۲۴/۷ با پاسخ‌دهی زیر ۱ ساعت', price: 10000000 },
//     { id: 'P2', code: 'SRV-SILVER', name: 'سرویس پشتیبانی نقره‌ای', description: 'پشتیبانی در ساعات اداری', price: 5000000 },
//     { id: 'P3', code: 'LIC-SINGLE', name: 'لایسنس تک کاربره', description: 'مجوز استفاده برای یک کاربر', price: 2000000 },
//     { id: 'P4', code: 'TRAIN-BASIC', name: 'دوره آموزشی مقدماتی', description: 'دوره آموزشی ۸ ساعته برای تیم شما', price: 4000000 },
// ];


const Products: React.FC = () => {
    // state باید با داده‌های API پر شود
    const [products, setProducts] = useState<Product[]>([]);

    React.useEffect(() => {
        /*
          === API CALL REQUIRED HERE ===
          - Route: /api/products
          - Method: GET
          - Output: { "data": [Product] }
          - Sample Fetch Code:
            fetch('/api/products', { headers: { 'Authorization': 'Bearer <TOKEN>' } })
            .then(r => r.json())
            .then(data => setProducts(data.data));
        */
        const mockProducts: Product[] = [
            { id: 'P1', code: 'SRV-GOLD', name: 'سرویس پشتیبانی طلایی', description: 'پشتیبانی ۲۴/۷ با پاسخ‌دهی زیر ۱ ساعت', price: 10000000, stock: 100, type: 'service' },
            { id: 'P2', code: 'SRV-SILVER', name: 'سرویس پشتیبانی نقره‌ای', description: 'پشتیبانی در ساعات اداری', price: 5000000, stock: 50, type: 'service' },
        ];
        setProducts(mockProducts);
    }, []);

    const handleAddProduct = (productData: Omit<Product, 'id'>) => {
        /* === API CALL REQUIRED HERE (in ProductsList.tsx) === */
        const newProduct: Product = {
            id: `P-${Date.now()}`,
            ...productData
        };
        setProducts(prev => [...prev, newProduct]);
    };
    
    const handleUpdateProduct = (productToUpdate: Product) => {
        /* === API CALL REQUIRED HERE (in ProductsList.tsx) === */
        setProducts(prev => prev.map(p => p.id === productToUpdate.id ? productToUpdate : p));
    };
    
    const handleDeleteProduct = (productId: string) => {
        /* === API CALL REQUIRED HERE (in ProductsList.tsx) === */
         setProducts(prev => prev.filter(p => p.id !== productId));
    };

    return <ProductsList 
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
    />;
};

export default Products;
