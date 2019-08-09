import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import bybitApi from './plugins/bybitApi'

Vue.use(bybitApi) ;

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
