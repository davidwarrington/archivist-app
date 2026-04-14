import { type RouteConfig } from "@react-router/dev/routes";
import { coreRoutes } from "./core/routes";

export default [...coreRoutes] satisfies RouteConfig;
