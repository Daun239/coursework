import React, { useEffect, useState } from 'react';
import { useServiceStore } from '../../../Stores/ServicesStore';
import { Product } from '../../../Types/Product';
import ProductComponent from "./ProductComponent"

const ProductsList = () => {
    const { productService } = useServiceStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAll();

                console.log(data);

                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="p-4 ">
            <h2 className="text-2xl font-bold mb-4">Products List</h2>

            {loading && <p>Loading...</p>}

            {!loading && products.length === 0 && <p>No products found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                    < ProductComponent productId={product.productId} />
                ))
                }
            </div >
        </div >
    );
};

export default ProductsList;
