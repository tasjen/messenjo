import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          gcTime: Infinity,
          // enabled: false,
        },
      },
    })
);
export default getQueryClient;
