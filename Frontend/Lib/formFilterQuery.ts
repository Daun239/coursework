import FilterInput from "../Types/FilterInput";

const formFilterQuery = (
  logic: "AND" | "OR" = "AND",
  ...filters: FilterInput[]
): string => {
  return filters
    .filter((f) => f.values.some((v) => v != null && v !== "")) // Exclude null, undefined, and empty strings
    .map((f) => {
      const { field, values, operator } = f;

      // If operator is 'contains', format as a Dynamic LINQ expression with double quotes
      if (operator === "contains") {
        return `${field}.Contains("${values[0]}")`; // Using double quotes around the value
      }

      // Handle 'in' operator (for arrays of values)
      if (operator === "in") {
        const formattedValues = values
          .map((v) => (typeof v === "string" ? `'${v}'` : v))
          .join(",");
        return `${field} IN (${formattedValues})`;
      }

      // Handle 'range' operator (for numeric ranges like budget or runtime)
      if (operator === "range") {
        const [min, max] = values;
        if (min !== 0 && max !== 0) {
          return `${field} >= ${min} AND ${field} <= ${max}`;
        }
        if (min !== 0) {
          return `${field} >= ${min}`;
        }
        if (max !== 0) {
          return `${field} <= ${max}`;
        }
        return ""; // If both are zero, don't include the filter
      }

      return "";
    })
    .join(` ${logic} `); // Combine with the provided logic (AND/OR)
};

export default formFilterQuery;
