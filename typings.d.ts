// this file was authored by lith-light-g 
// see https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit.git

// Remove those when type definitions are available
interface NodeModule {
    hot: {
        accept: (pathToRootComponent: string, callback: () => void) => void,
    };
}

interface Set<T> {
    removeAll(another: IterableIterator<T>): Set<T>
}


declare module "react-hot-loader/patch" {
    var u: any
    export default u
}