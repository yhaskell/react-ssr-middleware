import * as express from 'express'
import * as React from 'react'
import * as ReactDOM from 'react-dom/server'

import { InternalOptions, Options } from './options'
import { defaultRenderer } from './html-renderer'


interface ComponentRenderer {
    (component: any, location: string, persistedData: string, routes?: any): JSX.Element
}

export default function middlewareFactory(options: InternalOptions & Options) {
    const renderer = options.htmlRenderer ? options.htmlRenderer : defaultRenderer
    const getPersistedData = options.persistDataFactory ? options.persistDataFactory : () => "undefined"

    function ssr(req: express.Request, rsp: express.Response, next: express.NextFunction) {
        const persistedData = getPersistedData()

        const cRenderer: ComponentRenderer = options.withRouter ?
            require('./render-component-with-router').default :
            require('./render-component').default

        const toRender = cRenderer(options.rootComponent, req.url, persistedData, options.routes)

        const rendered = ReactDOM.renderToString(toRender)

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