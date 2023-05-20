export const RulesEngine = importedRules => {

    const rules = new Map(importedRules)
    const numberPattern = /^-?\d+(?:\.\d+)?$/

/**
 * 
 * @param {key, rule} 
 * @returns value
 */
    const addRule = (key, rule) => {
        rules.set(key, rule)
    }

    const applyRules = (key, value) => {
        console.log('applying rule for key: ', key)
        const rule = rules.get(key)
        return rule ?
            rule.rules.reduce((v, r) => 
                r.condition(v) ? 
                    r.trueAction(v) : 
                    r.falseAction(v), 
                    value) : value              
    }

/**
 * 
 * @param {default, min, max} ruleObj 
 * @returns value
 */
    const makeNumericRule = (def, min=0, max=Infinity) =>  {
        return {
            rules:
            [
                {
                    condition: value => numberPattern.test(value), 
                    trueAction: value => Number(value),
                    falseAction: () => def
                },
                {
                    condition: value => value <= max && value >= min,
                    trueAction: value => value,
                    falseAction: () => def
                }
            ]            
        }
    }

    const makeLabelToNumericRule = (customLabels = [], def = 0) => {

        const labels = {
            true: 1,
            on: 1,
            yes: 1,
            false: 0,
            off: 0,
            no: 0
        }

        customLabels.forEach(label => 
            labels[label[0]] = label[1])

        return {
            rules: [
                {
                    condition: value => numberPattern.test(value), 
                    trueAction: value => Number(value),
                    falseAction: value => labels[value] ? labels[value] : def
                },
                {
                    condition: value => Object.values(labels).includes(value),
                    trueAction: value => value,
                    falseAction: () => def
                },
            ]  
        } 
    }

    return Object.freeze({
        addRule,
        applyRules,
        makeNumericRule,
        makeLabelToNumericRule
    })
}