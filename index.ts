import * as express from 'express'
import * as fs from 'fs'
import * as React from 'react'
import * as ReactDOM from 'react-dom/server'

import webpackDevHmrMiddlewareFactory from './webpack-dev-hmr'

interface Options {
    vendorScripts: string[]
}

var options: {
    rootComponent: () => (React.ComponentClass<any> | React.StatelessComponent<any>)
    env: string
    scripts: string[]
} & Options

let webpackDevHmrMiddleware: express.Handler


const genPage = (renderedApp: string, scripts: string[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root">${renderedApp}</div>
    ${scripts.map(src => `<script src="${src}"></script>`).join('\n')}
</body>
</html>
`



function middleware(req: express.Request, rsp: express.Response, next: express.NextFunction) {
    function ssr() {
        rsp.status(200)
        const rendered = ReactDOM.renderToString(React.createElement(<any>options.rootComponent, {}, null))
        const html = genPage(rendered, options.scripts)
        rsp.send(html)
    }
    
    if (options.env === "production")
        express.static("dist/static")(req, rsp, ssr)
    else {
        webpackDevHmrMiddleware(req, rsp, ssr)
    }
}

function watch(filename: string) {
    const preCache = new Set<string>(Object.keys(require.cache).filter(u => !u.match("node_modules")))
    const required = require(filename).default
    const newCache = new Set<string>(Object.keys(require.cache).filter(u => !u.match("node_modules")))
    for (var cached of Array.from(preCache.values())) newCache.delete(cached)

    const cache = Array.from(newCache.values())

    fs.watchFile(filename, (curr, prev) => {
        const rc = options.rootComponent
        delete options.rootComponent
        for (var reqId of cache) {
            console.log('deleting cache for module: ', reqId);
            delete require.cache[reqId]
        }
        options.rootComponent = require(filename).default
    })

    return required
}




function factory(rootComponent: string, opts?: Partial<Options>) {
    opts = opts || {}
    const env = process.env.NODE_ENV
    const rc = watch(rootComponent)
    options = { 
        rootComponent: rc, 
        env,
        vendorScripts: opts.vendorScripts || ["react", "react-dom", "react-hot-loader"],
        scripts: env === 'production' ?
            ['common.js', 'vendor.js', 'main.js'] : ['common.js', 'vendor.js', 'hot.js', 'main.js']
    }
    webpackDevHmrMiddleware = webpackDevHmrMiddlewareFactory(options.env, options.vendorScripts)
    return middleware
}

namespace factory {}

export = factory