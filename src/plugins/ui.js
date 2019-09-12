export default {
  install(Vue, defaultOptions = {}) {
    Vue.prototype.$ui = new Vue({
      data: {
        showTvChart: false,
        showOpenPosition: true,
        chartsIds: {
          "BTCUSD" : '',
          "ETHUSD" : '',
          "EOSUSD" : '',
          "XRPUSD" : ''
        }
      },
      methods: {},
      created() {
        if (localStorage.showTvChart !== undefined) {
          this.showTvChart = localStorage.showTvChart === 'true';
        }
        if (localStorage.showOpenPosition !== undefined) {
          this.showOpenPosition = localStorage.showOpenPosition === 'true';
        }
        if (localStorage.chartsIds !== undefined) {
          this.chartsIds = JSON.parse(localStorage.chartsIds);
        }
      },
      watch: {
        showTvChart(showTvChart) {
          localStorage.showTvChart = showTvChart;
        },
        chartsIds: {
          deep: true,
          handler(chartsIds) {
            localStorage.chartsIds = JSON.stringify(chartsIds);
          }
        },
        showOpenPosition(showOpenPosition) {
          localStorage.showOpenPosition = showOpenPosition;
          if (showOpenPosition) {
            this.$bybitApi.initPositionInterval();
          } else {
            this.$bybitApi.disablePositionInterval();
          }
        },
      },
    });
  },
};
