import Vue from "vue";
import Button from "ant-design-vue/lib/button";
import Input from "ant-design-vue/lib/input";
import Progress from "ant-design-vue/lib/progress";
import Modal from "ant-design-vue/lib/modal";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";

Vue.component(Button.name, Button);
Vue.component(Input.name, Input);
Vue.component(Progress.name, Progress);
Vue.use(Modal);

Vue.config.productionTip = false;

Vue.directive("focus", {
  // When the bound element is inserted into the DOM...
  inserted: function(el) {
    // Focus the element
    el.focus();
  }
});

new Vue({
  render: h => h(App)
}).$mount("#app");
