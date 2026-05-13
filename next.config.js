/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });

    return config;
  },

  experimental: {
    turbo: {
      rules: {
        '*.glb': {
          loaders: ['file-loader'],
          as: '*.js',
        },
        '*.gltf': {
          loaders: ['file-loader'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = nextConfig;
