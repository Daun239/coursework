// exportMovieData.ts
import { Movie } from "@/Types/Movie";
import jsPDF from "jspdf";
import "jspdf-autotable";

type ExportFormat = "csv" | "json" | "pdf";

export const exportMovieData = async (
  products: Movie[],
  format: ExportFormat,
  filename: string = "movies_data",
  services: {
    languageService: any;
    publisherService: any;
    ageRestrictionService: any;
    countryService: any;
  }
) => {
  if (!products || products.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Enrich products with classifier data
  const enrichedProducts = await Promise.all(
    products.map(async (product) => {
      // Fetch classifier data for each product
      const [language] = await services.languageService.getAll(
        `languageId = ${product.languageId}`
      );
      const [publisher] = await services.publisherService.getAll(
        `publisherId = ${product.publisherId}`
      );
      const [ageRestriction] = await services.ageRestrictionService.getAll(
        `ageRestrictionId = ${product.ageRestrictionId}`
      );
      const [country] = await services.countryService.getAll(
        `countryId = ${product.countryId}`
      );

      // Return product with enriched data, omitting the unwanted fields
      return {
        ...product,
        language: language?.language1 || "N/A",
        publisher: publisher?.publisher1 || "N/A",
        ageRestriction: ageRestriction?.ageRestriction1 || "N/A",
        country: country?.country1 || "N/A",
      };
    })
  );

  // Remove unwanted fields from enriched products
  const filteredProducts = enrichedProducts.map(
    ({
      movieId,
      languageId,
      publisherId,
      ageRestrictionId,
      countryId,
      ...rest
    }) => rest
  );

  // Get headers from filtered data
  const headers = Object.keys(filteredProducts[0]);

  switch (format) {
    case "json": {
      const json = JSON.stringify(filteredProducts, null, 2);
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
      const csvRows = filteredProducts.map((p) =>
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
      const rows = filteredProducts.map((p) =>
        headers.map((h) => (p as any)[h])
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
