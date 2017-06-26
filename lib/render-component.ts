import * as React from 'react'

export default (component: any, location: string, persistedData: string) => 
    React.createElement(component, { persistedData }, null)

