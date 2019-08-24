import LadderOrdersForm from './LadderOrdersForm';
import LimitOrderForm from './LimitOrderForm';
import MarketOrderForm from './MarketOrderForm';
import OpenOrdersList from './OpenOrdersList';
import OpenPosition from './OpenPosition';

export default {
  name: 'home',
  components: {LadderOrdersForm, LimitOrderForm, MarketOrderForm, OpenOrdersList, OpenPosition},
  props: [],
  data () {
    return {
      orderTypeId: 0
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
  
  }
}
