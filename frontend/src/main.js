import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'bootstrap/dist/js/bootstrap.js';
import App from './App.vue';
import router from './router';

createApp(App).use(createPinia()).use(router).mount('#app');
