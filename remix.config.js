/** @type {import('@remix-run/dev').AppConfig} */
/** @type {import('@remix-pwa/dev').WorkerConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  tailwind: true,
  serverDependenciesToBundle: ["@remix-pwa/sw"]
};
