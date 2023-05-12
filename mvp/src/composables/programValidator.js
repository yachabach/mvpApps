import phoenix100 from '@/defaultConfigs/phoenix100.json'
import { JsonFunctions } from './jsonFunctions';

export const ProgramValidator = () => {

    const { deepHasKey } = JsonFunctions()

    const validProgram = programObject => 
        Object.keys(phoenix100.parameterCodes).reduce(
            (res, key) => res && deepHasKey(programObject, key), true)

    return Object.freeze({
        validProgram
    })
}