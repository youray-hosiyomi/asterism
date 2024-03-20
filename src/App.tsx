import { FC } from "react";
import Router from "./Router";
import AuthProvider from "./app/providers/auth.provider";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { logout } from "./app/api/auth.api";
import { ToastContainer } from "react-toastify";

const App: FC = () => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error) {
          const err = error as unknown as PostgrestError;
          if (err.code && err.code == "401") {
            // 認証できていない時のエラー処理はなしで問題ない
            logout();
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
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

export default App;
