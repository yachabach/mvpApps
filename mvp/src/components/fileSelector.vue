<template>
    <section>
        <h2>File Section</h2>
        <section class="card-foundation">
            <div class="card-section">
                <h3>File Selection</h3>
                <p>Current File: {{ file }}</p>
                <button id="file-chooser" @click="handleChoose">Choose File</button>
            </div>
            <div class="card-section" >
                <h2>Program Contents</h2>
                <pre v-if="file" class="text-section">
                    {{ programJson }}
                </pre> 
            </div>
        </section>        
    </section>

</template>

<script setup>
import { ref } from "vue"
import { ProgramFunctions } from "../composables/programFunctions";

const { getProgramFilename, getProgramJson } = ProgramFunctions()

const file = ref('')
const programJson = ref('')

const handleChoose = async () => {
  file.value = await getProgramFilename()
  programJson.value = await getProgramJson(file.value)
}

</script>

<style>

.text-section {
    display: block;
    text-align: left;
    white-space: none;
}

</style>