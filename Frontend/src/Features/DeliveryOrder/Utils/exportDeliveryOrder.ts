import { DeliveryOrderStatusService } from "@/lib/DeliveryOrderStatus";
import { EmployeeService } from "@/lib/Employee";
import { PaymentMethodService } from "@/lib/PaymentMethod";
import { SupplierService } from "@/lib/Supplier";
import { DeliveryOrder } from "@/Types/DeliveryOrder";
import jsPDF from "jspdf";
import "jspdf-autotable";

type ExportFormat = "csv" | "json" | "pdf";

export const exportDeliveryOrderData = async (
  deliveryOrders: DeliveryOrder[],
  format: ExportFormat,
  filename: string = "delivery_orders_data",
  services: {
    supplierService: SupplierService;
    paymentMethodService: PaymentMethodService;
    employeeService: EmployeeService;
    deliveryOrderStatusService: DeliveryOrderStatusService;
  }
) => {
  if (!deliveryOrders || deliveryOrders.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Enrich delivery orders with related data (supplier, payment method, employee, delivery order status)
  const enrichedOrders = await Promise.all(
    deliveryOrders.map(async (order) => {
      const [supplier] = await services.supplierService.getAll(
        `supplierId = ${order.supplierId}`
      );
      const [paymentMethod] = await services.paymentMethodService.getAll(
        `paymentMethodId = ${order.paymentMethodId}`
      );
      const [employee] = await services.employeeService.getAll(
        `employeeId = ${order.employeeId}`
      );
      const [status] = await services.deliveryOrderStatusService.getAll(
        `deliveryOrderStatusId = ${order.deliveryOrderStatusId}`
      );

      // Return enriched order data, omitting unwanted fields
      return {
        ...order,
        supplier:
          supplier?.name && supplier?.name
            ? `${supplier.surname} ${supplier.surname}`
            : "N/A",
        paymentMethod: paymentMethod?.paymentMethod1 || "N/A",
        employee:
          employee?.name && employee?.surname
            ? `${employee.name} ${employee.surname}`
            : "N/A",

        deliveryOrderStatus: status?.deliveryOrderStatus1 || "N/A", // Handle the status field
      };
    })
  );

  // Remove unwanted fields from enriched orders
  const filteredOrders = enrichedOrders.map(
    ({
      deliveryOrderId,
      deliveryOrderStatusId,
      supplierId,
      paymentMethodId,
      employeeId,
      statusId,
      ...rest
    }) => rest
  );

  // Get headers from filtered data
  const headers = Object.keys(filteredOrders[0]);

  switch (format) {
    case "json": {
      const json = JSON.stringify(filteredOrders, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
      break;
    }

    case "csv": {
      const csvHeader = headers.join(",");
      const csvRows = filteredOrders.map((order) =>
        headers.map((h) => JSON.stringify((order as any)[h] ?? "")).join(",")
      );
      const csvContent = [csvHeader, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      break;
    }

    case "pdf": {
      const doc = new jsPDF();
      const rows = filteredOrders.map((order) =>
        headers.map((h) => (order as any)[h])
      );
      doc.autoTable({
        head: [headers],
        body: rows,
      });
      doc.save(`${filename}.pdf`);
      break;
    }

    default:
      console.error("Unsupported export format:", format);
  }
};
