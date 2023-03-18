<template>
  <section class="card-foundation">
    <div>
      <span>
          <button class="button-list" @click="handleConnectPort">Connect Port</button>
          {{ portOpenStatus }}
      </span>      
    </div>

  </section>
</template>

<script setup>
import { usePortStore } from '../common/portStore.js'
import { storeToRefs } from 'pinia'

const { portOpenStatus } = storeToRefs(usePortStore())
const { changeActivePort } = usePortStore()

const handleConnectPort = () => {
    changeActivePort()
}
</script>

<style>

</style>