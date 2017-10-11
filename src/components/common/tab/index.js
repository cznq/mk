import tab from './tab.vue'
import Vue from 'vue'

tab.install = function (Vue) {
  Vue.component('tab', tab);
};

module.exports = tab;
