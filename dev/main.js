import Vue from 'vue'
import App from './App.vue'
import AdvancedVuetify from '@/main'
import vuetify from './plugins/vuetify'

Vue.config.performance = true;

Vue.use(AdvancedVuetify);

new Vue({
	vuetify,
	render: h => h(App)
}).$mount('#app');
