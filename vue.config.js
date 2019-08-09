// vue.config.js

module.exports = {
  configureWebpack: {
    resolve: {
      mainFields: ['main', 'browser']
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        win: {
          "target": [
            {
              "target": "zip",
              "arch": [
                "x64"
              ],
            },
            {
              "target" : "dir",
              "arch": [
                "x64"
              ],
            }
          ],
        },
        linux: {
          target: ["dir", "appimage"],
        },
        mac: {
          target: ["dir", "zip"],
        }
      }
    }
  }
};
