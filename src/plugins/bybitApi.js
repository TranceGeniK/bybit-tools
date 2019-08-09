import axios from 'axios';
import CryptoJS from 'crypto-js';

export default {
  install(Vue, defaultOptions = {}) {
    Vue.prototype.$bybitApi = new Vue({
      data: {
        apiKey: '',
        apiSecret: '',
        url: 'https://api.bybit.com/open-api/',
        wsUrl: 'wss://stream.bybit.com/realtime',
        ws: {},
        lastPrice: 0,
        openOrders: [],
      },
      methods: {
        init() {
          if(this.$bybitApi.apiKey && this.$bybitApi.apiSecret)
          {
            this.initWs();
            this.getOrders();
          }
        },
        initWs() {
          let expires = Date.now() + 1000;
          
          let signature = CryptoJS.HmacSHA256('GET/realtime' + expires,
              this.apiSecret).
              toString();
          
          this.ws = new WebSocket(`${this.wsUrl}`);
          
          this.ws.onopen = (e) => {
            this.ws.send(
                JSON.stringify({
                  'op': 'auth',
                  'args': [this.apiKey, expires, signature],
                }));
            this.ws.send('{"op":"subscribe","args":["order"]}');
            this.ws.send(
                '{"op":"subscribe","args":["instrument_info.100ms.BTCUSD"]}');
          };
          
          this.ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            switch (data.topic) {
              case 'instrument_info.100ms.BTCUSD' :
                this.setPrice(data);
                break;
              case 'order' :
                for(let i = 0; i < data.data.length; i++)
                {
                  if(data.data[i].order_status === 'Cancelled')
                  {
                    this.removeOrder(data.data[i]) ;
                  }
                  if(data.data[i].order_status === 'New')
                  {
                    this.addOrder(data.data[i]) ;
                  }
                }
                break ;
              default :
                console.log(data);
                break;
            }
          };
        },
        setPrice(data) {
          if (data.type === 'snapshot') {
            this.lastPrice = 'BTC $' +
                Number(data.data.last_price_e4 + 'e-4').toFixed(2);
          }
          if (data.type === 'delta') {
            if (data.data.update[0].last_price_e4) {
              this.lastPrice = 'BTC $' +
                  Number(data.data.update[0].last_price_e4 + 'e-4').toFixed(2);
            }
          }
        },
        async getOrders(page = 1) {
          try {
            let data = {
              'order_status': 'New',
              'symbol': 'BTCUSD',
              'page': page,
            };
            let options = {
              params: this.signData(data),
            };
            let res = await axios.get(this.url + 'order/list',
                options);
            if (res.data.ret_msg === 'ok') {
              this.openOrders = this.openOrders.concat(res.data.result.data);
              if(res.data.result.last_page > page)
              {
                await this.getOrders(page + 1) ;
              }
            }
            else {
              console.error(res) ;
            }
          } catch (e) {
            console.error(e);
          }
        },
        async placeOrder(data) {
          try {
            let res = await axios.post(this.url + 'order/create',
                this.signData(data));
            console.log(res);
          } catch (e) {
            console.error(e);
          }
        },
        async cancelOrder(id) {
          try {
            let data = {
              order_id : id
            } ;
            let res = await axios.post(this.url + 'order/cancel',
                this.signData(data));
          } catch (e) {
            console.error(e);
          }
        },
        async cancelAllOpenOrders() {
          for(let i = 0; i < this.openOrders.length; i++)
          {
            this.cancelOrder(this.openOrders[i].order_id) ;
          }
        },
        addOrder(order) {
          this.openOrders.push(order) ;
        },
        removeOrder(order) {
          console.log(order, this.openOrders) ;
          for(let i = 0; i < this.openOrders.length; i++) {
            if(this.openOrders[i].order_id === order.order_id)
            {
              this.openOrders.splice(i, 1) ;
            }
          }
        },
        signData(data) {
          data.api_key = this.apiKey;
          data.timestamp = Date.now();
          let dataString = this.objToString(this.sortObject(data));
          data.sign = CryptoJS.HmacSHA256(dataString, this.apiSecret).
              toString();
          return this.sortObject(data);
        },
        sortObject(o) {
          let sorted = {},
              key,
              a = [];
          for (key in o) {
            if (o.hasOwnProperty(key)) {
              a.push(key);
            }
          }
          a.sort();
          for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
          }
          return sorted;
        },
        objToString(data) {
          return Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
          }).join('&');
        },
      },
      created() {
        if (localStorage.apiKey) {
          this.apiKey = localStorage.apiKey;
        }
        if (localStorage.apiSecret) {
          this.apiSecret = localStorage.apiSecret;
        }
        this.init();
      },
      watch: {
        apiKey(apiKey) {
          localStorage.apiKey = apiKey;
        },
        apiSecret(apiSecret) {
          localStorage.apiSecret = apiSecret;
        },
      },
    });
  },
};
