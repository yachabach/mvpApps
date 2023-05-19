import { parameterCodes, protocol, commands } from '@/defaultConfigs/phoenix100.json'
import { Phoenix100Rules } from '@/programRules/phoenix100Rules'

export const DeviceMessageService = () => {

    const parameterKeys = Object.keys(parameterCodes)
    const { applyRules } = Phoenix100Rules()

    const buildProgamCore = program => {
        return parameterKeys.reduce(
            (msg, key) =>  msg.concat(
                parameterCodes[key], 
                applyRules(key, program[key])),[])
    }

    const buildRequestCore = requstedKeys => {
        return requstedKeys.reduce(
            (msg, key) =>  
                msg.concat(parameterCodes[key]), [])        
    }

    const msgSum = msg => msg.reduce((s, m) => s + parseInt(m),0)

    const checkSum = msg => msgSum(msg) & parseInt('0xff')

    const commandMessageBuilder = (command, payload='') => {
        const msgLength = ((payload.length) + 2).toString(16)
        let deviceCommand = [protocol.msgInit].concat(msgLength, command, ...payload)
        return deviceCommand.concat('0x' + checkSum(deviceCommand).toString(16))         
    }

    const makeBytes = num => [(num & '0xFF00').toString(16), (num & '0xFF').toString(16)]

    const buildParameterMessage = (program, parameter) => {
        const payload = [parameterCodes[parameter], ...makeBytes(program[parameter])]
        return commandMessageBuilder(commands.write, payload)
    }

    const buildParamMsgList = program => 
        parameterKeys.reduce((msgList, param) => msgList.concat([buildParameterMessage(program, param)]),[])

    const programMessageBuilder = program => {
        const payload = buildProgamCore(program)
        return commandMessageBuilder(commands.write, payload)
    }

    const requestMessageBuilder = requestedKeys => {
        const payload = buildRequestCore(requestedKeys)
        return commandMessageBuilder(commands.read, payload)
    }

    // const connectDevice = commandMessageBuilder([0x36])
    const connectDevice = commandMessageBuilder([commands.init])

    const ACK = commandMessageBuilder([protocol.ACK])

    const NACK = commandMessageBuilder([protocol.NACK])

    const RESET = commandMessageBuilder([commands.reset])

    const PHONE = commandMessageBuilder([commands.phone])

    return {
        programMessageBuilder,
        requestMessageBuilder,
        buildParameterMessage,
        buildParamMsgList,
        connectDevice,
        ACK, NACK,
        RESET, PHONE
    }
}