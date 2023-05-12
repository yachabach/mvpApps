<template>
    <section class="element-section">
        <label v-if="label" for="filename">{{ label }}</label>
        <p id="filename">{{ informationElement }}</p>
    </section>
</template>

<script setup>

const props = defineProps({
    label: String,
    informationElement: String
})

</script>

<style scoped>
.element-section {
    display: flex;
    flex-direction: column;
    max-width: 300px;
}

label {
    font-size: var(--labelFont);
    font-weight: var(-labelWeight);
}

p, pre {
    font-weight: 600;
    white-space: pre-wrap;
};


</style>