import footer from './foot.vue'
import Vue from 'vue'

footer.install = function (Vue) {
  Vue.component('footer', footer);
};

module.exports = footer;
