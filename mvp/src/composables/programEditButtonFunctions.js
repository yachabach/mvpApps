/**TODO
 * Refactor: These functions have multiple dependencies and side-effects
 */

import { FileFunctions } from "./fileFunctions"
import { useProgramStore } from '@/common/programStore.js'
import { useRouter } from "vue-router";

export const ProgramFormFunctions = () => {

    console.log('initializing program form functions (save/saveAs/cancel)')

    const { getNewFileHandle, writeFile } = FileFunctions();
    const { updateFileHandle, loadProgramObject, loadProgramFile } = useProgramStore();
    const router = useRouter()

    const handleSubmit = {
        saveAs: async (program, fileHandle) => {
            fileHandle = await getNewFileHandle()
            await writeFile(fileHandle, JSON.stringify(program, null, 2))
            updateFileHandle(fileHandle)
            return true
        },

        save: async (program, fileHandle) => {
            if (fileHandle.name) {
                await writeFile(fileHandle, JSON.stringify(program, null, 2))
            } else {
                handleSubmit['saveAs'](program, fileHandle)
            }
            return true
        },

        cancel: async (program, fileHandle) => {
            if (router.currentRoute.value.name === 'readDevice') {
                router.push({path: '/'})
            } else if (confirm('Lose changes to this program?')) {
                fileHandle.name ? 
                    await loadProgramFile(fileHandle) :
                    loadProgramObject()                
            }
            return true
        },
    }

    return Object.freeze({
        handleSubmit
    })
}