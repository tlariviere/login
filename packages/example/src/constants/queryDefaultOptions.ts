import HttpError from "../utils/HttpError";

const queryDefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    cacheTime: 0,
    retry: (failureCount: number, error: unknown): boolean =>
      !(error instanceof HttpError) && failureCount < 3,
  },
};

export default queryDefaultOptions;
