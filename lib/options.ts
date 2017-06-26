import { Renderer } from './html-renderer'
import { Handler } from 'express'
import { ComponentClass, StatelessComponent } from 'react'

export interface Options {
    vendorScripts: string[]
    htmlRenderer?: Renderer
    persistDataFactory?(): any
}

export interface InternalOptions {
    rootComponent: () => (ComponentClass<any> | StatelessComponent<any>)
    env: string
    includeJSFiles: string[]
    webpackDevHmrMiddleware: Handler
}

