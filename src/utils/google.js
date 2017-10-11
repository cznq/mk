export function MP() {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      resolve(google)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://ditu.google.cn/maps/api/js?key=AIzaSyD1PV5fokBUFMMICzdCy262QgYTxVyBsz4";
    //script.src = "http://api.map.baidu.com/api?v=2.0&ak=45fcIn1YpBWcUGvtLA7jujtG&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}  