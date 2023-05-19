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

    const commandMessageBuilder = (command, payload='') => {
        let deviceCommand = [protocol.msgInit]
        const msgLength = ((payload.length*2) + 4).toString(16)
        deviceCommand = deviceCommand
            .concat(msgLength, command)
        if (payload) {
            deviceCommand = deviceCommand.concat(payload)
        }
        return deviceCommand
    }

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
        connectDevice,
        ACK, NACK,
        RESET, PHONE
    }
}