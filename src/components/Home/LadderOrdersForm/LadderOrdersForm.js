import PreviewOrders from './PreviewOrders';
import {ORDER_DISTRIBUTIONS} from './constants';
import {generateOrders} from './scaledOrderGenerator';

export default {
  name: 'ladder-orders-form',
  components: {PreviewOrders},
  props: [],
  data: () => ({
    valid: true,
    form: {
      higherPrice: '',
      higherPriceRules: [
        v => !!v || 'Higher Price is required',
        v => !isNaN(v) || 'Higher Price must be an number',
        v => !Number.isInteger(v) || 'Higher Price must be an integer',
      ],
      lowerPrice: '',
      lowerPriceRules: [
        v => !!v || 'Lower Price is required',
        v => !isNaN(v) || 'Lower Price must be an number',
        v => !Number.isInteger(v) || 'Lower Price must be an integer',
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
      orders: '',
      ordersRules: [
        v => !!v || 'Number of orders is required',
        v => !isNaN(v) || 'Number of orders must be an number',
        v => !Number.isInteger(v) || 'Number of orders must be an integer',
        v => v >= 2 || 'Number of orders must be above 2',
      ],
      scale: ORDER_DISTRIBUTIONS.INCREASING.label,
      scaleItems: [
        ORDER_DISTRIBUTIONS.FLAT.label,
        ORDER_DISTRIBUTIONS.INCREASING.label,
        ORDER_DISTRIBUTIONS.DECREASING.label,
      ],
      coefficient: '10',
      coefficientRules: [
        v => !isNaN(v) || 'Coefficient must be an number',
        v => !Number.isInteger(v) || 'Coefficient must be an integer',
        v => parseInt(v) >= 1 || 'Coefficient must be greater than 1',
      ],
      postOnly: false,
      reduceOnly: false,
    },
    preview: [],
    orders: [],
  }),
  
  methods: {
    previewSell() {
      if (this.$refs.form.validate()) {
        this.orders = [];
        this.preview = [];
        this.calculateOrders('Sell');
        this.preview = this.orders;
      }
    },
    previewBuy() {
      if (this.$refs.form.validate()) {
        this.orders = [];
        this.preview = [];
        this.calculateOrders('Buy');
        this.preview = this.orders;
      }
    },
    sell() {
      if (this.$refs.form.validate()) {
        this.orders = [];
        this.preview = [];
        this.calculateOrders('Sell');
        this.placeOrders();
      }
    },
    buy() {
      if (this.$refs.form.validate()) {
        this.orders = [];
        this.preview = [];
        this.calculateOrders('Buy');
        this.placeOrders();
      }
    },
    calculateOrders(side) {
      let orders = generateOrders({
        amount: this.form.contracts,
        orderCount: this.form.orders,
        priceLower: parseInt(this.form.lowerPrice),
        priceUpper: parseInt(this.form.higherPrice),
        distribution: side === 'Sell' ? this.form.scale : (this.form.scale ===
        ORDER_DISTRIBUTIONS.FLAT.label ? ORDER_DISTRIBUTIONS.FLAT.label :
            (this.form.scale === ORDER_DISTRIBUTIONS.INCREASING.label
                ? ORDER_DISTRIBUTIONS.DECREASING.label
                : ORDER_DISTRIBUTIONS.INCREASING.label)),
        tickSize: 1,
        coefficient : parseInt(this.form.coefficient)
      });
      if (side === 'Buy') {
        for (let i = orders.length - 1; i >= 0; i--) {
          let order  = {
            side: side,
            symbol: 'BTCUSD',
            order_type: 'Limit',
            qty: orders[i].amount,
            price: orders[i].price,
            time_in_force: this.form.postOnly ? 'PostOnly' : 'GoodTillCancel',
            reduce_only: this.form.reduceOnly,
          } ;
          if(this.form.takeProfit && i === orders.length - 1) {
            order.take_profit = this.form.takeProfit ;
          }
          if(this.form.stopLoss  && i === orders.length - 1) {
            order.stop_loss = this.form.stopLoss ;
          }
          this.orders.push(order);
        }
      } else {
        for (let i = 0; i < orders.length; i++) {
          let order = {
            side: side,
            symbol: 'BTCUSD',
            order_type: 'Limit',
            qty: orders[i].amount,
            price: orders[i].price,
            time_in_force: this.form.postOnly ? 'PostOnly' : 'GoodTillCancel',
            reduce_only: this.form.reduceOnly,
          } ;
          if(this.form.takeProfit && i === 0) {
            order.take_profit = this.form.takeProfit ;
          }
          if(this.form.stopLoss  && i === 0) {
            order.stop_loss = this.form.stopLoss ;
          }
          this.orders.push(order);
        }
      }
    },
    placeOrders() {
      for (let i = 0; i < this.orders.length; i++) {
        this.$bybitApi.placeOrder(this.orders[i]);
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
