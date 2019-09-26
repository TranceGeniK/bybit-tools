import LadderOrdersForm from './LadderOrdersForm';
import LimitOrderForm from './LimitOrderForm';
import MarketOrderForm from './MarketOrderForm';
import OpenOrdersList from './OpenOrdersList';
import OpenPosition from './OpenPosition';
import RiskManagementPane from './RiskManagementPane';

export default {
  name: 'home',
  components: {
    LadderOrdersForm,
    LimitOrderForm,
    MarketOrderForm,
    OpenOrdersList,
    OpenPosition,
    RiskManagementPane
  },
  props: [],
  data() {
    return {
      orderTypeId: 0,
      expandTv: false,
      order: {}
    };
  },
  computed: {
    tvStyleSmall: function() {
      return {
        'max-height': 'calc(100vh - 64px - 48px' +
            (this.$ui.showOpenPosition && this.$bybitApi.openPosition ? ' - 61px)' : ')'),
      };
    },
    tvStyleBig: function() {
      return {
        'height': 'calc(100vh - 64px - 48px' +
            (this.$ui.showOpenPosition && this.$bybitApi.openPosition ? ' - 61px)' : ')'),
      };
    },
  },
  mounted() {
  
  },
  methods: {},
  watch: {
    orderTypeId: function() {
      this.order = {} ;
    }
  }
};
