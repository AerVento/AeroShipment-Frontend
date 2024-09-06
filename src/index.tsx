/* @refresh reload */
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Navigate, Route, Router } from "@solidjs/router";
import "./index.css";
import { StateProvider } from "./state";

const NotFound = lazy(() => import("~/pages/404"));
const Home = lazy(() => import("~/pages/Home"));
const Auth = lazy(() => import("~/pages/Auth"));
const Flights = lazy(() => import("~/pages/FlightList"));
const NewsList = lazy(() => import("~/pages/NewsList"));
const NewsDetail = lazy(() => import("~/pages/NewsDetail"));
const Order = lazy(() => import("~/pages/Order"));
const UserCenter = lazy(() => import("~/pages/UserCenter"));
const UserCenterRoutes = lazy(async () => ({
  default: (await import("~/pages/UserCenter")).UserCenterRoutes,
}));
const NewsAdmin = lazy(() => import("~/pages/NewsAdmin"));
const GoodsAdmin = lazy(() => import("~/pages/GoodsAdmin"));
const FlightAdmin = lazy(() => import("~/pages/FlightAdmin"));

const queryClient = new QueryClient();

render(
  () => (
    <StateProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Route path="/" component={() => <Navigate href="/index" />} />;
          <Route path="/404" component={NotFound} />
          <Route path="/index" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/flights" component={Flights} />
          <Route path="/news" component={NewsList} />
          <Route path="/news/detail/:id" component={NewsDetail} />
          <Route path="/order/create" component={Order} />
          <Route path="/user" component={UserCenter}>
            <UserCenterRoutes />
          </Route>
          <Route path="/news/admin" component={NewsAdmin} />
          <Route path="/goods/admin" component={GoodsAdmin} />
          <Route path="/flights/admin" component={FlightAdmin} />
        </Router>
      </QueryClientProvider>
    </StateProvider>
  ),
  document.getElementById("root")!,
);
