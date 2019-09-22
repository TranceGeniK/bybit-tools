export default {
  name: 'preview-orders',
  components: {},
  props: ['orders'],
  data() {
    return {
      headers: [
        {text: 'Side', value: 'side'},
        // {text: 'Symbol', value: 'symbol'},
        // {text: 'Order Type', value: 'order_type'},
        {text: 'Qty', value: 'qty'},
        {text: 'Price', value: 'price'},
        {text: 'Take Profit', value: 'take_profit'},
        {text: 'Stop Loss', value: 'stop_loss'},
        {text: 'Time In Force', value: 'time_in_force'},
        // {text: 'Reduce Only', value: 'reduce_only'},
      ],
      totalQty : 0
    };
  },
  computed: {
    average: function() {
      let totalAll = 0;
      this.totalQty = 0;
      for (let i = 0; i < this.orders.length; i++) {
        totalAll += this.orders[i].qty * this.orders[i].price;
        this.totalQty += this.orders[i].qty;
      }
      return (totalAll / this.totalQty).toFixed(2);
    },
    tpProfit: function() {
      if (this.average && this.orders[0].take_profit && this.totalQty) {
        let profit = Math.abs(
            (1 / this.average) - (1 / parseFloat(this.orders[0].take_profit))) *
            this.totalQty;
        return profit.toFixed(4) + ' ≈ ' +
            (profit * this.$bybitApi.lastPrice).toFixed(2) + 'USD';
      }
    },
    slLoss: function() {
      if (this.average && this.orders[0].stop_loss && this.totalQty) {
        let loss = Math.abs(
            (1 / this.average) - (1 / parseFloat(this.orders[0].stop_loss))) *
            this.totalQty + (((this.totalQty * 0.075) / 100) / this.orders[0].stop_loss);
        return loss.toFixed(4) + ' ≈ ' +
            (loss * this.$bybitApi.lastPrice).toFixed(2) + 'USD (including fees)';
      }
    },
  },
  mounted() {
  
  },
  methods: {},
};
