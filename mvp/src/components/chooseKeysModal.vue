<template>
<section class="backdrop" 
        @click="handleCANCELClick">

    <section class="modal-frame">
        <h3>Request Device Parameter Data</h3>

        <fieldset >
            <legend>Select Program Fields</legend>
            <div v-for="key in parameterKeys"
                :key="key" class="inline-labels">
                <input type="checkbox" :value="key"
                  :id="key" 
                  v-model="selectedCodes"/>
                <label :for="key">{{ key }}</label>
            </div>

        </fieldset>

        <div class="ok-cancel-buttons modal-footer">
          <button @click="handleCANCELClick"
                class="CANCELButton">CANCEL</button>
          <button @click="handleOKClick"
                class="OKButton">OK</button>
        </div>
    </section>
</section>

</template>

<script setup>
import phoenix100 from '@/defaultConfigs/phoenix100.json'

//Props and Emits
const emit = defineEmits(['cancelEdit', 'paramsSelected']);

const parameterKeys = Object.keys(phoenix100.parameterCodes)

//copy existing selections to array so they show as checked boxes
let selectedCodes = []
if (parameterKeys.length) {
  selectedCodes = [...parameterKeys]
}

/* Prevent propagation from a Cancel type click */
const handleCANCELClick = e => {
  if (e.target === e.currentTarget) {
    emit('cancelEdit') 
  }
  else return
}

const handleOKClick = () => {
    emit('paramsSelected', selectedCodes)
}

</script>

<style scoped>
    .modal-frame {
        width: 40%;
        max-width: 400px;
        max-height: 900px;
        padding: 16px;
        margin: 10% auto;
        background: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
        overflow-y: auto;
    }

.backdrop {
    top:0;
    left: 0;
    position: fixed;
    background: rgba(0,0,0,0.35);
    width: 100vw;
    height: 100vh;
    
}

input {
    margin: 8px;
    width: auto;
    font-size: var(--bodyFont);
}

.ok-cancel-buttons {
    align-content: center;
  }

  .ok-cancel-buttons button {
    font-weight: 700;
    border: none;
    background-color: white;
    padding: 4px 8px;
    margin: 16px 4px;
    min-width: 50px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    margin: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

</style>