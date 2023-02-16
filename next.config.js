/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.discordapp.com',
      'www.seekpng.com',
      'upload.wikimedia.org',
      'cdn.countryflags.com',
    ],
  },
};

module.exports = nextConfig;
