import LadderOrdersForm from './LadderOrdersForm';
import LimitOrderForm from './LimitOrderForm';
import OpenOrdersList from './OpenOrdersList';
import OpenPosition from './OpenPosition';

export default {
  name: 'home',
  components: {LadderOrdersForm, LimitOrderForm, OpenOrdersList, OpenPosition},
  props: [],
  data () {
    return {
      orderTypeId: 1
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
  
  },
  watch: {
    orderType: function() {
      console.log(this.orderType) ;
    }
  }
}
