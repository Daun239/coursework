import React, { useEffect, useState } from 'react';
import { ProductPlacement } from "@/Types/ProductPlacement";
import { format } from 'date-fns';
import { useServiceStore } from '@/Stores/ServicesStore';
import { Product } from '@/Types/Product';
import { Employee } from '@/Types/Employee';
import { Cinema } from '@/Types/Cinema';
import { City } from '@/Types/City';
import { Progress } from '@/components/ui/progress';
import { MapPin, User, Calendar, Box } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProductPlacementService } from '@/lib/ProductPlacement';
import { toast } from 'sonner';

interface ProductPlacementProps {
    productPlacement: ProductPlacement;
    overallQuantity: number;
    handleRerender: () => void;
}

const ProductPlacementComponent = ({ productPlacement, overallQuantity, handleRerender }: ProductPlacementProps) => {
    const { productService, productPlacementService, productsInStorageService, employeeService, cinemaService, cityService } = useServiceStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [employee, setEmployee] = useState<Employee>();
    const [cinema, setCinema] = useState<Cinema>();
    const [city, setCity] = useState<City>();

    useEffect(() => {
        const fetchData = async () => {
            const [productInStorage] = await productsInStorageService.getAll(`productInStorageId = ${productPlacement.productInStorageId}`);
            const [product] = await productService.getAll(`productId = ${productInStorage.productId}`);
            setProduct(product);

            const [employee] = await employeeService.getAll(`employeeId = ${productPlacement.employeeId}`);
            setEmployee(employee);

            const [cinema] = await cinemaService.getAll(`cinemaId = ${employee.cinemaId}`);
            setCinema(cinema);

            const [city] = await cityService.getAll(`cityId = ${cinema.cityId}`);
            setCity(city);
        };

        fetchData();
    }, [productPlacement.productInStorageId]);

    const completedPercentage =
        productPlacement.quantity > 0
            ? (productPlacement.quantity / overallQuantity) * 100
            : 0;

    const handleDeletePlacement = async () => {
        try {
            // Get the current storage
            const [productInStorage] = await productsInStorageService.getAll(
                `productInStorageId = ${productPlacement.productInStorageId}`
            );

            if (!productInStorage) {
                toast.error("Product in storage not found.");
                return;
            }

            // Subtract the placement quantity from storage
            const updatedStorage = {
                ...productInStorage,
                quantity: productInStorage.quantity - productPlacement.quantity,
            };

            // Update storage
            await productsInStorageService.update(updatedStorage);

            // Delete the placement
            await productPlacementService.delete(`productPlacementId = ${productPlacement.productPlacementId}`);

            toast.success("Placement deleted and storage updated.");

            handleRerender();

            // Optional: trigger parent reload
            // onDeleteSuccess?.();
        } catch (error: any) {
            toast.error(error?.message || "Error deleting placement.");
        }
    };

    return (
        <div className="p-6 border rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    {/* <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[70%]">
                        {product?.name || "Loading product..."}
                    </h3> */}
                    <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(productPlacement.placementDate), "MMM d, yyyy, HH:mm")}
                    </div>
                </div>

                <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="ml-2">
                        <p className="font-medium text-gray-800">{cinema?.name}</p>
                        <p className="text-sm text-gray-600">{city?.city1}, {cinema?.address}</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                            <Box className="w-4 h-4 mr-1 text-blue-600" />
                            <span className="font-medium">Quantity</span>
                        </div>
                        <span className="font-medium">{productPlacement.quantity} / {overallQuantity}</span>
                    </div>
                    <Progress value={completedPercentage} className="h-2 bg-gray-200" />
                    <p className="text-xs text-right mt-1 text-gray-500">
                        {completedPercentage.toFixed(1)}% of total
                    </p>
                </div>

                <div className="flex items-center pt-2 border-t border-gray-100">
                    <User className="w-4 h-4 text-gray-500" />
                    <p className="ml-1 text-sm text-gray-600">
                        Placed by <span className="font-medium">{employee?.name} {employee?.surname}</span>
                    </p>
                </div>


            </div>

            <div className="flex justify-end mt-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                            title="Delete Placement"
                        >
                            Delete
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 w-64 shadow-lg space-y-4">
                        <p className="text-sm font-medium text-gray-800">
                            Are you sure you want to delete this placement?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                                onClick={() => document.activeElement?.blur()} // Closes popover
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                                onClick={handleDeletePlacement}
                            >
                                Delete
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

        </div>
    );
};

export default ProductPlacementComponent;
