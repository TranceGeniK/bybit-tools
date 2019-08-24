export default {
  name: 'limit-order-form',
  components: {},
  props: [],
  data: () => ({
    valid: true,
    form: {
      price: '',
      priceRules: [
        v => !!v || 'Price is required',
        v => !isNaN(v) || 'Price must be an number',
        v => !Number.isInteger(v) || 'Price must be an integer',
      ],
      takeProfit: '',
      takeProfitRules: [
        v => !isNaN(v) || 'Take Profit must be an number',
        v => !Number.isInteger(v) || 'Take Profit must be an integer',
      ],
      stopLoss: '',
      stopLossRules: [
        v => !isNaN(v) || 'Stop Loss must be an number',
        v => !Number.isInteger(v) || 'Stop Loss must be an integer',
      ],
      contracts: '',
      contractsRules: [
        v => !!v || 'Number of contracts is required',
        v => !isNaN(v) || 'Number of contracts must be an number',
        v => !Number.isInteger(v) || 'Number of contracts must be an integer',
      ],
      postOnly: false,
      reduceOnly: false,
    },
  }),
  computed: {

  },
  mounted () {

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
        symbol: 'BTCUSD',
        order_type: 'Limit',
        qty: this.form.contracts,
        price: this.form.price,
        time_in_force: this.form.postOnly ? 'PostOnly' : 'GoodTillCancel',
        reduce_only: this.form.reduceOnly,
      } ;
      if(this.form.takeProfit && i === 0) {
        order.take_profit = this.form.takeProfit ;
      }
      if(this.form.stopLoss  && i === 0) {
        order.stop_loss = this.form.stopLoss ;
      }
      return order ;
    },
    reset() {
      this.$refs.form.reset();
      this.preview = [];
    },
  }
}
