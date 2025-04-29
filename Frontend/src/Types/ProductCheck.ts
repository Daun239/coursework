export interface ProductCheck {
    productCheckId: number;
    paymentMethodId?: number | null;
    clientId?: number | null;
    employeeId?: number | null;
    number?: number | null;
    sum?: number | null;
    buyTime?: Date | null;
  }
  