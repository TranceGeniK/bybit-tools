export default {
  name: 'trading-stops',
  components: {},
  props: [],
  data () {
    return {
      valid: true,
      stopLoss: this.$bybitApi.openPosition.stop_loss,
      takeProfit: this.$bybitApi.openPosition.take_profit,
      trailingStop: this.$bybitApi.openPosition.trailing_stop,
    }
  },
  computed: {
    formValidation: function() {
      return {
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
        trailingStopRules: [
          v => !v || v && !isNaN(v) || 'Trailing Stop must be an number',
          v => !v || v && (Number(v + 'e4') %
              Number(this.$bybitApi.currentTickSize + 'e4') === 0) ||
              'Trailing Stop must be a multiple of ' +
              this.$bybitApi.currentTickSize,
        ],
      };
    },
    tpProfit: function() {
      if (this.takeProfit && this.takeProfit != 0 && this.$bybitApi.openPosition.size) {
        let profit = Math.abs((1 / this.$bybitApi.openPosition.entry_price) -
            (1 / parseFloat(this.takeProfit))) * this.$bybitApi.openPosition.size;
        return profit.toFixed(4) + ' ≈ ' +
            (profit * this.$bybitApi.openPosition.entry_price).toFixed(2) + 'USD';
      }
    },
    slLoss: function() {
      if (this.stopLoss && this.stopLoss != 0 && this.$bybitApi.openPosition.size) {
        let loss = Math.abs((1 / this.$bybitApi.openPosition.entry_price) -
            (1 / parseFloat(this.stopLoss))) * this.$bybitApi.openPosition.size +
            (((this.$bybitApi.openPosition.size * 0.075) / 100) / this.stopLoss);
        return loss.toFixed(4) + ' ≈ ' +
            (loss * this.$bybitApi.openPosition.entry_price).toFixed(2) +
            'USD (including fees)';
      }
    },
  },
  mounted () {
  
  },
  methods: {
    submit: function() {
      this.$bybitApi.setTradingStops(this.takeProfit, this.stopLoss, this.trailingStop) ;
      this.$emit('close');
    }
  }
}
