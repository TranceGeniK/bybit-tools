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
    };
  },
  computed: {
    average: function() {
      let totalAll = 0;
      let totalQty = 0;
      for (let i = 0; i < this.orders.length; i++) {
        totalAll += this.orders[i].qty * this.orders[i].price;
        totalQty += this.orders[i].qty;
      }
      return (totalAll / totalQty).toFixed(2);
    },
  },
  mounted() {
  
  },
  methods: {},
};
