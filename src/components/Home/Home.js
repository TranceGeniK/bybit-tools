import LadderOrdersForm from './LadderOrdersForm';
import LimitOrderForm from './LimitOrderForm';
import MarketOrderForm from './MarketOrderForm';
import OpenOrdersList from './OpenOrdersList';
import OpenPosition from './OpenPosition';

export default {
  name: 'home',
  components: {
    LadderOrdersForm,
    LimitOrderForm,
    MarketOrderForm,
    OpenOrdersList,
    OpenPosition,
  },
  props: [],
  data() {
    return {
      orderTypeId: 0,
      expandTv : false,
      tvStyleSmall: {
        'max-height': 'calc(100vh - 64px - 48px' + (this.$ui.showOpenPosition ? ' - 61px)' : ')')
      },
      tvStyleBig: {
        'height': 'calc(100vh - 175px)'
      }
    };
  },
  computed: {},
  mounted() {
  
  },
  methods: {},
};
