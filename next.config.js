/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    newNextLinkBehavior: true,
    nextScriptWorkers: true,
    scrollRestoration: true,
    images: {
      allowFutureImage: true,
    },
  },
  images: {
    domains: [
      'dummyimage.com',
      'thankly.azureedge.net',
      'images.unsplash.com',
      'thankly.azurewebsites.net',
      'thankly-cms.fly.dev',
      'lh3.googleusercontent.com', // for google user profiles
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
