/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  env: {
    USER_POOL_CLIENT_ID: "1qhs0bsnkjomrua1pj3h9mdhm1",
    USER_POOL_ID: "us-east-1_Uhv1GdssE",
  },
};

export default nextConfig;
