import { useServiceStore } from '@/Stores/ServicesStore';
import { Product } from '@/Types/Product';
import React, { useEffect, useState } from 'react';
import ProductComponent from './ProductComponent';
import Sidebar from '@/components/Sidebar';
import { useUserStore } from '@/Stores/UserStore';
import { ProductsInStorage } from '@/Types/ProductsInStorage';
import { ProductType } from '@/Types/ProductType';
import formFilterQuery from '@/lib/formFilterQuery';
import DropdownList from '@/components/DropdownList';
import RangeSlider from '@/components/RangeSlider';
import Pagination from '@/components/Pagination';


import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"









const ProductsList = () => {

    const { user } = useUserStore();

    const { productsInStorageService, productTypeService, productService } = useServiceStore();
    const [productsInStorage, setProductsInStorage] = useState<ProductsInStorage[]>([]);
    const [loading, setLoading] = useState(true);


    const [products, setProducts] = useState<Product[]>([]);

    const [productTypes, setProductTypes] = useState<ProductType[]>([]);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);
    const [pagesCount, setPagesCount] = useState<number>(1);

    const [productNames, setProductNames] = useState<string[]>([]);

    const [minProductPrice, setMinProductPrice] = useState<number>();
    const [maxProductPrice, setMaxProductPrice] = useState<number>();

    const [minProductQuantity, setMinProductQuantity] = useState<number>();
    const [maxProductQuantity, setMaxProductQuantity] = useState<number>();


    const [selectedProductPriceRange, setSelectedProductPriceRange] = useState<[number, number]>([0, 0]);
    const [selectedProductQuantityRange, setSelectedProductQuantityRange] = useState<[number, number]>([0, 0]);

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);


    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
        setState(selected);
    }

    const [productionDate, setProductionDate] = useState<Date>();

    const [expirationDate, setExpirationDate] = useState<Date>();


    useEffect(() => {
        setPagesCount(Math.ceil(productsInStorage.length / pageSize));

        console.log("pagescount", pagesCount)
    }, [pageSize, productsInStorage]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const initialProductsInStorage = await productsInStorageService.getAll(`cinemaId = ${user?.cinemaId}`);


                // setProductsInStorage(productsInStorage);

                const productIds = initialProductsInStorage.map(p => p.productId);
                const productsQuery = formFilterQuery("AND", {
                    field: 'productId',
                    operator: 'in',
                    values: productIds,
                },
                    {
                        field: "price",
                        values: selectedProductPriceRange.map(v => v.toString()).filter(v => v !== '0'), // Ensure they are strings,
                        operator: "range",
                    }

                );

                const products = await productService.getAll(productsQuery, "", 1, 10000000);
                setProducts(products);



                const producttsInStorageFilterQuery = formFilterQuery("AND",

                    {
                        field: "cinemaId",
                        operator: "in",
                        values: [user?.cinemaId] // Ensures it's an array
                    },

                    // {
                    //     field: 'productionDate',
                    //     operator: "in",
                    //     values: productionDate?.getDate(),
                    // },
                    // {
                    //     values: expirationDate,
                    //     field: "",
                    //     operator: "in",
                    // },
                    {
                        field: "quantity",
                        values: selectedProductQuantityRange.map(v => v.toString()).filter(v => v !== '0'), // Ensure they are strings,
                        operator: "range",
                    },
                    {
                        field: "productId",
                        values: products.map(p => p.productId),
                        operator: "in"
                    }

                )

                const productsInStorage = await productsInStorageService.getAll(producttsInStorageFilterQuery, "", currentPage, pageSize);

                setProductsInStorage(productsInStorage);


                const productTypes = await productTypeService.getAll('', '', 1, 100000);
                setProductTypes(productTypes);

                // Fetch min/max quantity
                const [minQuantityItem] = await productsInStorageService.getAll('', 'quantity asc', 1, 1);
                const [maxQuantityItem] = await productsInStorageService.getAll('', 'quantity desc', 1, 1);
                setMinProductQuantity(minQuantityItem?.quantity ?? 0);
                setMaxProductQuantity(maxQuantityItem?.quantity ?? 0);

                // Fetch min/max price
                const [minPriceItem] = await productService.getAll('', 'price asc', 1, 1);
                const [maxPriceItem] = await productService.getAll('', 'price desc', 1, 1);
                setSelectedProductPriceRange([
                    minPriceItem?.price ?? 0,
                    maxPriceItem?.price ?? 0,
                ]);
                setMaxProductPrice(maxPriceItem?.price ?? 0);
                setMinProductPrice(minPriceItem?.price ?? 0);


            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [minProductPrice, maxProductPrice, minProductQuantity, maxProductQuantity, productNames, currentPage, pageSize, selectedProductPriceRange, selectedProductQuantityRange, productTypes, productionDate, expirationDate]);


    return (
        <div className="p-4">




            {/* Sidebar with filters */}
            <Sidebar
                width={320}
                tabPosition="middle"
                tabColor="bg-primary"
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            >

                <div className="filters-container">

                    {productsInStorage.length && <h2 className="font-semibold text-xl mb-4">{productsInStorage.length} products found</h2>}


                    <DropdownList
                        listName="Filter by product names"
                        service={productService}
                        displayKey="name"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setProductNames)}
                    />

                    <DropdownList
                        listName="Filter by product types"
                        service={productTypeService}
                        displayKey="productType1"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setProductTypes)}
                    />

                    <label className="input bg-gray-200 dark:bg-gray-800 my-4">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                    </label>

                    {/* Range Sliders */}
                    <RangeSlider
                        min={minProductPrice}
                        max={maxProductPrice}
                        onRangeCommit={(range) => setSelectedProductPriceRange(range)}
                        sliderName="Product price"
                        currency="$"
                    />

                    <RangeSlider
                        min={minProductQuantity}
                        max={maxProductQuantity}
                        onRangeCommit={(range) => setSelectedProductQuantityRange(range)}
                        sliderName="Product quantity"
                        currency=""
                    />
                </div>


                <div className='my-2'>Production date</div>


                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !productionDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {productionDate ? format(productionDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={productionDate}
                            onSelect={setProductionDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>


                <div className='my-2'>Expiration date</div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !productionDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={expirationDate}
                            onSelect={setExpirationDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <div className="mt-2">
                    <label className="block font-medium mb-4">Items per page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page when size changes
                        }}
                        className=" bg-gray-200 dark:bg-gray-800 select select-bordered w-full"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                {/* Pagination component inside sidebar */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagesCount}
                    onPageChange={setCurrentPage}
                />


            </Sidebar>




            <h2 className="text-2xl font-bold mb-4">Products List</h2>

            {loading && <p>Loading...</p>}

            {!loading && products.length === 0 && <p>No products found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productsInStorage.length > 0 && productsInStorage.map(product => (
                    <ProductComponent key={product.productInStorageId} productInStorageId={product.productInStorageId} />
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
