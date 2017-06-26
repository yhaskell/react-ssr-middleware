import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { RouteConfig, matchRoutes, renderRoutes } from 'react-router-config'


export default (component: any, location: string, persistedData: string, routes: RouteConfig[]) => {
    const matched = matchRoutes(routes, location)
    const context: { url?: string } = {};
    const routesElement = React.createElement(component, { persistedData }, renderRoutes(routes))
    return React.createElement(
        StaticRouter, 
        { location, context },
        routesElement
    )
}

