type FilterInput = {
  field: string;
  values: (string | number)[];
  operator: "in" | "contains" | "range";
};

export default FilterInput;
