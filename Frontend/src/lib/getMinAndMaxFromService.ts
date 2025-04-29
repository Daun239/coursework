async function getMinAndMaxFromService<T>(
  service: {
    getAll: (
      filter: string,
      sortBy: string,
      page: number,
      pageSize: number
    ) => Promise<T[]>;
  },
  field: string
): Promise<{ min: T | null; max: T | null }> {
  try {
    const [minArr, maxArr] = await Promise.all([
      service.getAll("", `${field} asc`, 1, 1),
      service.getAll("", `${field} desc`, 1, 1),
    ]);

    return {
      min: minArr.length > 0 ? minArr[0] : null,
      max: maxArr.length > 0 ? maxArr[0] : null,
    };
  } catch (error) {
    console.error(`Failed to get min and max for ${field}:`, error);
    return { min: null, max: null };
  }
}

export default getMinAndMaxFromService;
