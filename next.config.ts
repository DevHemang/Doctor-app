// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["randomuser.me", "images.pexels.com"], // add all external domains you use here
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://practo-clone-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;

