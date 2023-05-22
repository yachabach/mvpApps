import { DeviceMessageService } from "@/composables/deviceMessageService"
import { DialogEngine } from "@/composables/dialogEngine"
import { usePortStore } from '@/common/portStore.js'
import { useRouter } from 'vue-router'
import { useProgramStore } from "@/common/programStore"
import { storeToRefs } from "pinia"

export const DeviceManagerButtonFunctions = () => {

    const { changeActivePort } = usePortStore()
    const { runDialog, runMessageStream } = DialogEngine()
    const { updateFileHandle, clearProgram, loadDefaultProgram } = useProgramStore()
    const { program } = storeToRefs(useProgramStore())
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
        readButton: async prog => {
            const programKeys = Object.keys(prog)
            await runMessageStream(dms.buildReadMsgList(programKeys))
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