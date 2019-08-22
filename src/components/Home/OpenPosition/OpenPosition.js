export default {
  name: 'open-position',
  components: {},
  props: [],
  data () {
    return {
      headers: [
        {text: 'Open Position', value: 'symbol'},
        {text: 'Qty', value: 'size'},
        {text: 'Value', value: 'position_value'},
        {text: 'Price', value: 'entry_price'},
        {text: 'Liq. Price', value: 'liq_price'},
        {text: 'Margin', value: 'position_margin'},
        {text: 'Leverage', value: 'leverage'},
        {text: 'Unrealized P&L', value: 'unrealised_pnl'},
        {text: 'Stop Loss', value: 'stop_loss'},
        {text: 'Take Profit', value: 'take_profit'},
        {text: 'Trailing Stop', value: 'trailing_stop'}
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
