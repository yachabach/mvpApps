import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

console.log('Starting Main.js')

const app = createApp(App).use(router).use(createPinia())

app.mount('#app')
