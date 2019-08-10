import PreviewOrders from './PreviewOrders';

export default {
  name: 'orders-form',
  components: {PreviewOrders},
  props: [],
  data: () => ({
    valid: true,
    form: {
      startPrice: '',
      startPriceRules: [
        v => !!v || 'Start Price is required',
        v => !isNaN(v) || 'Start Price must be an number',
        v => !Number.isInteger(v) || 'Start Price must be an integer',
      ],
      endPrice: '',
      endPriceRules: [
        v => !!v || 'End Price is required',
        v => !isNaN(v) || 'End Price must be an number',
        v => !Number.isInteger(v) || 'End Price must be an integer',
      ],
      contracts: '',
      contractsRules: [
        v => !!v || 'Number of contracts is required',
        v => !isNaN(v) || 'Number of contracts must be an number',
        v => !Number.isInteger(v) || 'Number of contracts must be an integer',
      ],
      orders: '',
      ordersRules: [
        v => !!v || 'Number of orders is required',
        v => !isNaN(v) || 'Number of orders must be an number',
        v => !Number.isInteger(v) || 'Number of orders must be an integer',
        v => v >= 2 || 'Number of orders must be above 2',
      ],
      scale: 'Linear',
      scaleItems: [
        'Linear',
        // 'Increasing',
        // 'Decreasing',
      ],
      postOnly : false,
      reduceOnly: false
    },
    preview: [],
    orders: [],
  }),
  
  methods: {
    previewSell() {
      if (this.$refs.form.validate()) {
        this.orders = [] ;
        this.preview = [] ;
        this.calculateOrders('Sell');
        this.preview = this.orders ;
      }
    },
    previewBuy() {
      if (this.$refs.form.validate()) {
        this.orders = [] ;
        this.preview = [] ;
        this.calculateOrders('Buy');
        this.preview = this.orders ;
      }
    },
    sell() {
      if (this.$refs.form.validate()) {
        this.orders = [] ;
        this.preview = [] ;
        this.calculateOrders('Sell');
        this.placeOrders() ;
      }
    },
    buy() {
      if (this.$refs.form.validate()) {
        this.orders = [] ;
        this.preview = [] ;
        this.calculateOrders('Buy');
        this.placeOrders() ;
      }
    },
    calculateOrders(side) {
      // contracts = q1 x startPrice + q1 x (startPrice + delta) + 2 x q1 x (startPrice + 3 x delta) + 2 x q1 x (startPrice + 5 x delta) + ... + n x q1 x lastPrice ;
      for (let i = 0; i < this.form.orders; i++) {
        this.orders.push({
          side: side,
          symbol: 'BTCUSD',
          order_type: 'Limit',
          qty: Math.round(this.form.contracts / this.form.orders),
          price: Math.round(parseInt(this.form.startPrice) - i *
              (this.form.startPrice - this.form.endPrice) / (this.form.orders - 1)),
          time_in_force: this.form.postOnly ? 'PostOnly' : 'GoodTillCancel',
          reduce_only : this.form.reduceOnly
        });
      }
    },
    placeOrders() {
      for(let i = 0 ; i < this.orders.length ; i++)
      {
        this.$bybitApi.placeOrder(this.orders[i]) ;
      }
    },
    reset() {
      this.$refs.form.reset();
      this.preview = [];
    },
  },
  computed: {},
  mounted() {
  
  },
};
