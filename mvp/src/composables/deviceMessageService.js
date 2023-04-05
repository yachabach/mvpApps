import { SerialCodes } from "./serialCodes"

const sc = SerialCodes();

export const DeviceMessageService = () => {

    const deviceConnectMessage = [
        sc.com_protocol.msgInit, 
        sc.pc_to_device.init
    ]

    const ACK = [
        sc.com_protocol.msgInit,
        sc.com_protocol.ACK
    ]

    const NACK = [
        sc.com_protocol.msgInit,
        sc.com_protocol.NACK
    ]

    return {
        deviceConnectMessage,
        ACK,
        NACK
    }
}