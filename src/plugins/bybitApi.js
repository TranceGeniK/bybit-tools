import axios from 'axios';
import CryptoJS from 'crypto-js';
import ReconnectingWebSocket from 'reconnecting-websocket';

export default {
  install(Vue, defaultOptions = {}) {
    Vue.prototype.$bybitApi = new Vue({
      data: {
        account: {
          apiKey: '',
          apiSecret: '',
          label: '',
          isTestnet: false,
        },
        accounts: [],
        autoconnect: true,
        
        url: 'https://api.bybit.com/',
        wsUrl: 'wss://stream.bybit.com/realtime',
        ws: null,
        lastPrice: 0,
        markPrice: 0,
        walletBalance: 0,
        openOrders: [],
        openPosition: null,
        availableSymbols: ['BTCUSD', 'ETHUSD'],
        currentSymbol: 'BTCUSD',
        currentTickSize: 0.5,
        currentQtyStep: 1,
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
        positionInterval: undefined,
      },
      methods: {
        init() {
          if (this.account.apiKey && this.account.apiSecret &&
              this.autoconnect) {
            if (this.account.isTestnet) {
              this.url = this.urls.testnet.url;
              this.wsUrl = this.urls.testnet.wsUrl;
            } else {
              this.url = this.urls.mainnet.url;
              this.wsUrl = this.urls.mainnet.wsUrl;
            }
            this.initWs();
            this.updateInstrumentDetails();
            this.getOrders();
            this.initPositionInterval();
          }
        },
        changeSymbol(symbol) {
          if (this.ws) {
            this.ws.close();
          }
          this.lastPrice = 0;
          this.markPrice = 0;
          this.walletBalance = 0;
          this.openOrders = [];
          this.openPosition = null;
          this.currentSymbol = symbol;
          this.init();
        },
        changeAccount() {
          if (this.ws) {
            this.ws.close();
          }
          this.lastPrice = 0;
          this.markPrice = 0;
          this.walletBalance = 0;
          this.openOrders = [];
          this.openPosition = null;
          this.init();
        },
        async updateInstrumentDetails() {
          let res = await axios.get(this.url + 'v2/public/symbols');
          this.availableSymbols = res.data.result.map(el => el.name);
          if (res.data.ret_msg === 'OK') {
            let symbolInfos = res.data.result.find(
                el => el.name === this.currentSymbol);
            this.currentTickSize = parseFloat(
                symbolInfos.price_filter.tick_size);
            this.currentQtyStep = parseFloat(
                symbolInfos.lot_size_filter.qty_step);
          }
        },
        initWs() {
          this.ws = new ReconnectingWebSocket(`${this.wsUrl}`);
          
          this.ws.onopen = (e) => {
            let expires = Date.now() + 1500;
            
            let signature = CryptoJS.HmacSHA256('GET/realtime' + expires,
                this.account.apiSecret).
                toString();
            
            this.ws.send(
                JSON.stringify({
                  'op': 'auth',
                  'args': [this.account.apiKey, expires, signature],
                }));
            
            setTimeout(() => {
              this.ws.send('{"op":"subscribe","args":["order"]}');
              // this.ws.send('{"op":"subscribe","args":["position"]}');
            }, 500);
            this.ws.send(
                '{"op":"subscribe","args":["instrument_info.100ms.' +
                this.currentSymbol + '"]}');
          };
          
          this.ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            switch (data.topic) {
              case 'instrument_info.100ms.' + this.currentSymbol + '' :
                this.setPrice(data);
                break;
              case 'order' :
                for (let i = 0; i < data.data.length; i++) {
                  if (data.data[i].symbol === this.currentSymbol) {
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
            this.markPrice = Number(data.data.mark_price_e4 + 'e-4').toFixed(2);
          }
          if (data.type === 'delta') {
            if (data.data.update[0].last_price_e4) {
              this.lastPrice = Number(
                  data.data.update[0].last_price_e4 + 'e-4').toFixed(2);
            }
            if (data.data.update[0].mark_price_e4) {
              this.markPrice = Number(
                  data.data.update[0].mark_price_e4 + 'e-4').toFixed(2);
            }
          }
        },
        async getOrders(page = 1) {
          try {
            let data = {
              'order_status': 'New',
              'symbol': this.currentSymbol,
              'page': page,
            };
            let options = {
              params: this.signData(data),
            };
            let res = await axios.get(this.url + 'open-api/order/list',
                options);
            if (res.data.ret_msg === 'ok') {
              if (res.data.result.data) {
                this.openOrders = this.openOrders.concat(res.data.result.data);
              }
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
        initPositionInterval() {
          if (this.positionInterval) {
            this.disablePositionInterval();
          }
          this.positionInterval = setInterval(this.getPosition, 1100);
        },
        disablePositionInterval() {
          clearInterval(this.positionInterval);
        },
        async getPosition() {
          try {
            let data = {};
            let options = {
              params: this.signData(data),
            };
            let res = await axios.get(this.url + 'position/list',
                options);
            if (res.data.ret_msg === 'ok') {
              // console.log(res.data.result.filter(pos => pos.symbol === this.currentSymbol && pos.size > 0)) ;
              // console.log(res.data) ;
              this.walletBalance = res.data.result.filter(
                  pos => pos.symbol === this.currentSymbol)[0].wallet_balance;
              this.openPosition = res.data.result.filter(
                  pos => pos.symbol === this.currentSymbol && pos.size > 0)[0];
            } else {
              console.error(res);
              this.$notify({
                text: res.data.ret_msg +
                    ((res.data.ret_code === 10002) ? '<br> server_time : ' +
                        res.data.time_now + '<br> request_time : ' +
                        data.timestamp : ''),
                type: 'error',
              });
            }
          } catch (e) {
            console.error(e);
          }
        },
        marketClosePosition() {
          this.placeOrder({
            side: this.openPosition.side === 'Buy' ? 'Sell' : 'Buy',
            symbol: this.$bybitApi.currentSymbol,
            order_type: 'Market',
            qty: this.openPosition.size,
            time_in_force: 'GoodTillCancel',
          });
        },
        async setTradingStops(takeProfit, stopLoss, trailingStop) {
          let data = {
            symbol: this.currentSymbol,
            take_profit: takeProfit,
            stop_loss: stopLoss,
            trailing_stop: trailingStop,
          };
          try {
            let res = await axios.post(
                this.url + 'open-api/position/trading-stop',
                this.signData(data));
            console.log(res);
            if (res.data.ret_msg === 'ok') {
              this.$notify({
                text: 'Trading stops changed',
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
        async placeOrder(data) {
          try {
            let res = await axios.post(this.url + 'v2/private/order/create',
                this.signData(data));
            console.log(res);
            if (res.data.ret_msg === 'OK') {
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
              symbol: this.currentSymbol,
            };
            let res = await axios.post(this.url + 'v2/private/order/cancel',
                this.signData(data));
            if (res.data.ret_msg === 'OK') {
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
          try {
            let data = {
              symbol: this.currentSymbol,
            };
            let res = await axios.post(this.url + 'v2/private/order/cancelAll',
                this.signData(data));
            if (res.data.ret_msg === 'OK') {
              this.$notify({
                text: 'Orders cancelled',
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
        async cancelAllBuyOpenOrders() {
          for (let i = 0; i < this.openOrders.length; i++) {
            if (this.openOrders[i].side === 'Buy') {
              this.cancelOrder(this.openOrders[i].order_id);
            }
          }
        },
        async cancelAllSellOpenOrders() {
          for (let i = 0; i < this.openOrders.length; i++) {
            if (this.openOrders[i].side === 'Sell') {
              this.cancelOrder(this.openOrders[i].order_id);
            }
          }
        },
        addOrder(order) {
          let exists = false;
          order.updated_at = order.timestamp;
          console.log(order, this.openOrders);
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
          data.api_key = this.account.apiKey;
          data.timestamp = Date.now() - 2000;
          data.recv_window = 25000;
          let dataString = this.objToString(this.sortObject(data));
          data.sign = CryptoJS.HmacSHA256(dataString, this.account.apiSecret).
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
        getDataFromLocalStorage() {
          if (localStorage.accounts !== undefined) {
            this.accounts = JSON.parse(localStorage.accounts);
          }
          if (localStorage.account) {
            this.account = JSON.parse(localStorage.account);
          }
          if (localStorage.currentSymbol) {
            this.currentSymbol = localStorage.currentSymbol;
          }
          if (localStorage.autoconnect !== undefined) {
            this.autoconnect = localStorage.autoconnect === 'true';
          }
        },
      },
      created() {
        this.getDataFromLocalStorage();
        this.init();
      },
      watch: {
        autoconnect(autoconnect) {
          localStorage.autoconnect = autoconnect;
        },
        apiKey(apiKey) {
          this.account.apiKey = apiKey.trim();
          localStorage.apiKey = apiKey.trim();
        },
        apiSecret(apiSecret) {
          this.apiSecret = apiSecret.trim();
          localStorage.apiSecret = apiSecret.trim();
        },
        currentSymbol(currentSymbol) {
          localStorage.currentSymbol = currentSymbol;
        },
        account: {
          deep: true,
          handler(account) {
            account.apiSecret = account.apiSecret.trim();
            account.label = account.label.trim();
            account.apiKey = account.apiKey.trim();
            localStorage.account = JSON.stringify(account);
          },
        },
        accounts: {
          deep: true,
          handler(accounts) {
            localStorage.accounts = JSON.stringify(accounts);
          },
        },
      },
    });
  },
};
