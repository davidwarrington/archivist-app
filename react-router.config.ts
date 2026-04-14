import type { Config } from "@react-router/dev/config";

export default defineConfig({
  appDirectory: "src",
  buildDirectory: "dist",
});

function defineConfig(config: Config) {
  return config;
}
