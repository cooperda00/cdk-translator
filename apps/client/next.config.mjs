/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  env: {
    USER_POOL_CLIENT_ID: "3qp8lcq3jpqi949l74k6phsqhs",
    USER_POOL_ID: "us-east-1_fhwQY4Tg6",
  },
  transpilePackages: ["@cdk-translator/types"],
};

export default nextConfig;
