#!/usr/bin/env node

const target = process.argv[2]

if (process.argv.length != 3) {
    console.error("Incorrect argument count.")
    process.exit(1)
}

const buildHandlers = require('./ssr-build')

const handlers = {
    "build":            buildHandlers.build,
    "build:ts":         buildHandlers.build_typescript,
    "build:webpack":    buildHandlers.build_webpack
}

if (!handlers[target]) {
    console.error("Invalid target.")
    console.error("Valid targets are:")
    console.error("\t", Object.keys(handlers).join(" "))

    process.exit(1)
}

handlers[target]()
