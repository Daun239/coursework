import { useEffect, useState } from "react";
import { useServiceStore } from "../Stores/ServicesStore";
import { PaymentMethod } from "../Types/PaymentMethod";

function usePaymentMethods() {
  const { paymentMethodService } = useServiceStore();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    paymentMethodService.getAll().then(setMethods);
  }, [paymentMethodService]);

  return methods;
}

export default usePaymentMethods;
