import { relative, type RouteConfig } from "@react-router/dev/routes";

const { index } = relative("src/core/routes");

export const coreRoutes = [index("home.tsx")] satisfies RouteConfig;
