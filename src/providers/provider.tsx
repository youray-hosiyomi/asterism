"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIConfirm_Provider } from "@youray-hosiyomi/asterism-ui-react";
import { AxiosError } from "axios";
import { FC, ReactNode } from "react";
import { ToastContainer } from "react-toastify";

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error) {
          const err = error as AxiosError;
          if (err.code && err.code == "401") {
            // refresh
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
        // refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UIConfirm_Provider>{children}</UIConfirm_Provider>
      </QueryClientProvider>
      <ToastContainer
        style={{
          zIndex: 10000,
        }}
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        stacked
      />
    </>
  );
};

export default Provider;
