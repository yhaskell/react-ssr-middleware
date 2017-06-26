import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { RouteConfig, matchRoutes, renderRoutes } from 'react-router-config'



export default (component: any, location: string, persistedData: string, routes: RouteConfig[]) => {
    const matched = matchRoutes(routes, location)
    const context: { url?: string } = {};
    const routesElement = React.createElement(component, { persistedData }, renderRoutes(routes))
    const rendered = React.createElement(
        StaticRouter, 
        { location, context },
        routesElement
    )
    renderToString(rendered)
    return context.url || rendered
}

