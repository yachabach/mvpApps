import { parameterCodes, protocol, commands } from '@/defaultConfigs/phoenix100.json'
import { programRules } from '@/composables/programRules.js'

export const DeviceMessageService = () => {

    const parameterKeys = Object.keys(parameterCodes)
    const ruleKeys = Object.keys(programRules)

    const  convertDurationtoSeconds = duration => {
        const [hours, minutes, seconds] = duration.split(':');
        return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
    }

    const applyRule = (key, value) => {
        if (Number(value)) {
            return value
        } else {
            return ruleKeys.includes(key) ? programRules[key](value) : programRules.default
        }
    }

    const buildMessageCore = program => {
        return parameterKeys.reduce((msg, key) => {
            msg.concat(parameterCodes[key], applyRule(key, program[key]))
        })
    }

    const commandMessageBuilder = (command, payload='') => {
        let deviceCommand = [protocol.msgInit]
        deviceCommand = deviceCommand.concat([(payload.length*2) + 4], command)
        if (payload) {
            deviceCommand = deviceCommand.concat(payload)
        }
        return deviceCommand
    }

    const programMessageBuilder = program => {
        const payload = buildMessageCore(program)
        programMessage = commandMessageBuilder(commands.write, payload)

    }

    // const connectDevice = commandMessageBuilder([0x36])
    const connectDevice = commandMessageBuilder([commands.init])

    const ACK = commandMessageBuilder([protocol.ACK])

    const NACK = commandMessageBuilder([protocol.NACK])

    const READ = commandMessageBuilder([commands.read])

    const WRITE = commandMessageBuilder([commands.write])

    const RESET = commandMessageBuilder([commands.reset])

    const PHONE = commandMessageBuilder([commands.phone])

    const SETTIME = commandMessageBuilder([commands.setTime])

    return {
        programMessageBuilder,
        connectDevice,
        ACK,
        NACK,
        READ,
        WRITE,
        RESET,
        PHONE,
        SETTIME
    }
}