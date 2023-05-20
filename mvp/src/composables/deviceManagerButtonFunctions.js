import { DeviceMessageService } from "@/composables/deviceMessageService"
import { DialogEngine } from "@/composables/dialogEngine"
import { usePortStore } from '@/common/portStore.js'
import { useRouter } from 'vue-router'

export const DeviceManagerButtonFunctions = () => {

    const { changeActivePort } = usePortStore()
    const { runDialog } = DialogEngine()
    const dms = DeviceMessageService()
    const router = useRouter()

    const ovalButton = {
        portAuthButton: async () => {
            return await changeActivePort()
        },

        connectButton: async () => {
            return await runDialog(dms.connectDevice, 5000)
        },

        writeButton: program => {
            console.log('parameter message: ', dms.buildProgramMsgList(program))
            // router.push({name: 'readDevice'})
        },

        readButton: () => {
            console.log('Reading Program from Device')
            console.log('readMsgList: ', dms.buildReadMsgList(['frequency', 'pulseWidth']))
        },

        resetButton: async () => {
            return await runDialog(dms.RESET, 5000)
        },
    }

    return Object.freeze({
        ovalButton
    })
}