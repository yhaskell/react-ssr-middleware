// this file was authored by lith-light-g 
// see https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit.git

import { resolve } from 'path'
import {
    Configuration,
    optimize,
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
    Entry,
    DefinePlugin,
    Plugin,
    LoaderOptionsPlugin,
    Rule,
} from 'webpack'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'

export default (env: string, vendorScripts: string[]): Configuration => {
    let entry: Entry = {
        main: './src/index.tsx',
        vendor: vendorScripts,
    }
    // add hot module replacement if not in production
    entry = env !== 'production' ? {
        hot: ['react-hot-loader/patch', 'webpack-hot-middleware/client'],
        ...entry,
    } : entry
    // set devtool according to the environment
    const devtool = env === 'production' ? 'source-map' : 'eval-source-map'
    let plugins: Plugin[] = [ new optimize.CommonsChunkPlugin({
        names: ['vendor', 'common'],
    }), new ExtractTextPlugin('styles.css')]
    
    // set plugins hot module replacement plugins if not in production
    plugins = env === 'production' ? [
        ...plugins,
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false,
            },
            sourceMap: true,
        }),
    ] : [
            ...plugins,
            new HotModuleReplacementPlugin(),
            new NamedModulesPlugin(),
        ]
    const cssRule: Rule = {
        test: /\.css$/,
        use: env === 'production' ?
            ExtractTextPlugin.extract(['css-loader', 'postcss-loader']) :
            ['style-loader', 'css-loader', 'postcss-loader'],
    }

    const appNodeModules = resolve(process.cwd(), "node_modules")

    return {
        entry,
        stats: {
            errorDetails: true,

        },
        output: {
            filename: '[name].js',
            path: resolve(process.cwd(), 'dist', 'static'),
            publicPath: '/',
        },
        devtool,
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css'],
            modules: ['node_modules', resolve(__dirname, "..", "node_modules")]
        },
        resolveLoader: {
            modules: ["node_modules", resolve(__dirname, "..", "node_modules")]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        "react-hot-loader/webpack",
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: resolve(__dirname, "..", "tsconfig.json")
                            }
                        }
                    ],
                    exclude: /node_modules/,
                },
                cssRule,
            ],
        },
        plugins,
    }
}