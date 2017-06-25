import * as express from 'express'
import * as webpack from 'webpack'
import { Configuration } from 'webpack'
import * as webpackDevMiddlewareFactory from 'webpack-dev-middleware'
import * as webpackHotMiddlewareFactory from 'webpack-hot-middleware'


import webpackConfig from './webpack.config'

export default function (env: string, vendorScripts: string[]) {
    const config = webpackConfig(env, vendorScripts)
    const compiler = webpack(config)
    const publicPath = <string>(<any>config).output.publicPath

    const webpackDevMiddleware = webpackDevMiddlewareFactory(compiler, {
            index: 'index.html',
            publicPath,
            //quiet: true,
            stats: {
                
                colors: true,
            },
        })
    const webpackHotMiddleware = webpackHotMiddlewareFactory(compiler)

    return function(req: express.Request, rsp: express.Response, next: express.NextFunction) {
        webpackDevMiddleware(req, rsp, () => webpackHotMiddleware(req, rsp, next))
    }
}
