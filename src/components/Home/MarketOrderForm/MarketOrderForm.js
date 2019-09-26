export default {
  name: 'market-order-form',
  components: {},
  props: ['active'],
  data: () => ({
    valid: true,
    form: {
      takeProfit: '',
      stopLoss: '',
      contracts: '',
    },
  }),
  computed: {
    formValidation: function() {
      return {
        takeProfitRules: [
          v => !v || v && !isNaN(v) || 'Take Profit must be an number',
          v => !v || v && (Number(v + 'e4') %
              Number(this.$bybitApi.currentTickSize + 'e4') === 0) ||
              'Take Profit must be a multiple of ' +
              this.$bybitApi.currentTickSize,
        ],
        stopLossRules: [
          v => !v || v && !isNaN(v) || 'Stop Loss must be an number',
          v => !v || v && (Number(v + 'e4') %
              Number(this.$bybitApi.currentTickSize + 'e4') === 0) ||
              'Stop Loss must be a multiple of ' +
              this.$bybitApi.currentTickSize,
        ],
        contractsRules: [
          v => !!v || 'Quantity is required',
          v => v && !isNaN(v) || 'Quantity must be an number',
          v => v && (Number(v + 'e4') %
              Number(this.$bybitApi.currentQtyStep + 'e4') === 0) ||
              'Quantity must be a multiple of ' +
              this.$bybitApi.currentQtyStep,
        ],
      };
    },
    tpProfit: function() {
      if (this.form.takeProfit && this.form.contracts) {
        let profit = Math.abs((1 / this.$bybitApi.lastPrice) -
            (1 / parseFloat(this.form.takeProfit))) * this.form.contracts;
        return profit.toFixed(4) + ' ≈ ' +
            (profit * this.$bybitApi.lastPrice).toFixed(2) + 'USD';
      }
    },
    slLoss: function() {
      if (this.form.stopLoss && this.form.contracts) {
        let loss = Math.abs((1 / this.$bybitApi.lastPrice) -
            (1 / parseFloat(this.form.stopLoss))) * this.form.contracts +
            (((this.form.contracts * 0.075) / 100) / this.form.stopLoss);
        return loss.toFixed(4) + ' ≈ ' +
            (loss * this.$bybitApi.lastPrice).toFixed(2) +
            'USD (including fees)';
      }
    },
  },
  mounted() {
  
  },
  methods: {
    sell() {
      if (this.$refs.form.validate()) {
        this.$bybitApi.placeOrder(this.getOrder('Sell'));
      }
    },
    buy() {
      if (this.$refs.form.validate()) {
        this.$bybitApi.placeOrder(this.getOrder('Buy'));
      }
    },
    getOrder(side) {
      let order = {
        side: side,
        symbol: this.$bybitApi.currentSymbol,
        order_type: 'Market',
        qty: this.form.contracts,
        time_in_force: 'GoodTillCancel',
      };
      if (this.form.takeProfit) {
        order.take_profit = this.form.takeProfit;
      }
      if (this.form.stopLoss) {
        order.stop_loss = this.form.stopLoss;
      }
      return order;
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  watch: {
    form: {
      deep: true,
      handler: async function() {
        if (this.active
            && this.form.stopLoss
            && this.form.takeProfit) {
          await this.$nextTick();
          if (this.$refs.form.validate()) {
            this.$emit('order', {
              price: this.$bybitApi.lastPrice,
              stopLoss: this.form.stopLoss,
              takeProfit: this.form.takeProfit,
              orderType: 'market',
            });
          }
        }
      },
    },
    '$bybitApi.lastPrice': async function() {
      if (this.active
          && this.form.stopLoss
          && this.form.takeProfit) {
        await this.$nextTick();
        if (this.$refs.form.validate()) {
          this.$emit('order', {
            price: this.$bybitApi.lastPrice,
            stopLoss: this.form.stopLoss,
            takeProfit: this.form.takeProfit,
            orderType: 'market',
          });
        }
      }
    },
  },
};
