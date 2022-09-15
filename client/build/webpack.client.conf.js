const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeModulesPath = resolve(__dirname, "../../node_modules");
const CLIENT_FOLDER = resolve(__dirname, "../");
const productionEnv = process.env.NODE_ENV === "production";
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const merge = require("webpack-merge");
const base = require("./webpack.base.conf");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

let config = merge(base, {
  entry: {
    front: [CLIENT_FOLDER + "/src/entry-client"],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 开启全局的模块热替换(HMR)

    new webpack.NamedModulesPlugin(),
    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息,

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: CLIENT_FOLDER + "/public/index.html",
      // inject: 'body',
      inject: false,
      chunks: productionEnv
        ? ["manifest_front", "vendor_front", "front"]
        : ["front"],
      minify: {
        // 压缩的方式
        // removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      // chunksSortMode: 'dependency'
    }),
    // 配置提取出的样式文件
    // new ExtractTextPlugin("css/[name].[contenthash].css"),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.VUE_ENV": '"client"',
    }),
    new VueSSRClientPlugin(),
  ],
});
// config.entry['front'].unshift(
//   'event-source-polyfill',
//   'webpack-hot-middleware/client?reload=true'
// )

if (process.env.NODE_ENV === "production") {
  // 删除devtool
  delete config.devtool;
  // 删除webpack-hot-middleware
  // config.entry['front'].splice(0, 2)
  config.output.filename = "[name].[chunkhash:8].min.js";
  // 提取css
  // config.module.rules[1].options.loaders = {
  //   styl: ExtractTextPlugin.extract({
  //     use: [
  //       {
  //         loader: "css-loader",
  //         options: {
  //           minimize: true,
  //           sourceMap: true,
  //         },
  //       },
  //       "postcss-loader",
  //       {
  //         loader: "stylus-loader",
  //         options: {
  //           sourceMap: true,
  //         },
  //       },
  //     ],
  //     fallback: "vue-style-loader",
  //   }),
  //   stylus: ExtractTextPlugin.extract({
  //     use: [
  //       {
  //         loader: "css-loader",
  //         options: {
  //           minimize: true,
  //           sourceMap: true,
  //         },
  //       },
  //       "postcss-loader",
  //       {
  //         loader: "stylus-loader",
  //         options: {
  //           sourceMap: true,
  //         },
  //       },
  //     ],
  //     fallback: "vue-style-loader",
  //   }),
  //   css: ExtractTextPlugin.extract({
  //     use: [
  //       {
  //         loader: "css-loader",
  //         options: {
  //           minimize: true,
  //           sourceMap: true,
  //         },
  //       },
  //       "postcss-loader",
  //     ],
  //     fallback: "vue-style-loader",
  //   }),
  // };
  // 删除HotModuleReplacementPlugin和NamedModulesPlugin
  config.plugins.shift();
  config.plugins.shift();
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      },
    }),
    // 分别提取vendor、manifest
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor_front",
      chunks: ["front"],
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(nodeModulesPath) === 0
        );
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest_front",
      chunks: ["vendor_front"],
    }),
    // copy static
    new CopyWebpackPlugin([
      {
        from: CLIENT_FOLDER + "/static",
        to: CLIENT_FOLDER + "/dist/static",
        ignore: [".*"],
      },
    ]),
  ]);
}
// console.log(config)
module.exports = config;
