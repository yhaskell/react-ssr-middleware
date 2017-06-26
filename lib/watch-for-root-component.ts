import * as fs from 'fs'


const requireCacheSet = () => new Set<string>(Object.keys(require.cache).filter(u => !u.match("node_modules")))


Set.prototype.removeAll = function<T>(values: IterableIterator<T>): Set<T> {
    for (let next = values.next(); next.done != true; next = values.next())
        this.delete(next.value)

    return this
}

export function watch(filename: string, onChange: (component: any) => void) {
    const preCache = requireCacheSet()
    const required = require(filename).default
    const newCache = requireCacheSet()

    const cache = Array.from(newCache.removeAll(preCache.values()))

    fs.watchFile(filename, (curr, prev) => {
        for (var reqId of cache)
            delete require.cache[reqId]
        
        onChange(require(filename).default)
    })

    return required
}