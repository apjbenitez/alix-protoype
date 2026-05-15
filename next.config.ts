import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The @alixpartners/ui-components package restricts its `exports` field to its
  // JS entry only, so deep-importing its bundled CSS (`dist/assets/main.css`)
  // requires telling Next.js to transpile the package itself.
  transpilePackages: ["@alixpartners/ui-components"],
};

export default nextConfig;
