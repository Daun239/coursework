import { useServiceStore } from '@/Stores/ServicesStore';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { useUserStore } from '@/Stores/UserStore';
import { Product } from '@/Types/Product';
import { ProductType } from '@/Types/ProductType';
import { UserActionLog } from '@/Types/UserActionLog';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner"

interface Props {
    productId?: number;
    onUpdate?: () => void;
    handleRerender: () => void;
}

const translations = {
    en: {
        createProduct: 'Create Product',
        updateProduct: 'Update Product',
        productType: 'Product Type',
        selectType: 'Select type',
        name: 'Name',
        create: 'Create',
        update: 'Update',
        fillRequired: 'Please fill all required fields.',
        created: 'Product created.',
        updated: 'Product updated.',
        price: "Price"
    },
    ua: {
        createProduct: 'Створити продукт',
        updateProduct: 'Оновити продукт',
        productType: 'Тип продукту',
        selectType: 'Оберіть тип',
        name: 'Назва',
        create: 'Створити',
        update: 'Оновити',
        fillRequired: 'Будь ласка, заповніть всі обовяязкові поля.',
        created: 'Продукт створено.',
        updated: 'Продукт оновлено.',
        price: "Ціна"
    },
};

const CreateOrUpdateProduct: React.FC<Props> = ({ productId, onUpdate, handleRerender }) => {
    const { language } = useLanguageStore();
    const t = translations[language];
    const { user } = useUserStore();
    const { productTypeService, productService, userActionService } = useServiceStore();
    
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [product, setProduct] = useState<Product>({
        name: '',
        productTypeId: 0,
        price: 1,
    });
    const [dataVersion, setDataVersion] = useState<number>(1);
    
    // Load product types and product data if editing
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTypes = await productTypeService.getAll('', '', 1, 10000);
                setProductTypes(fetchedTypes);

                if (productId) {
                    const [fetchedProduct] = await productService.getAll(`productId = ${productId}`);
                    if (fetchedProduct) {
                        setProduct(fetchedProduct);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [productId, productService, productTypeService, language, dataVersion]);

    const refreshData = () => {
        setDataVersion(prev => prev + 1);
        if (onUpdate) {
            onUpdate();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product.name || !product.productTypeId) {
            toast.error(t.fillRequired);
            return;
        }

        try {
            let result;
            let action;
            
            if (productId) {
                result = await productService.update(product);
                toast.success(t.updated);
                action = "Updated";
            } else {
                result = await productService.create(product);
                toast.success(t.created);
                action = "Created";
            }

            // Log the user action
            const actionLog: UserActionLog = {
                action,
                details: `${JSON.stringify(result)}`,
                entity: "Product",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            };
            
            // await userActionService.post(actionLog);
            
            // Reset form if creating new product
            if (!productId) {
                setProduct({
                    name: '',
                    productTypeId: 0,
                    price: 1,
                });
            }
            
            // Trigger rerender and notify parent

            handleRerender();

            refreshData();
            
        } catch (error) {
            console.error('Error saving product:', error);
            // alert('An error occurred while saving the product');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl max-w-md mx-auto text-gray-800 dark:text-gray-100"
        >
            <h2 className="text-xl font-semibold mb-2">
                {productId ? t.updateProduct : t.createProduct}
            </h2>

            <div>
                <label className="block mb-1 font-medium">{t.productType}</label>
                <select
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={product.productTypeId}
                    onChange={(e) => setProduct({ ...product, productTypeId: Number(e.target.value) })}
                    required
                >
                    <option value="">{t.selectType}</option>
                    {productTypes.map((pt) => (
                        <option key={pt.id || pt.productTypeId} value={pt.productTypeId}>
                            {pt.productType1}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">{t.name}</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">{t.price}</label>
                <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {productId ? t.update : t.create}
            </button>
        </form>
    );
};

export default CreateOrUpdateProduct;