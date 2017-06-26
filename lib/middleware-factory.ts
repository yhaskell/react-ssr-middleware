import * as express from 'express'
import * as React from 'react'
import * as ReactDOM from 'react-dom/server'

import { InternalOptions, Options } from './options'
import { defaultRenderer } from './html-renderer'

export default function middlewareFactory(options: InternalOptions & Options) {
    const renderer = options.htmlRenderer ? options.htmlRenderer : defaultRenderer
    const getPersistedData = options.persistDataFactory ? options.persistDataFactory : () => "undefined"

    function ssr(req: express.Request, rsp: express.Response, next: express.NextFunction) {
        const persistedData = getPersistedData()

        const rendered = ReactDOM.renderToString(React.createElement(<any>options.rootComponent, { persistedData }, null))

        const html = renderer(rendered, options.includeJSFiles, persistedData)

        rsp.send(html)
    }
    return function middleware(req: express.Request, rsp: express.Response, next: express.NextFunction) {
        if (options.env === "production")
            express.static("dist/static")(req, rsp, () => ssr(req, rsp, next))
        else 
            options.webpackDevHmrMiddleware(req, rsp, () => ssr(req, rsp, next))
    }
}