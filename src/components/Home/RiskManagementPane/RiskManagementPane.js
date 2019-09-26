export default {
  name: 'risk-management-pane',
  components: {},
  props: ['order'],
  data() {
    return {
      risk: 3,
    };
  },
  computed: {
    table: function() {
      return [
        {
          label: 'Available Margin',
          value: this.walletBalanceUSD,
        },
        {
          label: 'Entry Price',
          value: Number(this.order.price).toFixed(2),
        },
        {
          label: 'Contracts to trade',
          value: this.contractsToTrade,
        },
        {
          label: 'Leverage needed',
          value: Math.max((this.contractsToTrade / this.walletBalanceUSD), 1).
              toFixed(2),
        },
        {
          label: 'Distance Entry - Stop Loss',
          value: this.stopLossDistance.toFixed(2),
        },
        {
          label: 'Distance Entry - Stop Loss in %',
          value: this.stopLossDistancePercentage.toFixed(2),
        },
        {
          label: 'Maximum amount at risk without fees',
          value: this.riskAmount.toFixed(2),
        },
        {
          label: 'Fees (' + this.order.orderType +
              ' order entry - market order exit)',
          value: this.fees.toFixed(2),
        },
        {
          label: 'LOSS if Stopped Out',
          value: (this.riskAmount + this.fees).toFixed(2),
        },
        {
          label: 'Total % of Trading Budget',
          value: (100 * (this.riskAmount + this.fees) /
              this.walletBalanceUSD).toFixed(2),
        },
        {
          label: 'Distance Entry - Target Profit',
          value: this.targetProfitDistance.toFixed(2),
        },
        {
          label: 'Distance Entry - Target Profit in %',
          value: (100 * this.targetProfitDistancePercentage).toFixed(2),
        },
        {
          label: 'Profit (without fees)',
          value: this.targetProfitUSD.toFixed(2),
        },
        {
          label: 'Profit (including fees)',
          value: (this.targetProfitUSD - this.fees).toFixed(2),
        },
        {
          label: 'ROI',
          value: (100 * (this.targetProfitUSD - this.fees) /
              this.contractsToTrade).toFixed(2) + '%',
        },
        {
          label: 'Risk | Reward',
          value: ((this.targetProfitUSD - this.fees) /
              (this.riskAmount + this.fees)).toFixed(2),
        },
      ];
    },
    walletBalanceUSD: function() {
      return Math.round(
          this.$bybitApi.walletBalance * this.$bybitApi.lastPrice);
    },
    stopLossDistance: function() {
      return Math.abs(this.order.price - this.order.stopLoss);
    },
    stopLossDistancePercentage: function() {
      return this.stopLossDistance / this.order.price;
    },
    targetProfitDistance: function() {
      return Math.abs(this.order.takeProfit - this.order.price);
    },
    targetProfitDistancePercentage: function() {
      return this.targetProfitDistance / this.order.price;
    },
    targetProfitUSD: function() {
      return this.targetProfitDistancePercentage * this.contractsToTrade;
    },
    contractsToTrade: function() {
      return Math.round((this.percent(this.risk) * this.walletBalanceUSD) /
          this.stopLossDistancePercentage);
    },
    riskAmount: function() {
      return (this.walletBalanceUSD * this.percent(this.risk));
    },
    fees: function() {
      if (this.order.orderType === 'limit') {
        return this.contractsToTrade * 0.00075 - this.contractsToTrade *
            0.00025;
      } else {
        return this.contractsToTrade * 0.0015;
      }
    },
  },
  mounted() {
    // console.log(this.order);
    if (localStorage.risk) {
      this.risk = localStorage.risk;
    }
  },
  methods: {
    percent(value) {
      return value / 100;
    },
  },
  watch: {
    risk(risk) {
      localStorage.risk = risk;
    },
  },
};
