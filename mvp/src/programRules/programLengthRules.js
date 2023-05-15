export const programLengthRules = () => {
    const def = 1800    //default of 1800 seconds (30 minutes)

    const timePattern = /^[0-9:]+$/

    const parseTime = value => value.split(':').reverse().
        reduce((time, element, i) => time + element * 60**i, 0)
    
    const max = 12 * 60 * 60;

    return {
        rules: [
            {
                condition: value => timePattern.test(value),
                trueAction: value => parseTime(value),
                falseAction: () => def
            },
            {
                condition: value => value <= max,
                trueAction: value => value,
                falseAction: () => def
            }
        ]  
    }      
}