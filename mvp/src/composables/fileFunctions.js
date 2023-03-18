export const FileFunctions = () => {

    const pickerOpts = {
        types: [
        {
            description: "Images",
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
        // Open file picker and destructure the result the first handle
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    
        // get file contents
        const fileData = await fileHandle.getFile();
        return fileData
    }

    return {
        chooseFileWithPicker
    }
      
}

