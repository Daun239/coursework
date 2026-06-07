import formFilterQuery from "@/lib/formFilterQuery";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useServiceStore } from "@/Stores/ServicesStore";

const useClients = (
  searchBy: string,
  pageSize: number,
) => {
  const filterQuery = formFilterQuery(
    "OR",
    { field: "name", operator: "contains", values: [searchBy] },
    { field: "surname", operator: "contains", values: [searchBy] },
    { field: "email", operator: "contains", values: [searchBy] },
    { field: "cellNumber", operator: "contains", values: [searchBy] },
  );

  console.log("page size inside the hook", pageSize);
  const { clientService } = useServiceStore();

  const { data: clientsAmount = 0 } = useQuery({
    queryKey: ["clients", "count", searchBy],
    queryFn: () => {
      return clientService.getCount(filterQuery);
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", searchBy, pageSize],
    queryFn: ({ pageParam = 1 }) => {
      return clientService.getAll(filterQuery, "", pageParam, pageSize);
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  const clients = data?.pages.flat() ?? [];
  return {
    clients,
    isLoading,
    error,
    clientsAmount,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export default useClients;
