export default {
  name: 'header-comp',
  components: {},
  props: [],
  data() {
    return {
      increasing: false,
      decreasing: false,
    };
  },
  computed: {},
  mounted() {
  
  },
  methods: {},
  watch: {
    '$bybitApi.lastPrice': function(newPrice, oldPrice) {
      if (newPrice > oldPrice) {
        this.increasing = true;
        this.decreasing = false;
      } else {
        this.increasing = false;
        this.decreasing = true;
      }
    },
  },
};
