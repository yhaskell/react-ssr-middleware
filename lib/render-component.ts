import * as React from 'react'
import * as ReactDOM from 'react-dom/server'

export default (component: any, location: string, persistedData: string) => {
    const elem = React.createElement(component, { persistedData }, null)
    return {
        contents: ReactDOM.renderToString(elem)
    }
}

