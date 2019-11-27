import Accounts from '../Accounts';

export default {
  name: 'drawer',
  components: {Accounts},
  props: ['value'],
  data () {
    return {
      account: {
        apiKey: '',
        apiSecret: '',
        label: '',
        isTestnet: false
      },
      dialog: false,
      valid: true,
    }
  },
  computed: {
  },
  mounted () {
    if(this.$bybitApi.account.apiKey && this.$bybitApi.account.apiSecret) {
      this.$emit('input', false) ;
    }
    else {
      this.$emit('input', true) ;
    }
  },
  methods: {
    addAccount() {
      this.$bybitApi.account = this.account ;
      this.$bybitApi.accounts.push(this.$bybitApi.account) ;
      if(this.$bybitApi.accounts.length > 1) {
        this.$bybitApi.changeAccount() ;
      }
      else {
        this.$bybitApi.init() ;
      }
      this.$emit('input', false) ;
    }
  },
  watch: {
  }
}
