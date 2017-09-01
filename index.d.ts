
declare module "react-ssr-middleware" {

    type JSONData = string

    interface Renderer {
        (renderedApp: string, scripts: string[], persistData?: JSONData): string;
    }

    import { Handler } from 'express'

    interface Options {
        vendorScripts: string[]
        htmlRenderer?: Renderer
        persistDataFactory?(): any
        withRouter?: string
    }



    function factory(rootComponent: string, opts?: Partial<Options>) : Handler

    namespace factory {

    }


    export = factory
}

interface NodeModule {
    hot: {
        accept: (pathToRootComponent: string, callback: () => void) => void,
    };
}

interface Window {
    __PERSISTED_DATA__: any
}