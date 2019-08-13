import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

import Notifications from 'vue-notification';

Vue.use(Notifications);

import bybitApi from './plugins/bybitApi';

Vue.use(bybitApi);

import ui from './plugins/ui';

Vue.use(ui);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: function(h) { return h(App); },
}).$mount('#app');
