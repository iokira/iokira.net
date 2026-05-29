import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const fontDisplayOptional = Object.assign(
    () => ({
        postcssPlugin: "font-display-optional",
        AtRule: {
            "font-face": (rule: any) => {
                rule.walkDecls("font-display", (decl: any) => {
                    if (decl.value === "swap") decl.value = "optional";
                });
            },
        },
    }),
    { postcss: true },
);

export default defineConfig({
    site: "https://iokira.net",
    integrations: [sitemap()],
    markdown: {
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
        },
    },
    vite: {
        css: {
            postcss: {
                plugins: [fontDisplayOptional()],
            },
        },
    },
});
