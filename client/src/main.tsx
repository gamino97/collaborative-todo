import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "routes/root";
import Fallback from "components/Fallback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthOutlet } from "components/AuthOutlet";

const DemoTasks = React.lazy(() => import("routes/demo/tasks"));
const Index = React.lazy(() => import("routes/index"));
const Login = React.lazy(() => import("routes/login"));
const Register = React.lazy(() => import("routes/register"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/login"
        element={
          <React.Suspense fallback={<Fallback />}>
            <Login />
          </React.Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <React.Suspense fallback={<Fallback />}>
            <Register />
          </React.Suspense>
        }
      />
      <Route path="/" element={<Root />}>
        <Route
          index
          element={
            <React.Suspense fallback={<Fallback />}>
              <Index />
            </React.Suspense>
          }
        />
        <Route element={<AuthOutlet />}>
          <Route
            path="demo/tasks"
            element={
              <React.Suspense fallback={<Fallback />}>
                <DemoTasks />
              </React.Suspense>
            }
          />
        </Route>
      </Route>
    </>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
