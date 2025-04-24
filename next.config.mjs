/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress punycode warning and sidebar component warnings
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

export default nextConfig;
