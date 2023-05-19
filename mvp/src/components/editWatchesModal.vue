<template>
<section class="backdrop" 
        @click="handleCANCELClick">

    <section class="modal-frame">
        <h3>Edit Watches</h3>

        <fieldset >
            <legend>Select Watches</legend>

            <div>
                <input type="checkbox" id="HR" name="HR" value="HR" v-model="watches"/>
                <label for="HR">HR (Heart Rate)</label>                
            </div>

            <div>
                <input type="checkbox" id="RR" name="RR" value="RR" v-model="watches"/>
                <label for="RR">RR (Respiration Rate)</label>
            </div>

            <div>
                <input type="checkbox" id="VT" name="VT" value="VT" v-model="watches"/>
                <label for="VT">VT (Tidal Volume)</label>
            </div>

            <div>
                <input type="checkbox" id="SpO2" name="SpO2" value="SpO2" v-model="watches"/>
                <label for="SpO2">SpO2 (Oxygen Saturation)</label>
            </div>

        </fieldset>

        <footer class="ok-cancel-buttons modal-footer">
          <button @click="handleCANCELClick"
                class="CANCELButton">CANCEL</button>
          <button @click="handleOKClick"
                class="OKButton">OK</button>
      </footer>
    </section>
</section>

</template>

<script setup>
import { ref } from "vue";


//Props and Emits
const props = defineProps(['currentWatches']);
const emit = defineEmits(['cancelEditWatches', 'saveWatches']);

//copy existing watches to array so they show as checked boxes
const watches = ref([])
if (props.currentWatches.length) {
  watches.value = [...props.currentWatches]
}

/* Prevent propagation from a Cancel type click */
const handleCANCELClick = e => {
  if (e.target === e.currentTarget) {
    emit('cancelEditWatches') 
  }
  else return
}

const handleOKClick = () => {
    emit('saveWatches', watches.value)
}

</script>

<style scoped>
    .modal-frame {
        width: 80%;
        max-width: 400px;
        height: 400px;
        padding: 16px;
        margin: 150px auto;
        background: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 32px;
        position: relative;
    }

.backdrop {
    top:0;
    position: fixed;
    background: rgba(0,0,0,0.35);
    width: 100vw;
    height: 100vh;
}

input {
    margin: 8px;
    width: auto;
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