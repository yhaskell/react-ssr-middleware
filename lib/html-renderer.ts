

export type JSONData = string

export interface Renderer {
    (renderedApp: string, scripts: string[], persistData?: JSONData): string;
}

export function defaultRenderer(renderedApp: string, scripts: string[], persistData?: JSONData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root">${renderedApp}</div>
    ${persistData && `<script>window.__PERSISTED_DATA__ = ${JSON.stringify(persistData)}</script>`}
    ${scripts.map(src => `<script src="${src}"></script>`).join('\n')}
</body>
</html>
`
}
