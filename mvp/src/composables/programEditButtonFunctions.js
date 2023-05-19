import { FileFunctions } from "./fileFunctions"
import { useProgramStore } from '@/common/programStore.js'
import { useRouter } from "vue-router";
// import { storeToRefs } from "pinia";

export const ProgramFormFunctions = () => {

    const { getNewFileHandle, writeFile } = FileFunctions();
    // const { program, programFileHandle } = storeToRefs(useProgramStore())
    const { updateFileHandle, loadDefaultProgram, loadProgramFile } = useProgramStore();
    const router = useRouter()

    const handleSubmit = {
        saveAs: async (program, fileHandle) => {
            fileHandle = await getNewFileHandle()
            await writeFile(fileHandle, JSON.stringify(program.value, null, 2))
            updateFileHandle(fileHandle)
            return undefined
        },

        save: async (program, fileHandle) => {
            if (fileHandle.name) {
                await writeFile(fileHandle, JSON.stringify(program, null, 2))
            } else {
                handleSubmit['saveAs'](program, fileHandle)
            }
            return undefined
        },

        cancel: async (program, fileHandle) => {
            console.log('path: ', router.currentRoute.value.name)
            if (router.currentRoute.value.name === 'readDevice') {
                router.push({path: '/'})
            } else if (confirm('Lose changes to this program?')) {
                fileHandle.name ? 
                    await loadProgramFile(fileHandle) :
                    loadDefaultProgram()                
            }
            return undefined
        },
    }

    return Object.freeze({
        handleSubmit
    })
}