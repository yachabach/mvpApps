import {FileFunctions} from "@/composables/fileFunctions.js"

const { chooseFileWithPicker } = FileFunctions()

export const ProgramFunctions = () => {

    const programFileDir = '/programs/'

    const getProgramFilename = async () => {
        const programFile = await chooseFileWithPicker()
        return programFile.name
    }

    const getProgramJson = async (fileName) => {
        try {
            const file = await fetch(programFileDir + fileName)
            const data = await file.json()
            return data
        }
        catch (err) {
            console.log('Error in FileFunctions.getProgramJson: ', err)
        }
    }

    return {
        getProgramFilename,
        getProgramJson
    }

}