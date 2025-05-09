import { ProductsInStorage } from "@/Types/ProductsInStorage";
import jsPDF from "jspdf";
import "jspdf-autotable";

type ExportFormat = "csv" | "json" | "pdf";

export const exportProductsData = (
  products: ProductsInStorage[],
  format: ExportFormat,
  filename: string = "products_data"
) => {
  if (!products || products.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(products[0]);

  switch (format) {
    case "json": {
      const json = JSON.stringify(products, null, 2);
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
      const csvRows = products.map((p) =>
        headers.map((h) => JSON.stringify((p as any)[h] ?? "")).join(",")
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
      const rows = products.map((p) => headers.map((h) => (p as any)[h]));
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
