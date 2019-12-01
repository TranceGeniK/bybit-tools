export default {
  name: 'open-orders-list',
  components: {},
  props: [],
  data() {
    return {
      headers: [
        {text: 'Side', value: 'side'},
        {text: 'Qty', value: 'qty'},
        {text: 'Price', value: 'price'},
        {text: 'Type', value: 'order_type'},
        {text: 'Time In Force', value: 'time_in_force'},
        {text: 'Updated At', value: 'updated_at'},
        {text: 'Cancel', value: 'cancel'},
      ]
    };
  },
  computed: {},
  mounted() {
  
  },
  methods: {
    sum : function(items, prop){
      return items.reduce( function(a, b){
        return a + b[prop];
      }, 0);
    }
  },
};
