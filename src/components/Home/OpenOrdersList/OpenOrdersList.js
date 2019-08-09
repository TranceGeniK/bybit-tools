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
        {text: 'Updated at', value: 'updated_at'},
        {text: 'Cancel', value: 'cancel'},
      ]
    };
  },
  computed: {},
  mounted() {
  
  },
  methods: {},
};
