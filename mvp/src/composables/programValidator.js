import phoenix100 from '@/defaultConfigs/phoenix100.json'
import { JsonFunctions } from './jsonFunctions';
import programKeywords from '@/defaultConfigs/programElementRequirements.json';

export const ProgramValidator = () => {

    const { deepHasKey, getValue } = JsonFunctions()

    const requiredKeys = programKeywords.concat(Object.keys(phoenix100.parameterCodes))

    const validProgram = programObject => 
        requiredKeys.reduce(
            (res, key) => res && deepHasKey(programObject, key), true)

    const requiredFields = (obj, keyList) => {
        let res = {}
        keyList.forEach( key => {
            res[key] = getValue(obj, key)
        })
        return res
    }

    return Object.freeze({
        requiredFields,
        requiredKeys,
        validProgram
    })
}