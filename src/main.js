import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import cn from './locales/cn.json';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    cn
  }
});

const app = createApp(App)

app.use(ElementPlus)
app.use(i18n)

app.mount('#app')