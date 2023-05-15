import phoenix100 from '@/defaultConfigs/phoenix100.json'
import { JsonFunctions } from './jsonFunctions';
import programKeywords from '@/defaultConfigs/programElementRequirements.json';

export const ProgramValidator = () => {

    const { deepHasKey, getValue } = JsonFunctions()

    const requiredKeys = programKeywords.concat(Object.keys(phoenix100.parameterCodes))

    const hasAllKeys = programObject => 
        requiredKeys.every(key => deepHasKey(programObject, key))

    const requiredFields = (obj) => 
        requiredKeys.reduce((res, key) =>{
            res[key] = getValue(obj, key)
            return res
        }, {})

    return Object.freeze({
        requiredFields,
        hasAllKeys
    })
}