import { parameterCodes, protocol, commands } from '@/defaultConfigs/phoenix100.json'
import { Phoenix100Rules } from '@/programRules/phoenix100Rules'

export const DeviceMessageService = () => {

    const parameterKeys = Object.keys(parameterCodes)
    const { applyRules } = Phoenix100Rules()

    //return array of parameter codes from array of parameter keys
    const keysToCodes = requstedKeys => {
        return requstedKeys.reduce(
            (msg, key) =>  
                msg.concat(parameterCodes[key]), [])        
    }

    const msgSum = msg => msg.reduce((s, m) => s + parseInt(m),0)

    const checkSum = msg => msgSum(msg.slice(0, msg.length-1)) & parseInt('0xff')

    const checksumPassed = msg => {
        console.log('calculated cksum: ', checkSum(msg))
        console.log('sent cksum: ', msg.slice(-1))
        return checkSum(msg) == msg.slice(-1)
    }

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
        return requestedCodes.reduce((msg, code) => msg.concat([commandMessageBuilder(commands.read, [code])], ), [])
    }

    //parse the response from the device
    const parseResponse = msg => {
        
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
        connectDevice,
        ACK, NACK,
        RESET, PHONE
    }
}