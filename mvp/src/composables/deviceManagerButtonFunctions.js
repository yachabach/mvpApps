import { DeviceMessageService } from "@/composables/deviceMessageService"
import { DialogEngine } from "@/composables/dialogEngine"
import { usePortStore } from '@/common/portStore.js'

export const DeviceManagerButtonFunctions = () => {

    const { changeActivePort } = usePortStore()
    const { runDialog } = DialogEngine()
    const dms = DeviceMessageService()

    const ovalButton = {
        portAuthButton: async () => {
            return await changeActivePort()
        },

        connectButton: async () => {
            return await runDialog(dms.connectDevice, 5000)
        },

        writeButton: async program => {
            return await runDialog(dms.programMessageBuilder(program), 5000)
        },

        resetButton: async () => {
            return await runDialog(dms.RESET, 5000)
        },
    }

    return Object.freeze({
        ovalButton
    })
}