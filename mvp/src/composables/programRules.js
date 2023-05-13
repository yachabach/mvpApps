
export const Rules = () => {

    const keyRules = {
        "default": () => 0,
        "frequency": () => 50,
        "pulseWidth": () => 200,
        "waveform": value => {
            const values = {
                "default": 0,
                "off": 0,
                "false": 0,
                "monophasic": 0,
                "on": 1,
                "biphasic": 1,
                "true": 1                
            }
            return values[value] ? values[value] : values.default
        },
        "outletPort": value => {
            const values = {
                "default": 2,
                "both": 2,
                "left": 0,
                "right": 1
            }
            return values[value] ? values[value] : values.default
        },
        "programLength":{
            "default": 120
        },    
        "currentLower":{
            "default": 0
        },    
        "currentUpper":{
            "default": 10
        },    
        "calibrationFrequency":{
            "default": 0,
            "once": 0,
            "every use": 1
        },    
        "calibrationStart":{
            "default": 2
        },    
        "calibrationStep":{
            "default": 0.5
        },    
        "calibrateTo":{
            "default": 0,
            "perception": 0,
            "discomfort": 1
        },    
        "postCalibrateChange":{
            "default": 0,
            "no change": 0,
            "increase": 1,
            "decrease": 2
        },
        "postCalibrateType":{
            "default": 0,
            "perception": 0
        },
        "postCalibrateAmount":{
            "default": 2
        },
        "impedanceInitiate":{
            "default": 0,
            "check": 1,
            "true": 1,
            "false": 0
        },
        "impedanceMonitor":{
            "default": 0,
            "true": 1,
            "false": 0
        }
    }
    return Object.freeze({keyRules})
}