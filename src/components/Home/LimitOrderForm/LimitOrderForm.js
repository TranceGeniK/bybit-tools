export default {
  name: 'limit-order-form',
  components: {},
  props: ['active'],
  data: () => ({
    valid: true,
    form: {
      price: '',
      takeProfit: '',
      stopLoss: '',
      contracts: '',
      timeInForceItems: [
        {
          value: 'GoodTillCancel',
          text: 'Good Till Cancel',
        },
        {
          value: 'ImmediateOrCancel',
          text: 'Immediate Or Cancel',
        },
        {
          value: 'FillOrKill',
          text: 'Fill Or Kill',
        },
        {
          value: 'PostOnly',
          text: 'Post Only',
        },
      ],
      time_in_force: 'PostOnly',
      reduceOnly: false,
    },
  }),
  computed: {
    formValidation: function() {
      return {
        priceRules: [
          v => !!v || 'Price is required',
          v => v && !isNaN(v) || 'Price must be an number',
          v => v && (Number(v + 'e4') %
              Number(this.$bybitApi.currentTickSize + 'e4') === 0) ||
              'Price must be a multiple of ' +
              this.$bybitApi.currentTickSize,
        ],
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
      if (this.form.price && this.form.takeProfit && this.form.contracts) {
        let profit = Math.abs(
            (1 / this.form.price) - (1 / parseFloat(this.form.takeProfit))) *
            this.form.contracts;
        return profit.toFixed(4) + ' ≈ ' +
            (profit * this.$bybitApi.lastPrice).toFixed(2) + 'USD';
      }
    },
    slLoss: function() {
      if (this.form.price && this.form.stopLoss && this.form.contracts) {
        let loss = Math.abs(
            (1 / this.form.price) - (1 / parseFloat(this.form.stopLoss))) *
            this.form.contracts +
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
        order_type: 'Limit',
        qty: this.form.contracts,
        price: this.form.price,
        time_in_force: this.form.time_in_force,
        reduce_only: this.form.reduceOnly,
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
            && this.form.price
            && this.form.stopLoss
            && this.form.takeProfit) {
          await this.$nextTick();
          if (this.$refs.form.validate()) {
            this.$emit('order', {
              price: this.form.price,
              stopLoss: this.form.stopLoss,
              takeProfit: this.form.takeProfit,
              orderType: 'limit',
            });
          }
        }
      },
    },
  },
};
