function cleanInClauses(query) {
  return query.replace(
    /(\w+)\s+IN\s*\(([^)]+)\)/gi,
    (match, column, values) => {
      const valueList = values
        .split(",")
        .map((v) => v.trim().replace(/^'|'$/g, "")); // trim and strip quotes if present

      const isNumeric = valueList.every((v) => !isNaN(v));
      const unique = [...new Set(valueList)];

      const cleanedValues = isNumeric
        ? unique.map(Number).join(",") // numeric: 1,2,3
        : unique.map((v) => `'${v}'`).join(","); // strings: 'a','b','c'

      return `${column} IN (${cleanedValues})`;
    }
  );
}

export default cleanInClauses;
