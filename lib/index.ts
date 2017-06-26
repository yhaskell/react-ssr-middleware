import * as express from 'express'
import * as React from 'react'
import * as ReactDOM from 'react-dom/server'

import * as watcher from './watch-for-root-component'

import webpackDevHmrMiddlewareFactory from './webpack-dev-hmr'
import middlewareFactory from './middleware-factory'
import { defaultRenderer, JSONData, Renderer } from './html-renderer'
import { InternalOptions, Options } from './options'


function factory(rootComponentPath: string, opts?: Partial<Options>) {
    opts = opts || {}
    opts.vendorScripts = opts.vendorScripts || []

    const env = process.env.NODE_ENV
    const rootComponent = watcher.watch(rootComponentPath, (updated) => options.rootComponent = updated)
    const defaultScripts = ["react", "react-dom", "react-hot-loader"]
    const vendorScripts = Array.from(new Set([...defaultScripts, ...opts.vendorScripts]))
    const includeJSFiles = env === 'production' ?
            ['common.js', 'vendor.js', 'main.js'] : 
            ['common.js', 'vendor.js', 'hot.js', 'main.js']

    const webpackDevHmrMiddleware = webpackDevHmrMiddlewareFactory(env, vendorScripts)

    let options: InternalOptions & Options = {
        rootComponent, 
        env,
        webpackDevHmrMiddleware, 
        includeJSFiles,
        ...opts,
        vendorScripts,
    }
    return middlewareFactory(options)
}

namespace factory {}

export = factory