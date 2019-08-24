export default {
  name: 'preview-orders',
  components: {},
  props: ['orders'],
  data () {
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
      ]
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {

  }
}
