export interface ProductsInStorage {
    productInStorageId: number;
    productId: number;
    cinemaId: number;
    productionDate?: Date | null;
    expirationDate?: Date | null;
    quantity?: number | null;
  }
  