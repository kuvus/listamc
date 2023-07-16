/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    typescript: {
        ignoreBuildErrors: true, // TODO: Remove after next-auth fix
    },
}

module.exports = nextConfig
