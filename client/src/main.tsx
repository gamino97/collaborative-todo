import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthOutlet } from "components/AuthOutlet";
import Fallback from "components/Fallback";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "routes/root";

const DemoTasks = React.lazy(() => import("routes/demo/tasks"));
const Index = React.lazy(() => import("routes/index"));
const Login = React.lazy(() => import("routes/login"));
const Register = React.lazy(() => import("routes/register"));
const NetworkTasks = React.lazy(() => import("routes/tasks"));
const NetworkTeams = React.lazy(() => import("routes/teams"));
const NetworkTabsOutlet = React.lazy(
  () => import("components/NetworkTabsOutlet")
);
const ForgotPassword = React.lazy(() => import("routes/forgot-password"));
const ResetPasswordToken = React.lazy(
  () => import("routes/reset-password-token")
);

function MyAuthOutlet() {
  return (
    <React.Suspense fallback={<Fallback />}>
      <AuthOutlet />
    </React.Suspense>
  );
}

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
      <Route
        path="/forgot-password"
        element={
          <React.Suspense fallback={<Fallback />}>
            <ForgotPassword />
          </React.Suspense>
        }
      />
      <Route
        path="/reset-password-token/:token"
        element={
          <React.Suspense fallback={<Fallback />}>
            <ResetPasswordToken />
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
        <Route
          path="demo/tasks"
          element={
            <React.Suspense fallback={<Fallback />}>
              <DemoTasks />
            </React.Suspense>
          }
        />
        <Route element={<MyAuthOutlet />}>
          <Route
            path="/"
            element={
              <React.Suspense fallback={<Fallback />}>
                <NetworkTabsOutlet />
              </React.Suspense>
            }
          >
            <Route
              path="tasks"
              element={
                <React.Suspense fallback={<Fallback />}>
                  <NetworkTasks />
                </React.Suspense>
              }
            />
            <Route
              path="teams"
              element={
                <React.Suspense fallback={<Fallback />}>
                  <NetworkTeams />
                </React.Suspense>
              }
            />
          </Route>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
