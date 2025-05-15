import { useServiceStore } from '@/Stores/ServicesStore';
import { Product } from '@/Types/Product';
import React, { useEffect, useState } from 'react';
import ProductComponent from './ProductComponent';
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
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { t } from '../Utils/useTranslation';
import CreateOrUpdateProduct from './CreateOrUpdateProduct';
import { exportProductData } from '../Utils/exportProductsData';









const ProductsList = () => {



    const { user } = useUserStore();

    const { productsInStorageService, productTypeService, productService } = useServiceStore();
    const [productsInStorage, setProductsInStorage] = useState<ProductsInStorage[]>([]);
    const [loading, setLoading] = useState(true);


    const [products, setProducts] = useState<Product[]>([]);

    const [productTypes, setProductTypes] = useState<ProductType[]>([]);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
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


    const handleSelectProduct = (productId: number) => {
        setSelectedProductId(productId);
        setCreateProductOpen(true);
    };




    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            // Handle both 'f' (English) and 'ф' (Ukrainian) for switching sidebar
            const ukrainianFKey = e.key === "а" || e.key === "f";

            if (ukrainianFKey && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault();
                toggleSidebar();
            }
        };

        document.addEventListener("keydown", down);
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


    const { language } = useLanguageStore(); // <-- use language from store


    const [createProductOpen, setCreateProductOpen] = useState<boolean>(false);



    const [selectedProductId, setSelectedProductId] = useState<number>(null);



    const handleExport = (format: "csv" | "json" | "pdf") => {
        const services = {
            productService
        };

        exportProductData(productsInStorage, format, `products_data_${format}`, services);
    };




    return (
        <div className="flex h-screen overflow-hidden mt-16">
            {/* Sidebar with filters */}
            <div
                className={`
                    transition-all duration-300 ease-in-out h-screen overflow-auto
                    ${isSidebarOpen ? 'w-80' : 'w-0'}
                `}
            >
                <div className="w-80 h-full bg-white dark:bg-gray-900 p-4 shadow-lg">
                    <div className="filters-container">
                        {productsInStorage.length > 0 && <h2 className="font-semibold text-xl mb-4">{productsInStorage.length} {t[language].filters.productsFound}</h2>}

                        {<DropdownList
                            listName={t[language].filters.filterByProductNames}
                            service={productService}
                            displayKey="name"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setProductNames)}
                        />}

                        {<DropdownList
                            listName={t[language].filters.filterByProductTypes}
                            service={productTypeService}
                            displayKey="productType1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setProductTypes)}
                        />}

                        {/* Range Sliders */}
                        <RangeSlider
                            min={minProductPrice}
                            max={maxProductPrice}
                            onRangeCommit={(range) => setSelectedProductPriceRange(range)}
                            sliderName={t[language].filters.productPrice}
                            currency="$"
                        />

                        <RangeSlider
                            min={minProductQuantity}
                            max={maxProductQuantity}
                            onRangeCommit={(range) => setSelectedProductQuantityRange(range)}
                            sliderName={t[language].filters.productQuantity}
                            currency=""
                        />

                        <div className='my-2'>{t[language].filters.productionDate}</div>
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
                                    {productionDate ? format(productionDate, "PPP") : <span>{t[language].buttons.pickDate}</span>}
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

                        <div className='my-2'>{t[language].filters.expirationDate}</div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !expirationDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {expirationDate ? format(expirationDate, "PPP") : <span>{t[language].buttons.pickDate}</span>}
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
                            <label className="block font-medium mb-4">{t[language].filters.itemsPerPage}</label>
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
                                <option value={100}>100</option>
                                <option value={250}>250</option>
                            </select>
                        </div>

                        {/* Pagination component inside sidebar */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagesCount}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen overflow-auto p-6">
                {/* Toggle sidebar button and header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md cursor-pointer bg-gray-500 dark:bg-gray-900 text-white hover:bg-primary-dark transition-colors mr-4"
                    >
                        {isSidebarOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                    <h2 className="text-2xl font-bold">{t[language].productsList}</h2>
                </div>


                <div className="flex items-center mb-6 space-x-4">
                    <button
                        onClick={() => setCreateProductOpen(prev => !prev)}
                        className="px-4 py-2 rounded-md cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 ease-in-out flex items-center shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        {t[language].addProduct}
                    </button>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleExport("csv")}
                            title="Export as CSV"
                            className="flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
                        >
                            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            CSV
                        </button>

                        <button
                            onClick={() => handleExport("json")}
                            title="Export as JSON"
                            className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
                        >
                            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-14a2 2 0 00-2-2h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8 7.5V4.5a2 2 0 114 0v3M8 7.5h4M16 15l-2-2m0 0l-2 2m2-2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            JSON
                        </button>
                    </div>
                </div>





                {createProductOpen && <div className="fixed inset-0 z-50 flex items-center justify-center ">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl relative">
                        <button
                            onClick={() => {
                                setCreateProductOpen(false);
                                setSelectedProductId(null);
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                        >
                            ✕
                        </button>

                        <CreateOrUpdateProduct productId={selectedProductId} />
                    </div>
                </div>}






                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <p>{t[language].loading}</p>
                    </div>
                )}

                {/* No products found message */}
                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center my-8">
                        <div className="text-4xl text-gray-400">
                            <i className="fas fa-box-open"></i>
                        </div>
                        <p className="text-lg text-gray-600 mt-4">{t[language].noResults.subtitle}</p>
                        <p className="text-sm text-gray-500 mt-2">{t[language].noResults.suggestion}</p>
                    </div>
                )}

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-12">
                    {productsInStorage.length > 0 && productsInStorage.map(product => (
                        <ProductComponent onSelecProductId={handleSelectProduct} key={product.productInStorageId} productInStorageId={product.productInStorageId} />
                    ))}

                    {/* Empty state within grid */}
                    {productsInStorage.length === 0 && !loading && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {t[language].product.noProducts}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ProductsList;
