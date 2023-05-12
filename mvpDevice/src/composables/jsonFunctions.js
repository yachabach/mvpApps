export const JsonFunctions = () => {

    const getValue = (target, obj) => {
        let res = obj[target];
        if (!res) {
            const keys = Object.keys(obj)
            keys.forEach(key =>  {
                if (!res && (typeof(obj[key])) === 'object') {
                    res = getValue(target, obj[key])
                }                    
            })
        }
        return res
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

    return {
        getValueByPath,
        getValue
    }

}