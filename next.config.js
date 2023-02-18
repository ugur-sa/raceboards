/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.discordapp.com',
      'www.seekpng.com',
      'upload.wikimedia.org',
      'cdn.countryflags.com',
      'raw.githubusercontent.com',
      'www.formula1.com',
    ],
  },
};

module.exports = nextConfig;
