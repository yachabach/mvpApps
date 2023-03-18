<template>
    <div>
        <label :for="id">{{ labelName }}</label>
        <input :id="id" :type="type" :value="modelValue" 
            @input="handleInput"/> 
        <span v-if="error" class="validation-error">{{ error }}</span>
    </div>
</template>

<script setup>

const props = defineProps([
    'modelValue',
    'labelName',
    'id',
    'type',
    'error'
]);

const emit = defineEmits(['update:modelValue'])

const handleInput = e => {
    emit('update:modelValue', e.target.value);
}

</script>

<style scoped>

input {
    border-bottom: 1px solid var(--outline);
    display: block;
    width: 100%;
}

</style>