import { Renderer } from './html-renderer'
import { Handler } from 'express'
import { ComponentClass, StatelessComponent } from 'react'
import { RouteConfig } from 'react-router-config'

export interface Options {
    htmlRenderer?: Renderer
    persistDataFactory(): any
    withRouter?: string
}

export interface InternalOptions {
    rootComponent: () => (ComponentClass<any> | StatelessComponent<any>)
    routes?: RouteConfig[]
    env: string
    includeJSFiles: string[]
    webpackDevHmrMiddleware: Handler
}

