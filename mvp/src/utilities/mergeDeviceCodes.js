import programRules from '../data/programRules.json' 

export const MergeDeviceCodes = () => {

    const programCodes = {
        frequency: 0x47,
        pulseWidth: 0x48,
        waveform: 0x49,
        outletPort: 0x4A,
        programLength: 0x4B,
        currentLower: 0x4D,
        currentUpper: 0x4E,
        calibrationFrequency: 0x4F,
        calibrationStart: 0x50,
        calibrationStep: 0x51,
        calibrateTo: 0x53,
        postCalibrateChange: 0x54,
        postCalibrateType: 0x55,
        postCalibrateAmount: 0x56,            
        impedanceInitiate: 0x63,
        impedanceMonitor: 0x64,
    }

    const parameterDataPath = {
        frequency: 'stimulation.frequency',
        pulseWidth: 'stimulation.pulseWidth',
        waveform: 'stimulation.waveform',
        outletPort: 'outletPort',
        programLength: 'programLength',
        currentLower: 'stimulation.amplitudeRange.lo',
        currentUpper: 'stimulation.amplitudeRange.hi',
        calibrationFrequency: 'calibration.frequency',
        calibrationStart: 'calibration.startingAmplitude',
        calibrationStep: 'calibration.amplitudeIncrements',
        calibrateTo: 'calibration.calibrationLimit.to',
        postCalibrateChange: 'calibration.calibrationLimit.then.trend',
        postCalibrateType: 'calibration.calibrationLimit.then.type',
        postCalibrateAmount: 'calibration.calibrationLimit.then.amount',
        impedanceInitiate: 'impedance.initiate',
        impedanceMonitor: 'impedance.monitor',
    }

    const mergeDeviceCodes = () => {

        let merge = {}
        const keys = Object.keys(programCodes)
        keys.forEach(key => {
            merge[key] = {
                rules: programRules[key], 
                code: programCodes[key], 
                dataPath: parameterDataPath[key]
            }
        })
        return merge
    }
    
    return {mergeDeviceCodes}
}
