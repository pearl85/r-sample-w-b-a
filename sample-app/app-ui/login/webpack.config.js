var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

const ssrCSS = new ExtractTextPlugin({ filename: 'server-bundle.[chunkhash].css', disable: false, allChunks: true });
const csrCSS = new ExtractTextPlugin({ filename: 'client-bundle.[chunkhash].css', disable: false, allChunks: true });

const path = require('path');
module.exports = [{
     entry: {
        server_bundle: './src/app/server.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server-bundle.js',
        publicPath: '/'
    },
    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: true,
        __dirname: true
    },
    plugins: [
        //new CopyWebpackPlugin([{ from: 'src/app/status.html'},
            /*new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        }),*/
        new ExtractTextPlugin({ filename: 'styles.css', disable: false, allChunks: true })
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: ["node_modules", "dist"],
            use: ['babel-loader']
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader']
            })
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules'
        ]

    }
}, {
    entry: {
        client_bundle: './src/app/client.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/assets'),
        publicPath: '/',
        filename: "[name].[chunkhash].js",
        chunkFilename: "[chunkhash].js"
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        }),
        ssrCSS,
        csrCSS,
        new ManifestPlugin(),
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'server',
            // Host that will be used in `server` mode to start HTTP server.
            analyzerHost: '127.0.0.1',
            // Port that will be used in `server` mode to start HTTP server.
            analyzerPort: 8888,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: 'report.html',
            // Automatically open report in default browser
            openAnalyzer: true,
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: false,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: 'stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
        })
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: [
                /dist/
            ],
            use: ['babel-loader']
        }, {
            test: /\.css$/,
            include: [
                path.resolve(__dirname, "node_modules/common_ui/src/app/components/header/header.css")
            ],
            use: ssrCSS.extract({
                use: ['css-loader']
            })
        }, {
            test: /\.css$/,
            exclude: [
                path.resolve(__dirname, "node_modules/common_ui/src/app/components/header/header.css")
            ],
            use: csrCSS.extract({
                use: ['css-loader']
            })
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules'
        ]
    }
}];
