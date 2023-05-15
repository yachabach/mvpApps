export const JsonFunctions = () => {

    const getValue = (obj, target) => {
        const keyList = Object.keys(obj)
        return keyList.includes(target) ?
            obj[target] : 
            keyList.reduce((a, k) => 
                (typeof(a) == 'undefined' && typeof(obj[k]) == 'object') ?
                    getValue(obj[k], target) : a,
                undefined)        
   }

    const deepHasKey = (obj, key) => {
        if (typeof(obj) !== 'object') {
            return false
        } else {
            const keys = Object.keys(obj)
            if (keys.includes(key)) {
                return true
            } else {
                return keys.reduce((h,k) => h || deepHasKey(obj[k], key), false)            
            }            
        }
    }

    return {
        getValue,
        deepHasKey,
    }

}