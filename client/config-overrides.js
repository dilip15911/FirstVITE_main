const { override } = require('customize-cra');

module.exports = override(
    (config) => {
        // Modify chunk naming to be more predictable
        config.optimization.splitChunks = {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        };

        // Add proper chunk naming
        config.output.chunkFilename = 'static/js/[name].chunk.js';
        config.output.filename = 'static/js/[name].js';

        return config;
    }
);
