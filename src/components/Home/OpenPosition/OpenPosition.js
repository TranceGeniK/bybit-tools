export default {
  name: 'open-position',
  components: {},
  props: [],
  data() {
    return {
      headers: [
        {text: 'Open Position', value: 'symbol'},
        {text: 'Qty', value: 'size'},
        {text: 'Value', value: 'position_value'},
        {text: 'Price', value: 'entry_price'},
        {text: 'Liq. Price', value: 'liq_price'},
        {text: 'Margin', value: 'position_margin'},
        {text: 'Leverage', value: 'leverage'},
        {text: 'Unrealized P&L (Mark Price)', value: 'unrealised_pnl'},
        {
          text: 'Unrealized P&L (Last Traded Price)',
          value: 'unrealised_pnl_last',
        },
        {text: 'Stop Loss', value: 'stop_loss'},
        {text: 'Take Profit', value: 'take_profit'},
        {text: 'Trailing Stop', value: 'trailing_stop'},
        {text: 'Market close', value: 'market_close'},
      ],
    };
  },
  computed: {},
  mounted() {
  
  },
  methods: {
    unrealised_pnl_last(price, qty, side) {
      if (side === 'Buy') {
        return ((1 / price) - (1 / parseFloat(this.$bybitApi.lastPrice))) * qty;
      } else {
        return ((1 / parseFloat(this.$bybitApi.lastPrice) - (1 / price))) * qty;
      }
    },
  },
};
