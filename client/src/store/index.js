import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
Vue.use(Vuex);
export function createStore() {
  const store = new Vuex.Store({
    modules,
    getters
  });
  return store;
}
