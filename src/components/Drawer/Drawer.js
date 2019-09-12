export default {
  name: 'drawer',
  components: {},
  props: ['value'],
  data () {
    return {
      apiKeyRules: [
        (v) => !!v || 'Api key is required',
        (v) => v && v.length === 18 || 'Api key must be 18 characters'
      ],
      privateKeyRules: [
        (v) => !!v || 'Private Key is required',
        (v) => v && v.length === 36 || 'Private Key must be 36 characters'
      ],
      valid: true
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
