export interface Check {
    checkId: number;
    sum?: number | null;
    paymentMethodId?: number | null;
    employeeId: number;
    clientId: number;
    buyDateTime?: Date | null;
  }
  