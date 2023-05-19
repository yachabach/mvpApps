import { RulesEngine } from '@/composables/rulesEngine.js'
import { programLengthRules } from './programLengthRules'

export const Phoenix100Rules = () => {

    const {
        addRule,
        applyRules,
        makeNumericRule,
        makeLabelToNumericRule} = RulesEngine()

    addRule('programLength', programLengthRules()) 
    addRule('pulseWidth', makeNumericRule(20, 0, 30))
    addRule('frequency', makeNumericRule(50, 1, 300))
    addRule('currentLower', makeNumericRule(0, 0, 10))
    addRule('currentUpper', makeNumericRule(0, 0, 10))
    addRule('calibrationStart', makeNumericRule(0, 0, 10))
    addRule('calibrationStep', makeNumericRule(0, 0, 1))
    addRule('postCalibrateAmount', makeNumericRule(0, 0, 20))
    addRule('waveform', 
        makeLabelToNumericRule([['monophasic', 0], ['biphasic', 1]], 0))     
    addRule('outletPort', 
        makeLabelToNumericRule([['both', 2], ['left', 0], ['right', 1]], 2))     
    addRule('calibrationFrequency', 
        makeLabelToNumericRule([['once', 0], ['every', 1]], 0))     
    addRule('calibrateTo', 
        makeLabelToNumericRule([['perception', 0], ['discomfort', 1]], 0))     
    addRule('postCalibrateChange', 
        makeLabelToNumericRule([['no change', 0], ['increase', 1], ['decrease', 2]], 0))     
    addRule('impedanceInitiate', 
        makeLabelToNumericRule([['check', 1]], 0))     
    addRule('impedanceMonitor', 
        makeLabelToNumericRule([], 0))     
    addRule('postCalibrateChange', 
        makeLabelToNumericRule([['no change', 0], ['increase', 1], ['decrease', 2]], 0))     
    addRule('postCalibrateType', 
        makeLabelToNumericRule([['percent', 0]], 0))     

    return {
        applyRules
    }
}