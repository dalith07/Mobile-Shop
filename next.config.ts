import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh", // ✅ allow all subdomains
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ufs.sh", // ✅ just in case the root domain is used
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com", // add this
        pathname: "/**",
      },
      // if your API returns from more domains, add them here
    ],
  },
};

export default nextConfig;
