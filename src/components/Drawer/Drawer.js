export default {
  name: 'drawer',
  components: {},
  props: ['value'],
  data () {
    return {
    }
  },
  computed: {

  },
  mounted () {
    if(this.$bybitApi.apiKey && this.$bybitApi.apiSecret) {
      this.$emit('input', false) ;
    }
    else {
      this.$emit('input', true) ;
    }
  },
  methods: {
    init() {
      this.$bybitApi.init() ;
      this.$emit('input', false) ;
    }
  },
  watch: {
  }
}
