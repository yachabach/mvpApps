
    // from: https://developer.chrome.com/en/articles/serial/
    const listenToActivePort = async (callback = () => {}) => {
        logEvent('Started Listening to port...')
        while (activePort.value.readable && !quitListen) {
          const reader = activePort.value.readable.getReader()
          try {
            while (true) {
              const { value, done } = await reader.read()
              if (done) {
                // Allow the serial port to be closed later.
                reader.releaseLock()
                break;
              }
              if (value) {
                receivedMsgs.value.push(value[0])
                callback(value)
              }
            }
          } catch (error) {
            console.log('Non-fatal error in listen to port: ', error)
            quitListen = true
          }
          logEvent('Stopped listening to port...')  
          quitListen = false
        }
      }