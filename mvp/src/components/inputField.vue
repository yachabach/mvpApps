<template>
    <div>
        <label v-if="props.labelName" 
            :for="id">
            {{ labelName }}: 
        </label>
        <input 
            :id="id" :type="type" 
            :value="value" 
            @input="handleInput"
            :pattern="pattern" 
            :class="classList"
            :min="min" :max="max" :step="step"
        />
        <p v-if="error" class="validation-error">{{ error }}</p>
        <p v-if="hint" >{{ hint }}</p>
    </div>
</template>

<script setup>

const props = defineProps([
    'value',
    'labelName',
    'id',
    'type',
    'error',
    'pattern',
    'hint',
    'classList',
    'min', 'max', 'step',
]);

</script>


<style scoped>
label {
    display: block;
}

input {
    /* display: block; */
    height: 40px;
    padding: 8px;
    align-items: center;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
    background-color: var(--neutral);
    border: none;
}

input:focus {
    border: thin var(--outline);
    background-color: var(--primary-light);
}

input:hover {
    background-color: var(--primary-light);
}

input[type=text], input[type=tel] {
    width: 250px;
}

input[type=number] {
    width: 100px;
    text-align: center;
}

input[type=checkbox] {
    vertical-align: middle;
    display: inline-block;
    height: 20px;
    width: 20px;
    accent-color: var(--selected-background);
}

input[type=checkbox]:hover {
    outline: 4px solid var(--outline);
    accent-color: var(--primary-light);
}

input[type=checkbox] + label {
    display: inline-block;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
    padding-left: 8px;
}


/* 
input:invalid + span::after {
  content: "✖";
  padding-left: 5px;
}

input:valid + span::after {
  content: "✓";
  padding-left: 5px;
} */

input:invalid {
    background-color: var(--alertCritical);
}

.box {
    border: 1px solid var(--outline);
    border-radius: 4px;
}

.line {
    border-bottom: 1px solid var(--outline);
}

.center {
    text-align: center;
}
</style>