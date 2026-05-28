import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://iokira.net",
    integrations: [sitemap()],
    markdown: {
        shikiConfig: {
            theme: "github-light",
        },
    },
});
