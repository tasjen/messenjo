/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.HOST ?? "localhost:3000"],
    },
    staleTimes: {
      dynamic: 1800, // 30 min
    },
  },
};

export default nextConfig;
