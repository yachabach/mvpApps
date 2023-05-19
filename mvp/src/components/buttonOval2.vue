<template>
    <section>
        <button
            id="id"
            :disabled="disabled"
            @click="handleClick">
            <div class="button-label">
                <ButtonStatus
                    :config="config" 
                    :success="success"/>                
            </div>
        </button>   
        <p v-if="!success">{{ config.remedy }}</p>     
        <p v-if="success & config.guidance">{{ config.guidance }}</p>     
    </section>
</template>

<script setup>
import ButtonStatus from '@/components/statusLine.vue'

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
    // e.preventDefault()
    e.target.id = props.id
    emit('ovalClick', e.target.id )
}

</script>

<style scoped>

    button {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #79747E;
        height: 40px;
        padding: 8px;
        width: fit-content;
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

    .none {
        background: none;
    }

</style>