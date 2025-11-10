import React from 'react';
import ProductsList from '../sales/ProductsList';
import { Product } from '../../types';

interface ProductsProps {
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = (props) => {
    return <ProductsList {...props} />;
};

export default Products;
