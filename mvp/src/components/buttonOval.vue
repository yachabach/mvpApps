<template>
    <section>
        <button
            id="id"
            :disabled="disabled"
            @click="handleClick"
            :class="{ success: success}">
            {{  success ? config.successPhrase : config.failPhrase }}
        </button>   
        <p v-if="!success">{{ config.remedy }}</p>     
        <p v-if="success & config.guidance">{{ config.guidance }}</p>     
    </section>
</template>

<script setup>
const props = defineProps({
    config: {
        successPhrase: String,
        guidance: String,
        failPhrase: String,
        remedy: String,
        showRemedy: false
    },
    id: String,
    disabled: Boolean,
    success: Boolean
})

const emit = defineEmits(['ovalClick'])

const handleClick = e => {
    e.target.id = props.id
    console.log('emitting ovalClick: ', e.target.id)
    emit('ovalClick', e.target.id )
}

</script>

<style scoped>

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #79747E;
        height: 40px;
        padding: 8px;
        width: 200px;
        font-size: var(--bodyFont);
        font-weight: var(--bodyWeight);
        border-radius: 20px;
        background-color: var(--selected-background);
}

    button:hover {
        outline: 4px solid var(--outline);     
    }

    .button-label {
        margin: 0px auto;
    }

    .selected {
        background-color: var(--selected-background);
    }

    .success {
        background-color: var(--successBackground);
    }

    .none {
        background: none;
    }

</style>