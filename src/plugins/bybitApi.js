import axios from 'axios';
import CryptoJS from 'crypto-js';

export default {
  install(Vue, defaultOptions = {}) {
    Vue.prototype.$bybitApi = new Vue({
      data: {
        apiKey: '',
        apiSecret: '',
        isTestnet: false,
        url: 'https://api.bybit.com/',
        wsUrl: 'wss://stream.bybit.com/realtime',
        ws: {},
        lastPrice: 0,
        openOrders: [],
        openPosition: null,
        currentSymbol : 'BTCUSD',
        urls: {
          mainnet: {
            url: 'https://api.bybit.com/',
            wsUrl: 'wss://stream.bybit.com/realtime',
          },
          testnet: {
            url: 'https://api-testnet.bybit.com/',
            wsUrl: 'wss://stream-testnet.bybit.com/realtime',
          },
        },
        positionInterval : undefined
      },
      methods: {
        init() {
          if (this.apiKey && this.apiSecret) {
            if (this.isTestnet) {
              this.url = this.urls.testnet.url ;
              this.wsUrl = this.urls.testnet.wsUrl ;
            }
            else {
              this.url = this.urls.mainnet.url ;
              this.wsUrl = this.urls.mainnet.wsUrl ;
            }
            this.initWs();
            this.getOrders();
            this.positionInterval = setInterval(this.getPosition, 1050) ;
          }
        },
        initWs() {
          this.ws = new WebSocket(`${this.wsUrl}`);
          
          this.ws.onopen = (e) => {
            let expires = Date.now() + 1500;
            
            let signature = CryptoJS.HmacSHA256('GET/realtime' + expires,
                this.apiSecret).
                toString();
            
            this.ws.send(
                JSON.stringify({
                  'op': 'auth',
                  'args': [this.apiKey, expires, signature],
                }));
            
            setTimeout(() => {
              this.ws.send('{"op":"subscribe","args":["order"]}');
              // this.ws.send('{"op":"subscribe","args":["position"]}');
            }, 500);
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
                for (let i = 0; i < data.data.length; i++) {
                  if (data.data[i].order_status === 'Cancelled'
                      || data.data[i].order_status === 'Rejected'
                      || data.data[i].order_status === 'Filled') {
                    this.removeOrder(data.data[i]);
                  }
                  if (data.data[i].order_status === 'New'
                      || data.data[i].order_status === 'PartiallyFilled') {
                    this.addOrder(data.data[i]);
                  }
                }
                break;
              default :
                console.log(data);
                break;
            }
          };
        },
        setPrice(data) {
          if (data.type === 'snapshot') {
            this.lastPrice = Number(data.data.last_price_e4 + 'e-4').toFixed(2);
          }
          if (data.type === 'delta') {
            if (data.data.update[0].last_price_e4) {
              this.lastPrice = Number(data.data.update[0].last_price_e4 + 'e-4').toFixed(2);
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
            let res = await axios.get(this.url + 'open-api/order/list',
                options);
            if (res.data.ret_msg === 'ok') {
              this.openOrders = this.openOrders.concat(res.data.result.data);
              if (res.data.result.last_page > page) {
                await this.getOrders(page + 1);
              }
            } else {
              console.error(res);
              this.$notify({
                text: res.data.ret_msg,
                type: 'error',
              });
            }
          } catch (e) {
            console.error(e);
          }
        },
        async getPosition() {
          try {
            let data = {};
            let options = {
              params: this.signData(data)
            };
            let res = await axios.get(this.url + 'position/list',
                options);
            if (res.data.ret_msg === 'ok') {
              // console.log(res.data.result.filter(pos => pos.symbol === this.currentSymbol && pos.size > 0)) ;
              this.openPosition = res.data.result.filter(pos => pos.symbol === this.currentSymbol && pos.size > 0)[0] ;
            } else {
              console.error(res);
              this.$notify({
                text: res.data.ret_msg,
                type: 'error',
              });
            }
          } catch (e) {
            console.error(e);
          }
        },
        async placeOrder(data) {
          try {
            let res = await axios.post(this.url + 'open-api/order/create',
                this.signData(data));
            console.log(res);
            if (res.data.ret_msg === 'ok') {
              this.$notify({
                text: 'Order placed',
                type: 'success',
              });
            } else {
              this.$notify({
                text: res.data.ret_msg,
                type: 'error',
              });
            }
            
          } catch (e) {
            console.error(e);
            this.$notify({
              text: e,
              type: 'error',
            });
          }
        },
        async cancelOrder(id) {
          try {
            let data = {
              order_id: id,
            };
            let res = await axios.post(this.url + 'open-api/order/cancel',
                this.signData(data));
            if (res.data.ret_msg === 'ok') {
              this.$notify({
                text: 'Order cancelled',
                type: 'success',
              });
            } else {
              this.$notify({
                text: res.data.ret_msg,
                type: 'error',
              });
            }
          } catch (e) {
            console.error(e);
          }
        },
        async cancelAllOpenOrders() {
          for (let i = 0; i < this.openOrders.length; i++) {
            this.cancelOrder(this.openOrders[i].order_id);
          }
        },
        addOrder(order) {
          let exists = false;
          order.updated_at = order.timestamp;
          for (let i = 0; i < this.openOrders.length; i++) {
            if (this.openOrders[i].order_id === order.order_id) {
              exists = true;
              this.$set(this.openOrders, i, order);
            }
          }
          if (!exists) {
            this.openOrders.push(order);
          }
        },
        removeOrder(order) {
          console.log(order, this.openOrders);
          for (let i = 0; i < this.openOrders.length; i++) {
            if (this.openOrders[i].order_id === order.order_id) {
              this.openOrders.splice(i, 1);
            }
          }
        },
        signData(data) {
          data.api_key = this.apiKey;
          data.timestamp = Date.now() - 500;
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
          this.apiKey = localStorage.apiKey.trim();
        }
        if (localStorage.apiSecret) {
          this.apiSecret = localStorage.apiSecret.trim();
        }
        if (localStorage.isTestnet !== undefined) {
          this.isTestnet = localStorage.isTestnet === 'true';
        }
        this.init();
      },
      watch: {
        apiKey(apiKey) {
          this.apiKey = apiKey.trim();
          localStorage.apiKey = apiKey.trim();
        },
        apiSecret(apiSecret) {
          this.apiSecret = apiSecret.trim();
          localStorage.apiSecret = apiSecret.trim();
        },
        isTestnet(isTestnet) {
          this.isTestnet = isTestnet;
          localStorage.isTestnet = isTestnet;
        },
      },
    });
  },
};
