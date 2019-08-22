export default {
  install(Vue, defaultOptions = {}) {
    Vue.prototype.$ui = new Vue({
      data: {
        showTvChart: false,
        showOpenPosition: true
      },
      methods: {
      },
      created() {
        if (localStorage.showTvChart !== undefined) {
          this.showTvChart = localStorage.showTvChart  === 'true';
        }
        if (localStorage.showOpenPosition !== undefined) {
          this.showOpenPosition = localStorage.showOpenPosition  === 'true';
        }
      },
      watch: {
        showTvChart(showTvChart) {
          localStorage.showTvChart = showTvChart;
        },
        showOpenPosition(showOpenPosition) {
          localStorage.showOpenPosition = showOpenPosition;
        },
      },
    });
  },
};
