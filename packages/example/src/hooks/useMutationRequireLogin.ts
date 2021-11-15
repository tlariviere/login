import type {
  MutationKey,
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "react-query";
import type { Optional } from "@tlariviere/utils";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";

import { fetchData } from "../utils/fetchHelpers";
import HttpError from "../utils/HttpError";

const useMutationRequireLogin = <
  Data = unknown,
  Variables = void,
  Context = unknown
>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<Data, Variables>,
  options?: Omit<
    UseMutationOptions<Data, Error, Variables, Context>,
    "mutationKey" | "mutationFn"
  >
): UseMutationResult<Data, Error, Variables, Context> => {
  const [mutateVariables, setMutateVariables] =
    useState<Optional<Variables>>(null);
  const { onMutate } = options ?? {};
  const mutation = useMutation(mutationKey, mutationFn, {
    ...options,
    onMutate: (variables) => {
      setMutateVariables(variables);
      return onMutate ? onMutate(variables) : undefined;
    },
  });
  const { isLoading, isError, error, mutate } = mutation;
  const enableRefresh = error instanceof HttpError && error.statusCode === 401;
  const refresh = useQuery(
    ["refreshToken", mutationKey],
    async () => fetchData("/api/auth/refresh", { method: "POST" }),
    {
      enabled: enableRefresh,
      onSuccess: () => mutate(mutateVariables as Variables),
    }
  );
  return {
    ...mutation,
    isError: isError && (!enableRefresh || refresh.isError),
    isLoading: isLoading || refresh.isLoading,
  } as UseMutationResult<Data, Error, Variables, Context>;
};

export default useMutationRequireLogin;
