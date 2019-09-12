export default {
  name: 'header-comp',
  components: {},
  props: [],
  data() {
    return {
      lastPriceIncreasing: false,
      lastPriceDecreasing: false,
      markPriceIncreasing: false,
      markPriceDecreasing: false,
      symbolIndex: this.$bybitApi.availableSymbols.indexOf(
          this.$bybitApi.currentSymbol),
    };
  },
  computed: {},
  mounted() {
  
  },
  methods: {},
  watch: {
    '$bybitApi.lastPrice': function(newPrice, oldPrice) {
      if (newPrice > oldPrice) {
        this.lastPriceIncreasing = true;
        this.lastPriceDecreasing = false;
      } else {
        this.lastPriceIncreasing = false;
        this.lastPriceDecreasing = true;
      }
    },
    '$bybitApi.markPrice': function(newPrice, oldPrice) {
      if (newPrice > oldPrice) {
        this.markPriceIncreasing = true;
        this.markPriceDecreasing = false;
      } else {
        this.markPriceIncreasing = false;
        this.markPriceDecreasing = true;
      }
    },
    symbolIndex: function() {
      this.$bybitApi.changeSymbol(this.$bybitApi.availableSymbols[this.symbolIndex]);
    },
  },
};
