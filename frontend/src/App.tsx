import { Suspense, useState } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";
import Routes from "./components/routers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "./components/ui/sonner";
import { Icons } from "./components/ui/icons";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <Icons.spinner className="h-20 w-20 animate-spin" />
              </div>
            }
          >
            <Routes />
            <Toaster position="top-right" richColors expand={true} />
          </Suspense>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
