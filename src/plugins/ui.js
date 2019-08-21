export default {
  install(Vue, defaultOptions = {}) {
    Vue.prototype.$ui = new Vue({
      data: {
        showTvChart: false
      },
      methods: {
      },
      created() {
        if (localStorage.showTvChart !== undefined) {
          this.showTvChart = localStorage.showTvChart;
        }
      },
      watch: {
        showTvChart(showTvChart) {
          localStorage.showTvChart = showTvChart;
        },
      },
    });
  },
};
