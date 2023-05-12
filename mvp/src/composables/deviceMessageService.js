import { SerialCodes } from "./serialCodes"
import { JsonFunctions } from "./jsonFunctions";
import deviceCodes from '@/data/deviceCodes.json'

const sc = SerialCodes();
const { getValueByPath } = JsonFunctions()

export const DeviceMessageService = () => {

    const  convertDurationtoSeconds = duration => {
        const [hours, minutes, seconds] = duration.split(':');
        return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
    }

    const seekProperValue = (key, value) => {
        if (!deviceCodes[key]) {
            console.log('Key ', key, ' does not exist in device code json file')
            return undefined
        }
        const ruleValue = deviceCodes[key].rules[String(value).toLowerCase()]
        if (!ruleValue) {
            return deviceCodes[key].rules['default']
        } else {
            return ruleValue
        }
    }

    const getValidatedValue = (program, key) => {
        let value = getValueByPath(deviceCodes[key].dataPath, program)
        if (!isNaN(1 * value)) value *= 1
        console.log('value: ', value)
        if (typeof(value) !== 'number' ) {
            console.log('Seeking proper value')
            value = seekProperValue(key, value)
        }
        return value
    }

    const buildMessageCore = (keys, program) => {
        let core = []
        keys.forEach(key => {
            core = core.concat([deviceCodes[key].code, 
                getValidatedValue(program, key)])
        })
        return core
    }

    const commandMessageBuilder = (command, payload='') => {
        let deviceCommand = [sc.com_protocol.msgInit]
        deviceCommand = deviceCommand.concat([(payload.length*2) + 4], command)
        if (payload) {
            deviceCommand = deviceCommand.concat(payload)
        }
        return deviceCommand
    }
    
    const programMessageBuilder = program => {
        /**Create the message by iterating through the parameter device codes
         * 
         */
        console.log('current program: ', program)
        let programMessage = []
        const keys = Object.keys(deviceCodes)
        const payload = buildMessageCore(keys, program)
        programMessage = commandMessageBuilder(sc.pc_to_device.write, payload)
        return programMessage
    }

    // const connectDevice = commandMessageBuilder([0x36])
    const connectDevice = commandMessageBuilder([sc.pc_to_device.init])

    const ACK = commandMessageBuilder([sc.com_protocol.ACK])

    const NACK = commandMessageBuilder([sc.com_protocol.NACK])

    const READ = commandMessageBuilder([sc.pc_to_device.read])

    const WRITE = commandMessageBuilder([sc.pc_to_device.write])

    const RESET = commandMessageBuilder([sc.pc_to_device.reset])

    const PHONE = commandMessageBuilder([sc.pc_to_device.phone])

    const SETTIME = commandMessageBuilder([sc.pc_to_device.setTime])

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