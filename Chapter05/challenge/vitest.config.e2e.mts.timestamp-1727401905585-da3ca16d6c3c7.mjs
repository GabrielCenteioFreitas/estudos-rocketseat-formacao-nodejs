// vitest.config.e2e.mts
import swc from "file:///E:/GABRIEL/Win10/Desktop/Programacao/Node/Rocketseat-Ignite/Chapter05/challenge/node_modules/.pnpm/unplugin-swc@1.5.1_@swc+core@1.7.26_rollup@4.22.4_webpack-sources@3.2.3/node_modules/unplugin-swc/dist/index.js";
import { defineConfig } from "file:///E:/GABRIEL/Win10/Desktop/Programacao/Node/Rocketseat-Ignite/Chapter05/challenge/node_modules/.pnpm/vitest@2.1.1_@types+node@20.16.6_terser@5.33.0/node_modules/vitest/dist/config.js";
import tsConfigPaths from "file:///E:/GABRIEL/Win10/Desktop/Programacao/Node/Rocketseat-Ignite/Chapter05/challenge/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.6.2_vite@5.4.7_@types+node@20.16.6_terser@5.33.0_/node_modules/vite-tsconfig-paths/dist/index.js";
var vitest_config_e2e_default = defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"]
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" }
    })
  ]
});
export {
  vitest_config_e2e_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5lMmUubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcR0FCUklFTFxcXFxXaW4xMFxcXFxEZXNrdG9wXFxcXFByb2dyYW1hY2FvXFxcXE5vZGVcXFxcUm9ja2V0c2VhdC1JZ25pdGVcXFxcQ2hhcHRlcjA1XFxcXGNoYWxsZW5nZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcR0FCUklFTFxcXFxXaW4xMFxcXFxEZXNrdG9wXFxcXFByb2dyYW1hY2FvXFxcXE5vZGVcXFxcUm9ja2V0c2VhdC1JZ25pdGVcXFxcQ2hhcHRlcjA1XFxcXGNoYWxsZW5nZVxcXFx2aXRlc3QuY29uZmlnLmUyZS5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0dBQlJJRUwvV2luMTAvRGVza3RvcC9Qcm9ncmFtYWNhby9Ob2RlL1JvY2tldHNlYXQtSWduaXRlL0NoYXB0ZXIwNS9jaGFsbGVuZ2Uvdml0ZXN0LmNvbmZpZy5lMmUubXRzXCI7aW1wb3J0IHN3YyBmcm9tICd1bnBsdWdpbi1zd2MnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXHJcbmltcG9ydCB0c0NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHRlc3Q6IHtcclxuICAgIGluY2x1ZGU6IFsnKiovKi5lMmUtc3BlYy50cyddLFxyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIHJvb3Q6ICcuLycsXHJcbiAgICBzZXR1cEZpbGVzOiBbJy4vdGVzdC9zZXR1cC1lMmUudHMnXVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdHNDb25maWdQYXRocygpLFxyXG4gICAgc3djLnZpdGUoe1xyXG4gICAgICBtb2R1bGU6IHsgdHlwZTogJ2VzNicgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErYixPQUFPLFNBQVM7QUFDL2MsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyw0QkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLGtCQUFrQjtBQUFBLElBQzVCLFNBQVM7QUFBQSxJQUNULE1BQU07QUFBQSxJQUNOLFlBQVksQ0FBQyxxQkFBcUI7QUFBQSxFQUNwQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsSUFBSSxLQUFLO0FBQUEsTUFDUCxRQUFRLEVBQUUsTUFBTSxNQUFNO0FBQUEsSUFDeEIsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
