import { DeviceMessageService } from "@/composables/deviceMessageService"
import { ComService } from "@/common/comService"

import { usePortStore } from '@/common/portStore.js'
import { useRouter } from 'vue-router'
import { MessageService } from "@/composables/messageService"

export const DeviceManagerButtonFunctions = () => {

    const { changeActivePort } = usePortStore();
    const { writeToPort } = ComService();
    const dms = DeviceMessageService();
    const router = useRouter();
    const {sendReadMessageList, receivedACK, sendWriteMessageList} = MessageService();

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

            //Test Messages
            // const programMessageList = [
            //     ['0x37', '0x05', '0x00', '0x47', '0x00', '0x32', '0xb5'],
            //     ['0x37', '0x05', '0x00', '0x48', '0x00', '0x14', '0x98'],
            //     ['0x37', '0x05', '0x00', '0x49', '0x00', '0x00', '0x85'],
            //     ['0x37', '0x05', '0x00', '0x4A', '0x00', '0x02', '0x88']
            // ];

            const programMessageList = dms.buildProgramMsgList(program);
            return await sendWriteMessageList(programMessageList);
        },

        //Pushes to device Program page
        deviceLoadButton: () => router.push({name: 'readDevice'}),

        //returns program object or undefined
        readButton: async program => {

            //Test Messages
            // const readMessages = [
            //     ['0x37', '0x03', '0x01', '0x47', '0x82'],
            //     ['0x37', '0x03', '0x01', '0x48', '0x83'],
            //     ['0x37', '0x03', '0x01', '0x49', '0x84'],
            //     ['0x37', '0x03', '0x01', '0x4A', '0x85'],
            //     ['0x37', '0x03', '0x01', '0x4B', '0x86']
            // ];
            
            const programKeys = Object.keys(program);
            const readMessages = dms.buildReadMsgList(programKeys);
            return await sendReadMessageList(readMessages);
        },

        //returns true or false
        resetButton: async () => {
            await writeToPort(dms.RESET)
            return await receivedACK()
        },
    }

    return Object.freeze({
        ovalButton
    })
}