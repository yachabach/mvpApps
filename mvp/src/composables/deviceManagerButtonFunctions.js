import { DeviceMessageService } from "@/composables/deviceMessageService"
import { ComService } from "@/common/comService"
import { useLogStore } from '@/common/logStore'

import { DialogEngine } from "@/composables/dialogEngine"
import { usePortStore } from '@/common/portStore.js'
import { useRouter } from 'vue-router'
import { useProgramStore } from "@/common/programStore"
import { storeToRefs } from "pinia"
import { MessageService } from "@/composables/messageService"

export const DeviceManagerButtonFunctions = () => {

    const { logEvent } = useLogStore()
    const { changeActivePort } = usePortStore();
    const { writeToPort } = ComService();
    const { runDialog, runMessageStream } = DialogEngine();
    const { updateFileHandle, clearProgram, loadDefaultProgram } = useProgramStore();
    const { program } = storeToRefs(useProgramStore());
    const dms = DeviceMessageService();
    const router = useRouter();
    const {getMessage, sendReadMessageList, receivedACK, sendProgramMessageList} = MessageService();

    const ovalButton = {
        portAuthButton: async () => {
            return await changeActivePort();
        },

        connectButton: async () => {
            await writeToPort(dms.connectDevice)
            return await receivedACK()
        },

        //returns true or false
        writeButton: async program => {
            const programMessageList = [
                ['0x37', '0x05', '0x00', '0x47', '0x00', '0x32', '0xb5'],
                ['0x37', '0x05', '0x00', '0x48', '0x00', '0x14', '0x98'],
                ['0x37', '0x05', '0x00', '0x49', '0x00', '0x00', '0x85'],
                ['0x37', '0x05', '0x00', '0x4A', '0x00', '0x02', '0x88']
            ]
            // const programMessageList = dms.buildProgramMsgList(program)
            return await sendProgramMessageList(programMessageList)
        },

        //Pushes to device Program page
        deviceLoadButton: () => router.push({name: 'readDevice'}),

        //returns program object or undefined
        readButton: async prog => {
            const programKeys = Object.keys(prog)
            // const readMessages = dms.buildReadMsgList(programKeys)
            // const readMessages = dms.buildReadMsgList(programKeys)
            const readMessages = [
                ['0x37', '0x03', '0x01', '0x47', '0x82'],
                ['0x37', '0x03', '0x01', '0x48', '0x83'],
                ['0x37', '0x03', '0x01', '0x49', '0x84'],
                ['0x37', '0x03', '0x01', '0x4A', '0x85'],
                ['0x37', '0x03', '0x01', '0x4B', '0x86']]

                return await sendReadMessageList(readMessages);

        },

        //returns true or false
        resetButton: async () => {
            return await runDialog(dms.RESET)
        },
    }

    return Object.freeze({
        ovalButton
    })
}