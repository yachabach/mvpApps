import { DeviceMessageService } from "@/composables/deviceMessageService"
import { DialogEngine } from "@/composables/dialogEngine"
import { usePortStore } from '@/common/portStore.js'
import { useRouter } from 'vue-router'

export const DeviceManagerButtonFunctions = () => {

    const { changeActivePort } = usePortStore()
    const { runDialog, runMessageStream } = DialogEngine()
    const dms = DeviceMessageService()
    const router = useRouter()

    const ovalButton = {
        portAuthButton: async () => {
            return await changeActivePort()
        },

        connectButton: async () => {
            return await runDialog(dms.connectDevice, 5000)
        },

        //returns true or false
        writeButton: async program => {
            console.log('parameter message: ', dms.buildProgramMsgList(program))
            return await runMessageStream(dms.buildProgramMsgList(program))
        },

        //Pushes to device Program page
        deviceLoadButton: () => router.push({name: 'readDevice'}),

        //returns program object or undefined
        readButton: parameterList => {
            console.log('Reading Program from Device using: ', parameterList)
            console.log('readMsgList: ', dms.buildReadMsgList(parameterList))
        },

        //returns true or false
        resetButton: async () => {
            return await runDialog(dms.RESET, 5000)
        },
    }

    return Object.freeze({
        ovalButton
    })
}