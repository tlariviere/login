import type {
  QueryKey,
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { useQuery } from "react-query";

import { fetchData } from "../utils/fetchHelpers";
import HttpError from "../utils/HttpError";

const useQueryRequireLogin = <
  QueryFnData = unknown,
  Data = QueryFnData,
  Key extends QueryKey = QueryKey
>(
  queryKey: Key,
  queryFn: QueryFunction<QueryFnData, Key>,
  options?: Omit<
    UseQueryOptions<QueryFnData, Error, Data, Key>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<Data, Error> => {
  const query = useQuery(queryKey, queryFn, options);
  const { isLoading, isFetched, isError, error, refetch } = query;
  const enableRefresh = error instanceof HttpError && error.statusCode === 401;
  const refresh = useQuery(
    ["refreshToken", queryKey],
    async () => fetchData("/api/auth/refresh", { method: "POST" }),
    {
      enabled: enableRefresh,
      onSuccess: () => refetch(),
    }
  );
  return {
    ...query,
    isError: isError && (!enableRefresh || refresh.isError),
    isFetched: isFetched && (refresh.isIdle || refresh.isFetched),
    isLoading: isLoading || refresh.isLoading,
  } as UseQueryResult<Data, Error>;
};

export default useQueryRequireLogin;
