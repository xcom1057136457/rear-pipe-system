import copy from './copy'
import debounce from './debounce'
import draggable from "./draggable"
import lazyLoad from "./lazyLoad"
import longPress from "./longPress"

const install = function(Vue) {
  Vue.directive('copy', copy)
  Vue.directive('debounce', debounce)
  Vue.directive('draggable', draggable)
  Vue.directive('lazyLoad', lazyLoad)
  Vue.directive('longPress', longPress)
}

if (window.Vue) {
  window['copy'] = copy
  window['debounce'] = debounce
  window['draggable'] = draggable
  window['lazyLoad'] = lazyLoad
  window['longPress'] = longPress
  Vue.use(install); // eslint-disable-line
}

export default install
