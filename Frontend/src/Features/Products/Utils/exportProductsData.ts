import { DeliveryOrderStatusService } from "@/lib/DeliveryOrderStatus";
import { EmployeeService } from "@/lib/Employee";
import { PaymentMethodService } from "@/lib/PaymentMethod";
import { ProductService } from "@/lib/Product";
import { SupplierService } from "@/lib/Supplier";
import { DeliveryOrder } from "@/Types/DeliveryOrder";
import { ProductsInStorage } from "@/Types/ProductsInStorage";
import jsPDF from "jspdf";
import "jspdf-autotable";

type ExportFormat = "csv" | "json" | "pdf";

export const exportProductData = async (
  deliveryOrders: ProductsInStorage[],
  format: ExportFormat,
  filename: string = "delivery_orders_data",
  services: {
    productService: ProductService;
  }
) => {
  if (!deliveryOrders || deliveryOrders.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Enrich delivery orders with related data (supplier, payment method, employee, delivery order status)
  const enrichedOrders = await Promise.all(
    deliveryOrders.map(async (order) => {
      const [product] = await services.productService.getAll(
        `productId = ${order.productId}`
      );

      // Return enriched order data, omitting unwanted fields
      return {
        ...order,
        product: `Price : ${product.price} Name : ${product.name}`,
      };
    })
  );

  // Remove unwanted fields from enriched orders
  const filteredOrders = enrichedOrders.map(
    ({ productInStorageId, productId, cinemaId, ...rest }) => rest
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
