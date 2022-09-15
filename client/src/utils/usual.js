import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
export function getDomain() {
  const find = (str, cha, num) => {
    let x = str.indexOf(cha);
    for (var i = 0; i < num; i++) {
      x = str.indexOf(cha, x + 1);
    }
    return x;
  };
  if (typeof window === "undefined") {
    return "http://127.0.0.1:9000/bp/api/";
  }
  var url = window.location.href;
  var i = find(url, ":", 1);
  let domain = url.substring(0, i);
  domain = domain === "http://localhost:9000/bp/api/" ? domain : "http://xxx/bp/api/";
  return domain;
}
export function unique(arr, key) {
  if (!arr) return arr;
  if (key === undefined) return [...new Set(arr)];
  const map = {
    string: (e) => e[key],
    function: (e) => key(e),
  };
  const fn = map[typeof key];
  const obj = arr.reduce(
    (o, e) => (
      o[fn(e)] && o[fn(e)].count
        ? o[fn(e)].count++
        : (o[fn(e)] = {
            tag_id: e.tag_id,
            count: 1,
          }),
      o
    ),
    {}
  );
  return Object.entries(obj);
}
export function rafThrottle(fn) {
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      locked = false;
    });
  };
}
export function isFirefox() {
  return (
    !Vue.prototype.$isServer &&
    !!window.navigator.userAgent.match(/firefox/i)
  );
}
/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
//节流
export function throttle(Fn,delay) {
  var timer = null;
  return function() {
    if(timer)return
    var args = arguments
    timer = setTimeout(function() {
      timer = null;
      Fn(...args)
    },delay)
  }
}
//判断是否为pc端
export function IsPC(){
  var userAgentInfo = navigator.userAgent;
  console.log(userAgentInfo);
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}
//判断滑动效果
