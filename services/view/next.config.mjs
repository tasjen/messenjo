/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.HOST],
    },
    staleTimes: {
      dynamic: 1800, // 30 min
    },
  },
};

export default nextConfig;
