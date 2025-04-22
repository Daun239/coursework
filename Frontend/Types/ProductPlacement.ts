export interface ProductPlacement {
    productPlacementId: number;
    employeeId: number;
    productInStorageId: number;
    productInOrderId: number;
    placementDate: Date;
    quantity?: number | null;
  }
  