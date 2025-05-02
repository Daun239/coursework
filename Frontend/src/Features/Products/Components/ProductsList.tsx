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
import { useProductRange } from '../Hooks/useProductRange';
import cleanInClauses from '@/lib/cleanInClauses';









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

    const [productNames, setProductNames] = useState<Product[]>([]);

    const [selectedProductPriceRange, setSelectedProductPriceRange] = useState<[number, number]>([1, 1000000000000]);
    const [selectedProductQuantityRange, setSelectedProductQuantityRange] = useState<[number, number]>([1, 1000000000000]);

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const [initialProductsInStorage, setInitialProductsInStorage] = useState<Product[]>([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
        setState(selected);
    }

    const [productionDate, setProductionDate] = useState<Date>();

    const [expirationDate, setExpirationDate] = useState<Date>();

    const { minProductPrice, maxProductPrice, minProductQuantity, maxProductQuantity } = useProductRange();


    const [productsInStorageCount, setProductsInStorageCount] = useState<number>(1);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "f" && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault()
                toggleSidebar();
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // This effect only handles pagination calculation
    useEffect(() => {
        if (productsInStorage.length > 0) {
            setPagesCount(Math.ceil(productsInStorageCount / pageSize));

            console.log('pagescount', pagesCount);
        }
    }, [productsInStorage.length, pageSize, productsInStorageCount]);

    // Separate effect to fetch product types once
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const types = await productTypeService.getAll('', '', 1, 100000);
                setProductTypes(types);
            } catch (error) {
                console.error("Failed to fetch product types", error);
            }
        };

        setSelectedProductQuantityRange([minProductQuantity, maxProductQuantity]);

        setSelectedProductPriceRange([minProductPrice, maxProductPrice]);


        fetchProductTypes();
    }, []); // Empty dependency array means this runs once on mount



    // Separate effect to fetch product types once
    useEffect(() => {
        const fetchInitialProductsInStorage = async () => {
            try {
                const initialProductsInStorage = await productsInStorageService.getAll(`cinemaId = ${user?.cinemaId}`, "", 1, 10000000);
                setInitialProductsInStorage(initialProductsInStorage);
            } catch (error) {
                console.error("Failed to fetch product types", error);
            }
        };

        fetchInitialProductsInStorage();
    }, []); // Empty dependency array means this runs once on mount

    const handleKeyDown = (e) => {
        if (e.key === 'enter') {
            return;
        }
    }


    const [isPageReset, setIsPageReset] = useState(false);


    useEffect(() => {
        setCurrentPage(1);  // Reset to page 1
        setIsPageReset(prev => !prev);  // Mark that the page has been reset
    }, [productNames, selectedProductPriceRange, selectedProductQuantityRange, productionDate, expirationDate, productTypes, pageSize]);


    useEffect(() => {
        if (
            minProductPrice !== undefined && maxProductPrice !== undefined &&
            minProductQuantity !== undefined && maxProductQuantity !== undefined &&
            (minProductPrice !== 0 || maxProductPrice !== 0) // optional safeguard
        ) {
            setSelectedProductQuantityRange([minProductQuantity, maxProductQuantity]);
            setSelectedProductPriceRange([minProductPrice, maxProductPrice]);
        }
    }, [minProductPrice, maxProductPrice, minProductQuantity, maxProductQuantity]);




    useEffect(() => {
        const fetchProducts = async () => {

            if (
                selectedProductPriceRange[0] === 0 && selectedProductPriceRange[1] === 0 ||
                selectedProductQuantityRange[0] === 0 && selectedProductQuantityRange[1] === 0
            ) return;



            console.log(`productNames = `, productNames)
            try {
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
                    },

                    {
                        field: 'productTypeId',
                        operator: "in",
                        values: productTypes.map(p => p.productTypeId),
                    },
                    {
                        field: 'name',
                        operator: "in",
                        values: productNames.map(p => p.name),
                    }
                );

                console.log('productsquery = ', productsQuery);
                console.log(`cleaned query`, cleanInClauses(productsQuery))
                const products = await productService.getAll(productsQuery, "", 1, 10000000);
                setProducts(products);

                const producttsInStorageFilterQuery = `CinemaId = ${user?.cinemaId} And ` + formFilterQuery("AND",

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
                        values: selectedProductQuantityRange.map(v => v.toString()), // Ensure they are strings,
                        operator: "range",
                    },
                    {
                        field: "productId",
                        values: products.map(p => p.productId),
                        operator: "in"
                    }

                )

                console.log('products in storage query', producttsInStorageFilterQuery);



                const productsInStorageCount = await productsInStorageService.getCount(producttsInStorageFilterQuery);

                setProductsInStorageCount(productsInStorageCount);



                const productsInStorage = await productsInStorageService.getAll(producttsInStorageFilterQuery, "", currentPage, pageSize);

                setProductsInStorage(productsInStorage);


            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };


        console.log(`quantity range`, selectedProductQuantityRange);

        console.log(`price range`, selectedProductPriceRange);
        fetchProducts();

    }, [currentPage, isPageReset]);

    return (
        <div className="p-4 h-full">




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


                    {<DropdownList
                        listName="Filter by product names"
                        service={productService}
                        displayKey="name"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setProductNames)}
                    />
                    }

                    {<DropdownList
                        listName="Filter by product types"
                        service={productTypeService}
                        displayKey="productType1"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setProductTypes)}
                    />}

                    {/* <label className="input input-bordered flex items-center gap-2 bg-gray-200 dark:bg-gray-800 my-4 rounded px-3 py-2">
                        <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                        <input onKeyDown={e => handleKeyDown(e)} type="text" placeholder="Search by product name..." className="bg-transparent outline-none flex-1" />
                    </label> */}


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
                            const value = Number(e.target.value);
                            setPageSize(value);
                            setCurrentPage(1); // Reset to the first page when size changes
                        }}
                        className="bg-gray-200 dark:bg-gray-800 input input-bordered w-full"
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

            <div
                className={`
    fixed inset-0 z-10 flex items-center justify-center bg-black/50
    transition-opacity duration-300
    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `}
            ></div>

            <h2 className="text-2xl font-bold my-8">Products List</h2>

            {loading && <p>Loading...</p>}

            {/* Show message when no products are found */}
            {!loading && products.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center my-8">
                    <div className="text-4xl text-gray-400">
                        <i className="fas fa-box-open"></i> {/* You can use a product-related icon */}
                    </div>
                    <p className="text-lg text-gray-600 mt-4">Oops, we couldn't find any products matching your criteria.</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search parameters.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productsInStorage.length > 0 && productsInStorage.map(product => (
                    <ProductComponent key={product.productInStorageId} productInStorageId={product.productInStorageId} />
                ))}

                {/* Handle case when productsInStorage is empty */}
                {productsInStorage.length === 0 && !loading && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No products found. Please try changing your filters or check back later.
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductsList;
