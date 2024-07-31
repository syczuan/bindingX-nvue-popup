import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import uView from "@/uni_modules/uview-ui";
import "./uni.promisify.adaptor";
Vue.config.productionTip = false;
App.mpType = "app";
// 引入uView主JS库
Vue.use(uView);
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
