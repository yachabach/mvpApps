<template>
    <div class="canvas">
        <section class="grid-structure">
            <header class="card-area">
                <h1>{{reactiveObject.program.programName}}</h1>
                <FileSelector 
                    :fileHandle="fileHandle" 
                    @fileChosen="handleFileChosen"/> 
            </header>
            <div class="program card-area">
                <form @submit.prevent="handleSubmit">
                    <div class="input-area">

                        <div class="input-fields">
                            <h3>Program Overview</h3>
                            <InputField 
                                labelName="Program Name" classList="box"
                                id="programName" type="text" v-model="reactiveObject.program.programName"/>
                            <InputField 
                                labelName="Adherence Contact" classList="box"
                                id="name" type="text" v-model="reactiveObject.program.contact.name">
                            </InputField>
                            <InputField 
                                labelName="Phone" classList="box"
                                id="phone" type="tel" v-model="reactiveObject.program.contact.phone">
                            </InputField>
                            <!-- <FileSelector v-model="newHandle"/> -->
                            <!-- <FileSelector @fileChosen="handleFileChosen"/> -->
                            <SegmentedButton 
                                label="Outlet Port:"
                                v-model="reactiveObject.program.outletPort" 
                                :segmentButtons="outletPortSegments"/>
                            <InputField 
                                labelName="Program Length" 
                                v-model="reactiveObject.program.programLength" type="text"
                                hint="hh:mm:ss (12 hr max)"
                                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                                classList="box center"/>
                        </div>

                        <div class="input-fields">
                            <h3>Stimulation</h3>
                            <div class="input-fields input-border">
                                <SegmentedButton 
                                    label="Waveform" 
                                    v-model="reactiveObject.program.stimulation.waveform" 
                                    :segmentButtons="waveformSegments" />
                                <InputRange 
                                    label="Amplitude Range" hint="(mA; 0.0 - 10.0)" 
                                    :rangeLo="reactiveObject.program.stimulation.amplitudeRange.currentLower" 
                                    :rangeHi="reactiveObject.program.stimulation.amplitudeRange.currentUpper" 
                                    class="box"
                                    @updateRange="handleUpdateRange"/>
                                <div class="row-inputs">
                                    <InputField 
                                        labelName="Pulsewidth" 
                                        v-model="reactiveObject.program.stimulation.pulseWidth" type="number"
                                        :hint="String.fromCharCode(181) + 's; 0 - 1000'"
                                        pattern="[0-9]"
                                        classList="box center"
                                        min="0" max="1000" step="10"/>                                
                                    <InputField 
                                        labelName="Frequency" 
                                        v-model="reactiveObject.program.stimulation.frequency" type="number"
                                        hint="Hz; 1 - 300"
                                        pattern="[0-9]"
                                        classList="box center"
                                        min="1" max="300" step="1"/>                                
                                </div>
                            </div>
                            <h3>Impedance</h3>
                            <ul class="input-border input-fields">
                                <li>
                                    <CheckboxField
                                        id="check"
                                        labelEnd="Check to Initiate"
                                        v-model="reactiveObject.program.impedance.impedanceInitiate"/>
                                </li>
                                <li>
                                    <CheckboxField
                                        id="monitor"
                                        labelEnd="Continuously Monitor"
                                        v-model="reactiveObject.program.impedance.impedanceMonitor" />                                     
                                </li>                                
                            </ul>
                       </div>
                               
                        <div class="input-fields">
                            <h3>Calibration</h3>
                            <div class="input-fields input-border">
                                <SegmentedButton 
                                    label="Frequency" 
                                    v-model="reactiveObject.program.calibration.calibrationFrequency" 
                                    :segmentButtons="calibrationFrequencySegments" />
                                <div class="row-inputs">
                                    <InputField 
                                        labelName="Starting Amplitude" 
                                        v-model="reactiveObject.program.calibration.calibrationStart" type="number"
                                        hint="(mA; 0.0 - 10.0)"
                                        pattern="[0-9]"
                                        classList="box center"
                                        min="0" max="10.0" step="0.1"/>                                
                                    <InputField 
                                        labelName="Increment" 
                                        v-model="reactiveObject.program.calibration.calibrationStep" type="number"
                                        hint="(mA; 0.0 - 1.0)"
                                        pattern="[0-9]"
                                        classList="box center"
                                        min="0" max="1" step="0.1"/>  
                                </div>
                                <SegmentedButton 
                                    label="Calibrate to:" 
                                    v-model="reactiveObject.program.calibration.calibrationLimit.calibrateTo" 
                                    :segmentButtons="calibrateToSegments" />                              
                                <div class="row-inputs">
                                    <SelectField 
                                        label="Trend"
                                        id="trend"
                                        v-model="reactiveObject.program.calibration.calibrationLimit.then.postCalibrateTrend" 
                                        type="text"
                                        pattern="Increase|No Change|Decrease"
                                        classList="box center"
                                        :optionList="['Increase', 'No Change', 'Decrease']"/>                                
                                    <InputField 
                                        labelName="% Amount" 
                                        v-model="reactiveObject.program.calibration.calibrationLimit.then.postCalibrateStep" 
                                        type="number"
                                        hint="%; 0 - 20"
                                        pattern="[0-9]"
                                        classList="box center"
                                        min="0" max="20" step="1"/>                                
                                </div>                          
                            </div>
                        </div>
                    </div>
                    
                    <div class="submit-buttons">
                        <button type="submit" id="cancel">Cancel</button>
                        <button type="submit" id="save">Save</button>
                        <button type="submit" id="saveAs">Save As</button>

                    </div>
                </form>
            </div>
            <div class="device card-area input-fields">
                <DeviceManager :program="reactiveObject.program"/>
                
            </div>

        </section>        
    </div>

</template>

<script setup>
import InputField from '@/components/inputField.vue'
import CheckboxField from '@/components/checkboxField.vue'
import SelectField from '@/components/selectField.vue'
import FileSelector from '@/components/fileSelector2.vue'
import {FileFunctions} from '@/composables/fileFunctions.js'
import InputRange from '@/components/inputRange.vue'
import SegmentedButton from '@/components/segmentedButton.vue'
import DeviceManager from '@/components/deviceManager.vue'
import { ProgramValidator } from '@/composables/programValidator.js'

import { 
    outletPortSegments, 
    waveformSegments, 
    calibrationFrequencySegments,
    calibrateToSegments,
 } from '@/data/mvpConfig.json'

import { defaultProgram } from '@/data/mvpConfig.json'

import { reactive, ref } from 'vue'

const { handleSave } = FileFunctions();
const { validProgram } = ProgramValidator()

const reactiveObject = reactive({program: defaultProgram})
console.log('Starting with default program: ', reactiveObject.program)
const fileHandle = ref(undefined)

const handleFileChosen = async handle => {
    const file = await handle.getFile()
    const newProgram = JSON.parse(await file.text())
    if (validProgram(newProgram)) {
        reactiveObject.program = newProgram
        console.log('changed to program: ', reactiveObject.program)
        fileHandle.value = handle
    } else {
        alert('Program File is corrupt.  Returning to previous program')
    }
}

const handleSubmit = async e => {
    if (fileHandle.value) {
        await handleSave[e.submitter.id](fileHandle.value, JSON.stringify(reactiveObject.program, null, 2))
    } else
        await handleSave['saveAs'](fileHandle.value, JSON.stringify(reactiveObject.program, null, 2))
}

const handleUpdateRange = newRange => {
    console.log('updating range: ', newRange)
    reactiveObject.program.stimulation.amplitudeRange.currentLower = newRange.lo    
    reactiveObject.program.stimulation.amplitudeRange.currentUpper = newRange.hi    
}

</script>

<style scoped>

.canvas {
    margin: 16px;
    background-color: white;
}

.grid-structure {
    display: grid;
    grid-template-areas: 
        "header header"
        "program device";
    grid-template-rows: 1fr 5fr;
    grid-template-columns: 3fr 1fr;
    gap: 8px;
    margin: 16px;
    background-color: white;
}

header {
    grid-area: header;
    /* font-size: var(--headlineFont);
    font-weight: var(--titleWeight); */
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-area {
    background-color: var(--neutral);
    border-radius: 10px;
    padding: 16px;
}

.input-area {
    display: flex;
    justify-content: space-between;
    gap: 16px;
}

.program {
    grid-area: program;
}

.device {
    grid-area: device;
}

.submit-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px;
    gap: 16px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

button {
    padding: 4px 12px;
    width: 100px;
    height: 24px;
    border-radius: 4px;
    color: var(--hyperlink);
    font-size: var(--titleFont);
    font-weight: var(--titleWeight);
    vertical-align: center;
    border: none;
    background: transparent;
    cursor: pointer;
}

.row-inputs {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

</style>