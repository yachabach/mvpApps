import { ComService } from "@/common/comService"
import { CommandResponses } from '@/composables/commandResponses.js'

export const DialogEngine = () => {

    const { exchangeMessages } = ComService()
    const { commandResponseMap } = CommandResponses()

    const runDialog = async command => {
        let res = undefined
        try {
            res = await exchangeMessages(command, 5000)
            res = commandResponseMap.get(res[2])()
        } catch (err) {
            console.log('Error in handleConnect Device: ', err)
            commandResponseMap.get('NACK')()
        }
        return res
    }

    return Object.freeze({
        runDialog,
    })
}