// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'],
    },
    experimental: {
      optimizeCss: true
    },
  };
  
 export default nextConfig;
  