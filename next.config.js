/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // إضافة دعم ملفات ONNX
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false
    };

    // إضافة دعم WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true
    };

    // تكوين معالجة ملفات ONNX و WASM
    config.module.rules.push(
      {
        test: /\.onnx$/,
        type: 'asset/resource'
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource'
      }
    );

    return config;
  },
  // تكوين الوسائط الثابتة
  images: {
    domains: ['localhost'],
  },
  // تكوين CORS وسياسات الأمان
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
