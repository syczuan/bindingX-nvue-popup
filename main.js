import App from "./App";

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
