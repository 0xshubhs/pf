/** @type {import('next').NextConfig} */
const nextConfig = {
  // The `fs: false` webpack/turbopack fallbacks here only existed to keep
  // three.js's node polyfills out of the browser bundle. Nothing pulls them now.
}

export default nextConfig
