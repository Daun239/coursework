import { useState, useCallback } from "react";
import axios from "axios";

export const useProductImage = () => {
  const [productImage, setProductImage] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const fetchProductImage = useCallback(
    async (productName: string, retry = false) => {
      setIsImageLoading(true);
      const formattedName = productName.split("(")[0].trim();
      const cachedImage = localStorage.getItem(formattedName);

      if (cachedImage && !retry) {
        setProductImage(cachedImage);
        setIsImageLoading(false);
        return;
      }

      const apiKey = "49973365-59bc8663d0ad71ccfe57714b9";
      const url = `https://pixabay.com/api/?key=${apiKey}&q=${formattedName}&image_type=illustration`;

      try {
        const response = await axios.get(url);
        if (response.data.hits.length > 0) {
          const imageUrl = response.data.hits[0].webformatURL;
          setProductImage(imageUrl);
          localStorage.setItem(formattedName, imageUrl);
        } else {
          setProductImage("");
        }
      } catch (error) {
        console.error("Error fetching product image:", error);
        setProductImage("");
      } finally {
        setIsImageLoading(false);
      }
    },
    []
  );

  return {
    productImage,
    isImageLoading,
    fetchProductImage,
  };
};
