import phoenix100 from '@/defaultConfigs/phoenix100.json'
import { JsonFunctions } from './jsonFunctions';
import programKeywords from '@/defaultConfigs/programElementRequirements.json';

export const ProgramValidator = () => {

    const { deepHasKey, getValue } = JsonFunctions()

    const requiredKeys = programKeywords.concat(Object.keys(phoenix100.parameterCodes))

    const hasAllKeys = programObject => 
        requiredKeys.every(key => deepHasKey(programObject, key))

    const flattenProgram = (obj) => 
        requiredKeys.reduce((res, key) =>{
            res[key] = getValue(obj, key)
            return res
        }, {})

    // const fieldsVerified = () => {}

    // const applyAllRules = program => {}

    return Object.freeze({
        requiredKeys,
        flattenProgram,
        hasAllKeys
    })
}