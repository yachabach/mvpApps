export const FileFunctions = () => {

    const pickerOpts = {
        types: [
        {
            id: 'openText',
            description: "Programs",
            accept: {
            // "image/*": [".png", ".gif", ".jpeg", ".jpg"],
            "JSON/*": [".json"],
            },
        },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };    

    const chooseFileWithPicker = async () => {
        // Open file picker and destructure the result to the first handle
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    
        // get file contents
        const fileData = await fileHandle.getFile();
        return fileData
    }

    const getNewFileHandle = async () => {
        return await window.showSaveFilePicker(pickerOpts);
    }

    // fileHandle is an instance of FileSystemFileHandle..
    async function writeFile(fileHandle, contents) {
        const writable = await fileHandle.createWritable();
        await writable.write(contents);
        await writable.close();
    }

    return {
        chooseFileWithPicker,
        getNewFileHandle,
        writeFile
    }
      
}

