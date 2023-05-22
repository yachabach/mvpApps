import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { ProgramValidator } from '@/composables/programValidator.js'
import { defaultProgram } from '@/data/mvpConfig.json'

export const  useProgramStore = defineStore('program', () => {

  const { flattenProgram } = ProgramValidator();

  //state
  const reactiveObject = reactive({
    program: undefined,
    handle: undefined
  })

  //getters
  const program = computed(() => reactiveObject.program)
  const programFileHandle = computed(() => reactiveObject.handle)

  //actions
  async function loadProgramFile(fileHandle){
    const file = await fileHandle.getFile()
    const newProgram = JSON.parse(await file.text())
    reactiveObject.program = flattenProgram(newProgram)
    updateFileHandle(fileHandle)
  }

  function loadProgramObject(programObject) {
    console.log('Loading program object: ', programObject)
    reactiveObject.program = flattenProgram(programObject)
  }

  function loadDefaultProgram() { loadProgramObject(defaultProgram)}

  function updateFileHandle(fileHandle) {
    reactiveObject.handle = fileHandle
  }

  function clearProgram(program) {
    Object.keys(program).forEach(key => program[key] = '')
  }

  //setup
  if (program.value) {
    console.log('Program already populated...not loading program')
  } else {
    console.log('loading default program')
    loadProgramObject(defaultProgram)
  }
    

  return { 
    program,
    programFileHandle,
    updateFileHandle,
    loadProgramObject,
    loadDefaultProgram,
    loadProgramFile,
    clearProgram
  }
})
