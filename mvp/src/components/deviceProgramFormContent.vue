<template>
  
<section class="input-area">
    <div class="input-fields">
        <h3>Program Overview</h3>
        <ul @keypress="handleKeypress" class="input-fields">
            <InputField 
                labelName="Program Name" classList="box"
                id="programName" type="text" 
                v-model="program.programName"/>
            <InputField 
                labelName="Adherence Contact" classList="box"
                id="name" type="text" 
                v-model="program.adherenceContact"/>
            <InputField 
                labelName="Phone" classList="box"
                id="phone" type="tel" 
                v-model="program.adherencePhone"/>

            <SegmentedButton 
                label="Outlet Port:"
                v-model="program.outletPort" 
                :segmentButtons="outletPortSegments"/>

            <InputField 
                labelName="Program Length" 
                v-model="program.programLength" type="text"
                hint="hh:mm:ss (12 hr max)"
                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                classList="box"/>        
        </ul>
    </div>

    <div class="input-fields">
        <h3>Stimulation</h3>
        <div class="input-fields input-border">
            <SegmentedButton 
                label="Waveform" 
                v-model="program.waveform" 
                :segmentButtons="waveformSegments" />
            <InputRange 
                label="Amplitude Range" hint="(mA; 0.0 - 10.0)" 
                v-model:rangeLo="program.currentLower" 
                v-model:rangeHi="program.currentUpper" 
                class="box" />
            <div class="row-inputs">
                <InputField 
                    labelName="Pulsewidth" 
                    v-model="program.pulseWidth" type="number"
                    :hint="String.fromCharCode(181) + 's; 0 - 1000'"
                    pattern="[0-9]"
                    classList="box center"
                    min="0" max="1000" step="10"/>                                
                <InputField 
                    labelName="Frequency" 
                    v-model="program.frequency" type="number"
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
                    v-model="program.impedanceInitiate"/>
            </li>
            <li>
                <CheckboxField
                    id="monitor"
                    labelEnd="Continuously Monitor"
                    v-model="program.impedanceMonitor" />                                     
            </li>                                
        </ul>
    </div>
                
    <div class="input-fields">
        <h3>Calibration</h3>
        <div class="input-fields input-border">
            <SegmentedButton 
                label="Frequency" 
                v-model="program.calibrationFrequency" 
                :segmentButtons="calibrationFrequencySegments" />
            <div class="row-inputs">
                <InputField 
                    labelName="Starting Amplitude" 
                    v-model="program.calibrationStart" type="number"
                    hint="(mA; 0.0 - 10.0)"
                    pattern="[0-9]"
                    classList="box center"
                    min="0" max="10.0" step="0.1"/>                                
                <InputField 
                    labelName="Increment" 
                    v-model="program.calibrationStep" type="number"
                    hint="(mA; 0.0 - 1.0)"
                    pattern="[0-9]"
                    classList="box center"
                    min="0" max="1" step="0.1"/>  
            </div>
            <SegmentedButton 
                label="Calibrate to:" 
                v-model="program.calibrateTo" 
                :segmentButtons="calibrateToSegments" />                              
            <div class="row-inputs">
                <SelectField 
                    label="Trend"
                    id="trend"
                    v-model="program.postCalibrateChange" 
                    type="text"
                    pattern="Increase|No Change|Decrease"
                    classList="box center"
                    :optionList="['Increase', 'No Change', 'Decrease']"/>                                
                <InputField 
                    labelName="% Amount" 
                    v-model="program.postCalibrateStep" 
                    type="number"
                    hint="%; 0 - 20"
                    pattern="[0-9]"
                    classList="box center"
                    min="0" max="20" step="1"/>                                
            </div>                          
        </div>
    </div>
</section>


</template>

<script setup>
import InputField from '@/components/inputField-v.vue'
import SegmentedButton from '@/components/segmentedButton-v.vue'
import SelectField from '@/components/selectField.vue'
import CheckboxField from '@/components/checkboxField.vue'
import InputRange from '@/components/inputRange-v.vue'
import { ProgramValidator } from '@/composables/programValidator.js'

const { requiredKeys } = ProgramValidator()

//blank program
const program = ref(requiredKeys.reduce((obj, key) => {
    obj[key] = ""; 
    return obj
},{}))

program.value.programName = 'Device Program Load'

console.log('blank program: ', program)

import { 
    outletPortSegments, 
    waveformSegments, 
    calibrationFrequencySegments,
    calibrateToSegments,
 } from '@/data/mvpConfig.json'
import { ref } from 'vue'

const handleKeypress = e => {
    if (e.key == 'Enter') { 
        e.preventDefault()
    }
}

</script>

<style>

</style>