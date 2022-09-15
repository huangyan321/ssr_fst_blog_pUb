const { resolve } = require("path");
const nodeModulesPath = resolve(__dirname, "../../node_modules");
const CLIENT_FOLDER = resolve(__dirname, "../");
let config = {
  devtool: "source-map",
  // 输出路径和文件夹
  output: {
    path: CLIENT_FOLDER + "/dist",
    filename: "[name].js",
    publicPath: "/dist/",
  },
  // 指定不打包的文件，之后会在外界获取
  externals: {
    // vue: "Vue",
    // "vue-router": "VueRouter",
    // axios: "axios",
    // "element-ui": "Element",
    // nprogress: "nprogress"
  },
  // 指定运行插件
  plugins: [],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015"],
            },
          },
        ],
      },
      {
        // 解析vue字符串
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            styl: ["vue-style-loader", "css-loader?minimize", "stylus-loader"],
            stylus: [
              "vue-style-loader",
              "css-loader?minimize",
              "stylus-loader",
            ],
            css: ["vue-style-loader", "css-loader?minimize"],
          },
          preserveWhitespace: false,
          postcss: [require("autoprefixer")({ browsers: ["last 7 versions"] })],
        },
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader?minimize",
          "sass-loader",
        ],
        include: CLIENT_FOLDER,
      },
      {
        test: /\.styl$/,
        use: [
          "isomorphic-style-loader",
          "css-loader?minimize",
          "stylus-loader",
        ],
        include: CLIENT_FOLDER,
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          "css-loader?minimize",
          "postcss-loader",
        ],
      },
      {
        // 解析图片文件
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "img/[name].[hash:7].[ext]",
        },
      },
      {
        // 解析字体
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "fonts/[name].[hash:7].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    modules: [nodeModulesPath],
    alias: {
      '@': resolve(__dirname,'../src'),
      vue$: "vue/dist/vue.esm.js",
      vuex$: "vuex/dist/vuex.esm.js",
      "vue-router$": "vue-router/dist/vue-router.esm.js",
      simplemde$: "simplemde/dist/simplemde.min.js",
      "highlight.js$": "highlight.js/lib/highlight.js",
      fastclick: "fastclick/lib/fastclick.js",
      lib: resolve(__dirname, "../src/lib"),
      api: resolve(__dirname, "../src/api"),
      publicComponents: resolve(__dirname, "../src/components"),
      serverConfig: resolve(__dirname, "../../server/configs/"),
    },
  },
};
module.exports = config;
