import * as express from 'express'
import * as React from 'react'

import { InternalOptions, Options } from './options'
import { defaultRenderer } from './html-renderer'


interface ComponentRenderer {
    (component: any, location: string, persistedData: string, routes?: any): {
        redirect?: string
        contents: string
    }
}

export default function middlewareFactory(options: InternalOptions & Options) {
    const renderer = options.htmlRenderer ? options.htmlRenderer : defaultRenderer
    const cRenderer: ComponentRenderer = 
                require(options.withRouter ? './render-component-with-router' : './render-component').default

    return function middleware(req: express.Request, rsp: express.Response, next: express.NextFunction) {
        function ssr() {
            const persistedData = options.persistDataFactory()

            const rendered = cRenderer(options.rootComponent, req.url, persistedData, options.routes)

            if (rendered.redirect)
                return rsp.redirect(rendered.redirect)
            
            const html = renderer(rendered.contents, options.includeJSFiles, persistedData)

            rsp.send(html)
        }

        if (options.env === "production")
            express.static("dist/static")(req, rsp, ssr)
        else
            options.webpackDevHmrMiddleware(req, rsp, ssr)
    }
}