import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The old agency homepage. It has no search presence to protect and
      // links to eight service pages that are not served, so leaving it
      // reachable only gives crawlers and people a second, dead-ended
      // "homepage". Redirects run before the public/ filesystem check, so
      // this wins even though the file is still on disk.
      {
        source: "/colorado-home.html",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
