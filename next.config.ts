import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the exact production React dependencies with the Node build.
  output: "standalone",
  // Metadata is local and cheap. Emit it in head for every reader and preview
  // client instead of leaving asynchronous metadata in a hidden body container.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
