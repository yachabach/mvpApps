import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { ProgramValidator } from '@/composables/programValidator.js'
import { defaultProgram } from '@/data/mvpConfig.json'

export const  useProgramStore = defineStore('program', () => {

  const { requiredFields } = ProgramValidator();

  //state
  const reactiveObject = reactive({
    program: {},
    handle: {}
  })

  //getters
  const program = computed(() => reactiveObject.program)
  const programFileHandle = computed(() => reactiveObject.handle)

  //actions
  async function loadProgramFile(fileHandle){
    const file = await fileHandle.getFile()
    const newProgram = JSON.parse(await file.text())
    reactiveObject.program = requiredFields(newProgram)
    updateFileHandle(fileHandle)
  }

  function loadDefaultProgram() {
    reactiveObject.program = requiredFields(defaultProgram)
  }

  function updateFileHandle(fileHandle) {
    reactiveObject.handle = fileHandle
  }

  //setup
  loadDefaultProgram()

  return { 
    program,
    programFileHandle,
    updateFileHandle,
    loadDefaultProgram,
    loadProgramFile,
  }
})
