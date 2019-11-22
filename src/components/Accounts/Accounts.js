export default {
  name: 'accounts',
  components: {},
  props: [],
  data () {
    return {
      headers: [
        {text: 'Label', value: 'label'},
        {text: 'Api Key', value: 'apiKey'},
        {text: 'Api Secret', value: 'apiSecret'},
        {text: 'Testnet', value: 'isTestnet'},
        {text: 'Remove', value: 'remove'}
      ],
      apiKeyRules: [
        (v) => !!v || 'Api key is required',
        (v) => v && v.length === 18 || 'Api key must be 18 characters'
      ],
      privateKeyRules: [
        (v) => !!v || 'Private Key is required',
        (v) => v && v.length === 36 || 'Private Key must be 36 characters'
      ],
      accountLabelRules: [
        (v) => !!v || 'Account Label is required'
      ],
      valid: true
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    add: function() {
      this.$bybitApi.accounts.push({
        label: '',
        apiKey: '',
        apiSecret: '',
        isTestnet: false
      }) ;
    },
    remove: function(item) {
      const index = this.$bybitApi.accounts.indexOf(item) ;
      this.$bybitApi.accounts.splice(index, 1);
    }
  }
}
