export const EventLogger = () => {

    const char = String.fromCharCode
    let startTime

    console.log('Starting Event Logger');

    const resetStartTime = () => {
        startTime = Date.now()
    }

    (() => {
        console.log('checking start time')
        if (!startTime) {
            resetStartTime()
        }
    })()

    const resultTable = {
        pass: 0x2714,
        fail: 0x2716,
        none: 0x27AF
    }

    const timeElapsed = () => {
        const elapsed = Math.floor((Date.now() - startTime)/1000)
        return Math.floor(elapsed / 60) + ':' + Math.floor(elapsed % 60)
    }

    const log = (description = '', result='none') => {
        return `${timeElapsed()} ..... ${description} ..... ${char(resultTable[result])}`
    }

    return {
        log,
        resetStartTime
    }
}