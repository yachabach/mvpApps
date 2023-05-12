export const CommandCodes = () => {
    const pc_to_device = {
        init: 0x03,     //Establish connection
        write: 0x00,
        read: 0x01,
        reset: 0x04,     //reset session number
        phone: 0x6E,     //display phone number
        setTime: 0x6F,   //set real time clock
    }

    const com_protocol = {
        msgInit: 0x37,
        ACK: 0xFF,      //transmission successful 
        NACK: 0xF0,     //transmission unsuccessful
    }

    const device_to_pc = {
        response: 0x02,     //parameter data msg
        transfer: 0x04,     //transfer SD card data
    }

    const parameterCodes = {
        programCodes: {
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
        },
        deviceCodes: {
            monitoring: 0x64,
            adherence: 0x65,
            sendSDCard: 0x66,
            serialNumber: 0x6C,
            sessionNumber: 0x6D,            
        }
    }
    
    return Object.freeze({
        pc_to_device,
        com_protocol,
        device_to_pc,
        parameterCodes
    })
}    




