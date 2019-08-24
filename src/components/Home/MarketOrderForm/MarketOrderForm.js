export default {
  name: 'market-order-form',
  components: {},
  props: [],
  data: () => ({
    valid: true,
    form: {
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
        v => !!v || 'Quantity is required',
        v => !isNaN(v) || 'Quantity must be an number',
        v => !Number.isInteger(v) || 'Quantity must be an integer',
      ]
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
        order_type: 'Market',
        qty: this.form.contracts,
        time_in_force: 'GoodTillCancel'
      } ;
      if(this.form.takeProfit) {
        order.take_profit = this.form.takeProfit ;
      }
      if(this.form.stopLoss) {
        order.stop_loss = this.form.stopLoss ;
      }
      return order ;
    },
    reset() {
      this.$refs.form.reset();
    },
  }
}
