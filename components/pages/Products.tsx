import React, { useState } from 'react';
import ProductsList from '../sales/ProductsList';
import { Product } from '../../types';

const mockProducts: Product[] = [
    { id: 'P1', code: 'SRV-GOLD', name: 'سرویس پشتیبانی طلایی', description: 'پشتیبانی ۲۴/۷ با پاسخ‌دهی زیر ۱ ساعت', price: 10000000 },
    { id: 'P2', code: 'SRV-SILVER', name: 'سرویس پشتیبانی نقره‌ای', description: 'پشتیبانی در ساعات اداری', price: 5000000 },
    { id: 'P3', code: 'LIC-SINGLE', name: 'لایسنس تک کاربره', description: 'مجوز استفاده برای یک کاربر', price: 2000000 },
    { id: 'P4', code: 'TRAIN-BASIC', name: 'دوره آموزشی مقدماتی', description: 'دوره آموزشی ۸ ساعته برای تیم شما', price: 4000000 },
];


const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);

    const handleAddProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            id: `P-${Date.now()}`,
            ...productData
        };
        setProducts(prev => [...prev, newProduct]);
    };
    
    const handleUpdateProduct = (productToUpdate: Product) => {
        setProducts(prev => prev.map(p => p.id === productToUpdate.id ? productToUpdate : p));
    };
    
    const handleDeleteProduct = (productId: string) => {
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
