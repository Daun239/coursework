export interface DeliveryOrder {
    deliveryOrderId: number;
    deliveryOrderStatusId?: number | null;
    paymentMethodId?: number | null;
    supplierId?: number | null;
    employeeId?: number | null;
    number?: number | null;
    sum?: number | null;
    orderDateTime: Date;
    endDateTime?: Date | null;
  }
  