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

    const handleSave = {
        saveAs: async (fileHandle, contents) => {
            fileHandle = await getNewFileHandle(pickerOpts)
            await writeFile(fileHandle, contents)
            return undefined
        },
        save: async (fileHandle, contents) => {
            console.log('handling save')
            await writeFile(fileHandle, contents)
            return undefined
        },
        cancel: async () => {
            return "Jake Yachabach"
        },
    }

    const chooseFileWithPicker = async () => {
        // Open file picker and destructure the result the first handle
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
        // Create a FileSystemWritableFileStream to write to.
        const writable = await fileHandle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(contents);
        // Close the file and write the contents to disk.
        await writable.close();
    }

    return {
        chooseFileWithPicker,
        handleSave,
        writeFile
    }
      
}

