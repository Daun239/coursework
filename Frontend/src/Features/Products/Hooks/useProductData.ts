import { useCartStore } from "@/Features/Cart/Stores/CartState";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Product } from "@/Types/Product";
import { ProductsInStorage } from "@/Types/ProductsInStorage";
import { ProductType } from "@/Types/ProductType";
import axios from "axios";
import { useState, useEffect } from "react";
import { useProductImage } from "./useProductImage";

const useProductData = (productInStorageId: number) => {
  const [hasBeenAddedToCart, setHasBeenAddedToCart] = useState(false);
  const [orderedProductsNumber, setOrderedProductsNumber] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [productInStorage, setProductInStorage] =
    useState<ProductsInStorage | null>(null);
  const [availableQuality, setAvailableQuality] = useState<number>(0);

  const { cart, addItem, removeItem } = useCartStore();
  const { productService, productTypeService, productsInStorageService } =
    useServiceStore();

  const handleProductsNumberChange = (newNumber: number) => {
    if (
      newNumber >= 0 &&
      productInStorage &&
      productInStorage.quantity &&
      newNumber <= productInStorage.quantity
    ) {
      setOrderedProductsNumber(newNumber);
      setAvailableQuality(productInStorage.quantity - newNumber);

      const updatedItem = { ...productInStorage, quantity: newNumber };
      addItem("product", updatedItem);
    }
  };

  const { productImage, isImageLoading, fetchProductImage } = useProductImage();

  useEffect(() => {
    fetchProductImage("Apple Juice");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product in storage
        const [fetchedInStorage] = await productsInStorageService.getAll(
          `productInStorageId = ${productInStorageId}`
        );
        setProductInStorage(fetchedInStorage);

        // Fetch associated product
        const [fetchedProduct] = await productService.getAll(
          `productId = ${fetchedInStorage.productId}`
        );
        setProduct(fetchedProduct);

        // Fetch product type
        const [fetchedProductType] = await productTypeService.getAll(
          `productTypeId = ${fetchedProduct.productTypeId}`
        );
        setProductType(fetchedProductType);

        // Fetch product image
        fetchProductImage(fetchedProduct.name);

        // Check if item is in cart
        const itemInCart = cart.product.find(
          (p) => p.productInStorageId === productInStorageId
        );

        if (itemInCart != null && itemInCart.quantity != null) {
          setAvailableQuality(fetchedInStorage.quantity - itemInCart.quantity);
          setOrderedProductsNumber(itemInCart.quantity);
          setHasBeenAddedToCart(true);
        } else {
          setAvailableQuality(fetchedInStorage.quantity);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (productInStorageId) {
      fetchData();
    }
  }, [
    productInStorageId,
    cart.product,
    productService,
    productTypeService,
    productsInStorageService,
  ]);

  return {
    product,
    productType,
    productInStorage,
    hasBeenAddedToCart,
    orderedProductsNumber,
    availableQuality,
    productImage,
    isImageLoading,
    handleProductsNumberChange,
  };
};

export default useProductData;
