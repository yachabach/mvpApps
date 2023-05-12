export const JsonFunctions = () => {

    const getValue = (obj, target) => {
        const keyList = Object.keys(obj)
        return keyList.includes(target) ?
            obj[target] : keyList.reduce((a, k) => 
                (typeof(a) == 'undefined' && typeof(obj[k]) == 'object') ?
                    getValue(obj[k], target) : a,
                undefined)        
   }

    const getValueByPath = (path, obj) => {
        let res = obj
        if (obj && path) {
            const keys = path.split('.')
            keys.forEach(key => {
                if (res) { 
                    res = res[key] 
                }
            })
        }
        return res
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

    const keysToObject = (valueSource, keys) => {
        const res = {}
        keys.forEach(key => res[key] = getValue(valueSource, key))
        return (Object.freeze(res))
    }

    return {
        getValueByPath,
        getValue,
        deepHasKey,
        keysToObject
    }

}