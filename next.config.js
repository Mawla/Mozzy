/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress punycode warning
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
      // Ignore sidebar component import warnings
      { message: /SidebarGroup/ },
      { message: /SidebarGroupContent/ },
      { message: /SidebarMenu/ },
      { message: /SidebarMenuItem/ },
      { message: /SidebarMenuButton/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
