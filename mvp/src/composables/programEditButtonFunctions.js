import { FileFunctions } from "./fileFunctions"
import { useProgramStore } from '@/common/programStore.js'
import { storeToRefs } from "pinia";

export const ProgramFormFunctions = () => {

    const { getNewFileHandle, writeFile } = FileFunctions();
    const { program, programFileHandle } = storeToRefs(useProgramStore())
    const { updateFileHandle, loadDefaultProgram, loadProgramFile } = useProgramStore();

    const handleSubmit = {
        saveAs: async () => {
            const fileHandle = await getNewFileHandle()
            await writeFile(fileHandle, JSON.stringify(program.value, null, 2))
            updateFileHandle(fileHandle)
            return undefined
        },
        save: async () => {
            console.log('handling save. File handle: ', programFileHandle.value)
            if (programFileHandle.value.name) {
                await writeFile(programFileHandle.value, JSON.stringify(program.value, null, 2))
            } else {
                handleSubmit['saveAs']()
            }
            return undefined
        },
        cancel: async () => {
            if (confirm('Lose changes to this program?')) {
                programFileHandle.value.name ? 
                    await loadProgramFile(programFileHandle.value) :
                    loadDefaultProgram()                
            }
            return undefined
        },
    }

    return Object.freeze({
        handleSubmit
    })
}