import * as express from 'express'
import * as React from 'react'
import * as ReactDOM from 'react-dom/server'
import * as path from 'path'

import * as watcher from './watch-for-root-component'

import webpackDevHmrMiddlewareFactory from './webpack-dev-middleware'
import middlewareFactory from './middleware-factory'
import { defaultRenderer, JSONData, Renderer } from './html-renderer'
import { InternalOptions, Options } from './options'

function factory(rootComponentPath: string, opts?: Partial<Options>) {
    opts = opts || {}
    if (module.parent) { // actually this will always be true
        const fromDirname = path.dirname(module.parent.filename)

        if (!path.isAbsolute(rootComponentPath))
            rootComponentPath = path.resolve(fromDirname, rootComponentPath)
        if (opts.withRouter && !path.isAbsolute(opts.withRouter)) opts.withRouter = path.resolve(fromDirname, opts.withRouter)
    }
    opts.vendorScripts = opts.vendorScripts || []

    const env = process.env.NODE_ENV
    const rootComponent = watcher.watch(rootComponentPath, (updated) => options.rootComponent = updated)
    const routes = !!opts.withRouter ? watcher.watch(opts.withRouter, (updated) => options.routes = updated) : undefined
    let defaultScripts = ["react", "react-dom", "react-hot-loader"]
    if (!!opts.withRouter) defaultScripts.push("react-router-dom")
    const vendorScripts = Array.from(new Set([...defaultScripts, ...opts.vendorScripts]))
    const includeJSFiles = env === 'production' ?
            ['common.js', 'vendor.js', 'main.js'] : 
            ['common.js', 'vendor.js', 'hot.js', 'main.js']

    const webpackDevHmrMiddleware = webpackDevHmrMiddlewareFactory(env, vendorScripts)

    const persistDataFactory = opts.persistDataFactory || (() => "undefined")
    
    let options: InternalOptions & Options = {
        rootComponent, 
        routes,
        env,
        webpackDevHmrMiddleware, 
        includeJSFiles,
        ...opts,
        vendorScripts,
        persistDataFactory,
    }
    return middlewareFactory(options)
}

namespace factory {}

export = factory
