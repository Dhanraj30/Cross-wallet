import type { NextConfig } from "next";
import dotenv from "dotenv";
dotenv.config();
const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_MORALIS_API_KEY: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
  },
  
};

export default nextConfig;
