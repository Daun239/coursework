import { useEffect, useState } from "react";
import { useServiceStore } from "../../../Stores/ServicesStore";
import getMinAndMaxFromService from "../../../lib/getMinAndMaxFromService";
import { Movie } from "@/Types/Movie";

export function useMovieFiltersLoader() {
  const { movieService } = useServiceStore();

  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<
    [number, number]
  >([0, 0]);

  const [minRuntime, setMinRuntime] = useState(0);
  const [maxRuntime, setMaxRuntime] = useState(0);
  const [selectedRuntimeRange, setSelectedRuntimeRange] = useState<
    [number, number]
  >([0, 0]);

  const [moviesCount, setMoviesCount] = useState(0);

  useEffect(() => {
    const fetchMinMax = async () => {
      const { min: minBudget, max: maxBudget } =
        await getMinAndMaxFromService<Movie>(movieService, "budget");
      const { min: minRuntime, max: maxRuntime } =
        await getMinAndMaxFromService<Movie>(movieService, "runtime");

      const budgetMin = minBudget?.budget ?? 0;
      const budgetMax = maxBudget?.budget ?? 0;
      const runtimeMin = minRuntime?.runtime ?? 0;
      const runtimeMax = maxRuntime?.runtime ?? 0;

      setMinBudget(budgetMin);
      setMaxBudget(budgetMax);
      setSelectedBudgetRange([budgetMin, budgetMax]);

      setMinRuntime(runtimeMin);
      setMaxRuntime(runtimeMax);
      setSelectedRuntimeRange([runtimeMin, runtimeMax]);

      const moviesCount = await movieService.getCount("");
      setMoviesCount(moviesCount);
    };

    fetchMinMax();
  }, [movieService]);

  return {
    minBudget,
    maxBudget,
    selectedBudgetRange,
    setSelectedBudgetRange,
    minRuntime,
    maxRuntime,
    selectedRuntimeRange,
    setSelectedRuntimeRange,
    moviesCount,
  };
}
