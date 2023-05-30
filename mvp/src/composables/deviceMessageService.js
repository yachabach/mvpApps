import { parameterCodes, protocol, commands } from '@/defaultConfigs/phoenix100.json'
import { Phoenix100Rules } from '@/programRules/phoenix100Rules'
import { useLogStore } from '@/common/logStore.js'
import { useProgramStore } from '@/common/programStore.js'
import { storeToRefs } from 'pinia'

export const DeviceMessageService = () => {

    const parameterKeys = Object.keys(parameterCodes)
    const { applyRules } = Phoenix100Rules()
    const { program } = storeToRefs(useProgramStore())
    const { logEvent } = useLogStore()

    //return array of parameter codes from array of parameter keys
    //removes keys that don't have a code
    const keysToCodes = requstedKeys => 
        requstedKeys.reduce((msg, key) => parameterCodes[key] ?
                msg.concat(parameterCodes[key]) : msg, [])
                
    const swapKeysToValues = obj => Object.keys(obj).reduce((newObj, key) => {
        newObj[parseInt(obj[key])] = key
        return newObj
    }, {})

    const codeKeys = swapKeysToValues(parameterCodes)

    const msgSum = msg => msg.reduce((s, m) => s + parseInt(m),0)

    const checkSum = msg => msgSum(msg.slice(0, msg.length)) & parseInt('0xff')

    const checksumPassed = msg => checkSum(msg.slice(0, msg.length-1)) == msg.slice(-1)

    //Turn payload data into array of hi byte and a lo byte
    const numToHiLoBytes = num => [
        '0x' + ('000' + (num & '0xff00').toString(16)).slice(-4,-2), 
        '0x' + ('0' + (num & '0xFF').toString(16)).slice(-2)
    ]

    //Convert hi/lo hex strings  into a decimal integer
    const hiLoBytesToInt = hiLoBytes => parseInt(hiLoBytes[0]*256) + parseInt(hiLoBytes[1])
    
    //builds command message with or without payload data
    const commandMessageBuilder = (command, payload='') => {
        const msgLength = '0x' + ('0' + ((payload.length + 2).toString(16))).slice(-2)
        let deviceCommand = [protocol.msgInit].concat(msgLength, command, ...payload)
        return deviceCommand.concat('0x' + checkSum(deviceCommand).toString(16))         
    }

    //builds a parameter programming command consisting of a command + hi byte + lo byte
    const buildParameterMessage = (program, parameter) => {
        const payload = [parameterCodes[parameter], ...numToHiLoBytes(applyRules(parameter, program[parameter]))]
        return commandMessageBuilder(commands.write, payload)
    }

    //Builds an array of programming command messages - one for every parameter key
    const buildProgramMsgList = program => 
        parameterKeys.reduce((msgList, param) => 
            msgList.concat([buildParameterMessage(program, param)]),[])

    //build array of read messages  - one for every requested parameter
    const buildReadMsgList = requestedKeys => {
        const requestedCodes = keysToCodes(requestedKeys)
        return requestedCodes.reduce((msg, code) => msg.concat([commandMessageBuilder(commands.read, [code])]), [])
    }

    // console.log('Read response - frequency: ', commandMessageBuilder('0x02', ['0x47', '0x01', '0x1A']))
    // console.log('Read response - pulseWidth: ', commandMessageBuilder('0x02', ['0x48', '0x00', '0x04']))
    // console.log('Read response - waveform: ', commandMessageBuilder('0x02', ['0x49', '0x00', '0x01']))

    //parse the response from the device
    //0x37 len 0x02 code hi lo CS
    //ACK: ['0x37', '0x02', '0xFF', '0x38'] : 0x37 0x02 0xFF 0x38
    //Request frequency: ['0x37', '0x03', '0x01', '0x47', '0x82']
    //Request pulseWIdth: ['0x37', '0x03', '0x01', '0x48', '0x83']
    //Request waveform: ['0x37', '0x03', '0x01', '0x49', '0x84']
    //respond Frequency: ['0x37', '0x05', '0x02', '0x47', '0x01', '0x1A', '0xa0'] : 0x37 0x05 0x02 0x47 0x01 0x1A 0xa0
    //respond Pulsewidth: ['0x37', '0x05', '0x02', '0x48', '0x00', '0x0a', '0x90'] : 0x37 0x05 0x02 0x48 0x00 0x04 0x8a
    //respond Waveform: ['0x37', '0x05', '0x02', '0x49', '0x00', '0x01', '0x88'] : 0x37 0x05 0x02 0x49 0x00 0x01 0x88
    const parseResponse = msg => {
        console.log('Parsing response from device: ', msg)
        const codeKeys = swapKeysToValues(parameterCodes)
        console.log('codeKeys: ', codeKeys, ' msg[3]: ', msg[3])
        console.log('setting: ', codeKeys[msg[3]], ' to: ', hiLoBytesToInt(msg.slice(-3, -1)))
        logEvent([codeKeys[msg[3]]] + ' = ' + hiLoBytesToInt(msg.slice(-3, -1)))
        return true
    }

    // const connectDevice = commandMessageBuilder([0x36])
    const connectDevice = commandMessageBuilder([commands.init])

    const ACK = commandMessageBuilder([protocol.ACK])

    const NACK = commandMessageBuilder([protocol.NACK])

    const RESET = commandMessageBuilder([commands.reset])

    const PHONE = commandMessageBuilder([commands.phone])

    return {
        buildReadMsgList,
        buildProgramMsgList,
        checksumPassed,
        hiLoBytesToInt,
        parseResponse,
        codeKeys,
        connectDevice,
        ACK, NACK,
        RESET, PHONE
    }
}