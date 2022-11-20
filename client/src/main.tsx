import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Root from "routes/root";
import Fallback from "components/Fallback";

const DemoTasks = React.lazy(() => import("routes/demo/tasks"));
const Index = React.lazy(() => import("routes/index"));

const router = createBrowserRouter(
  createRoutesFromElements(
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
      ></Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
