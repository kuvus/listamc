/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true, // TODO: Remove after next-auth fix
    },
}

module.exports = nextConfig
