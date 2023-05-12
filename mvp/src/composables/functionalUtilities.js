export const  FunctionalUtilites = () => {

    const partialCurry = (fn, len = fn.length) => {
        const intermediateFunction = (...args1) => (...args2) => {
            const allParams = [...args1, ...args2];
            return (allParams.length < len ? intermediateFunction : fn)(...allParams)
        }
        return intermediateFunction()
    }

    return Object.freeze({
        partialCurry
    })
}