<template>
    <form class="form-wrapper"
      @submit.prevent="handleSubmit">
      <div class="form-area">
        <slot />
      </div>
      <div class="button-area">
        <button v-for="button in props.buttonList"
          :key="formButtons[button].id"
          :id="formButtons[button].id">
            {{ formButtons[button].label }}
        </button>
      </div>
    </form>
</template>

<script setup>
import { formButtons } from '@/data/mvpConfig.json'

const props = defineProps([
  'buttonList'
])

const handleSubmit = e => {
  e.preventDefault()
  console.log('formElement submitted by: ', e.submitter.id)
  console.log('keypressed: ', e.target.keypressed)
  console.log('submission object: ', e)
}

</script>

<style scoped>
.form-wrapper {
  display: grid;
  grid-template-areas: 
    "form-area"
    "button-area";
  grid-template-rows: 1fr 56px;
  height: 100%;
}

.form-area {
  grid-area: form-area;
  background-color: var(--neutral);
}

.button-area {
  grid-area: button-area;
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
</style>