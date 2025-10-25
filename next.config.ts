/**
 * @type {import('next').NextConfig}
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// These are not available in modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is required for Next.js to be aware of the .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
