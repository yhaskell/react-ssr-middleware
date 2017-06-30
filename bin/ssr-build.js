var webpack = require('webpack')
var webpackConfig = require('../config/webpack.config').default
var ts = require('typescript')
var fs = require('fs')
var path = require('path')

function build_webpack() {
    const cfg = webpackConfig(process.env.NODE_ENV)
    webpack(cfg).run(function(err, stats) {
        if (err) {
            throw err;
        }
        console.log(stats.toString("minimal"));
    });

}

function build_typescript() {
    let tsconfig = fs.readFileSync(path.resolve(__dirname, '../tsconfig.json'), 'utf8')
    const tsConfig = ts.parseConfigFileTextToJson('../tsconfig.json', tsconfig, true).config
    const program = ts.createProgram(['./src/server.tsx'], tsConfig);
    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    allDiagnostics.forEach(diagnostic => {
        if (!!diagnostic.file && diagnostic.start) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
    });
    if (emitResult.emitSkipped) {
        throw new Error('Server compilation failed');
    } else {
        console.log('Server successfully compiled');
    }
}

function build() {
    build_webpack()
    build_typescript()
}

exports.build = build
exports.build_typescript = build_typescript
exports.build_webpack = build_webpack