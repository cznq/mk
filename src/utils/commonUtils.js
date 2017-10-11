// var TcVui = require('tcvui2');
//console.log(TcVui);
// var bridge = TcVui.Bridge
// if(CHANNAL_ID != "hybird") {
//     bridge = TcVui.Bridge;
// } else {
//     bridge = TcVui.Bridge;
// }
//console.log(bridge);
var {cacheUtils} = require('../utils/cacheUtils');

/**
 * 获取数据模块
 *
 * @param    {string}  serviceName          服务器名称
 * @param    {string}  interFaceId          接口ID
 * @param    {string}  reqUrl               请求地址
 * @param    {string}  reqBody              请求参数
 * @param    {string}  isCache              是否缓存
 * @param    {string}  callback             回调函数
 * @returns  void
 *
 * @date     2016-10-04
 * @author   wzj
 */
exports.GetData = {
    post: function(serviceName, interFaceId, reqUrl, reqBody, isCache, callback, loading) {
        reqBody = reqBody != "" ? reqBody : {};
        var jsonObj = {
            requrl: reqUrl,
            reqbody: reqBody,
            servicename: serviceName
        }
        if (loading) loadingModule.init(loading);
        // console.log(jsonObj);
        bridge.util.getData(jsonObj).then(function(data){
            data = ({}).toString.call(data.CBData) == "[object Object]" ? data.CBData : JSON.parse(data.CBData);
            //alert(JSON.stringify(data));
            var dataHeader = data.response.header || {};
            if (data.response.header.rspCode != '0000') {
                alert(JSON.stringify(data));
                if (loading) loadingModule.hide();
                callback([]);
            } else {
                if (loading) loadingModule.hide();
                callback(data.response.body);
            }
        });
    }
}
/**
 * 页面处理模块
 *
 * @param    {string}  url          路由
 * @param    {string}  data         参数
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.PageModule = {
    jump: function(url, data) {
        var link_param = data ? "?" + data : '';
        var jsonObj = {
          "openParams": "newWindow",
          "jumpUrl": window.location.href.split("#")[0] + "#/" + url + link_param
        };
        bridge.web.openNewUrl(jsonObj).then(function (data) {
          alert(JSON.stringify(data));
        })
    },
    // @all 由于在本页面打开新页面,不会触发页面激活、失活状态，需要在回调函数里设置 header
    localJump: function(url, data, callback) {
        var link_param = data ? "?" + data : '?';
        console.log(link_param, window.location.href.split("#")[0] + "#/" + url + link_param);
        window.location.href = window.location.href.split("#")[0] + "#/" + url + link_param;
        !!callback && callback();
    },
    // 取url返回的参数
    getQueryArray: function() {
        var aQuery = window.location.href.split('?')
        if (aQuery.length > 1) {
            aQuery = aQuery[1].split('&');
        }
        return aQuery;
    },
    getQueryString: function() {
        var sQuery = window.location.href.split('?')[1] || "";
        return sQuery;
    },
    getUserId: function() {
        var userId = CookieUtils.get("us", "userid");
        return userId;
    },
    getValue: function(key) {
        var params = this.getQueryArray();
        for(var i = 0; i < params.length; i++) {
            if(params[i].split("=")[0] == key) {
                return params[i].split("=")[1];
            }
        }
        return "";
    },
    go: function(uri, params, backUri, callback) {
        if(params && params != "") cacheUtils.paCache['go_params'] = params;
        if(callback && callback != "") cacheUtils.fnCache['back_callback'] = callback;
        if(backUri && backUri != "") cacheUtils.uriCache['back_uri'] = backUri;
        this.localJump(uri);
    },
    getParams: function(callback) {
        callback && cacheUtils.paCache['go_params'] ? callback(cacheUtils.paCache['go_params']) : '';
    },
    back: function(cbData) {
        // var link_param = "?cbd=1&cbd=1";
        // window.location.href = window.location.href.split("#")[0] + "#/" + uri + link_param;
        var uri = cacheUtils.uriCache['back_uri'];
        !uri ? window.history.go(-1) : window.location.href = window.location.href.split("#")[0] + "#/" + uri + "?go=1&back=1";
        var callback = cacheUtils.fnCache['back_callback'];
        callback(cbData);
    }
}

exports.CookieUtils = {
    get: function(name, key) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=");
            if (c_start != -1) {
                c_start = c_start + name.length + 1;
                c_end = document.cookie.indexOf(";",c_start);
                if (c_end == -1) c_end = document.cookie.length;
                var nameVal = unescape(document.cookie.substring(c_start, c_end));
                var nameVal = nameVal.split("&");
                for(var i = 0; i < nameVal.length; i++) {
                    if(nameVal[i].split("=")[0] == key) {
                        return nameVal[i].split("=")[1];
                    }
                }
            }
        }
        return ""
    }
}

exports.UserUtils = {
    toLogin: function(url) {
        location.href = 'https://m.ly.com/passport/login.html?returnUrl=' + encodeURIComponent(url);
    }
}

exports.BeanUtils = {
    copy: function(source, destination) {
        for (var val in source) {
            if (typeof source[val] === "function") continue;
            destination[val] = source[val];
        }
        return destination;
    },
    merge: function(source, destination) {
        for (var val in source) {
            if (typeof source[val] === "function") continue;
            if (destination[val]) continue;
            destination[val] = source[val];
        }
        return destination;
    }
}

/**
 * 设置标题栏模块
 *
 * @param    {string}  title        标题名
 * @param    {string}  callback     回调函数
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.SetNavbarModule = {
    // 头部标题设置 默认回退到指定的页面
    SetNavbar: function(title, fn) {
        //$("#gjcar_common_title").html(title);
        // fn && fn(data);
        // window._tc_bridge_bar.set_navbar({
        //     "param": {
        //         "left": [{
        //             "tagname": "tag_click_back"
        //         }],
        //         "center": [{ "value": title }],
        //         "right": []
        //     },
        //     callback: function(data) {
        //         fn && fn(data);
        //     }
        // });
    }
}

/**
 * toast模块
 *
 * @param    {string}  msg        提示信息
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.ToastModule = {
    // 弹出提示信息
    init: function(msg) {
        var jsonObj = {
          "showInfo": msg
        };
        bridge.util.$showToast(jsonObj);
    }
}
/**
 * loading模块
 *
 * @param    {string}  type        背景配置：'black' or 'white'
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
var loadingModule = {
    init: function(type) {
        //$('.load-wrap').removeClass('hide');
        switch (type) {
            case 'black':
                //$('.loadingimg-white-wrap').addClass('hide');
                //$('.loadingimg-black-wrap').removeClass('hide');
                break;
            case 'white':
                //$('.loadingimg-white-wrap').removeClass('hide');
                //$('.loadingimg-black-wrap').addClass('hide');
                break;
        }
    },
    hide: function() {
        //$('.load-wrap').addClass('hide');
    }
    // (function addActiveListener() {
    //     // webapp 激活，失活通知
    //     if (!window._tc_web_bar) {
    //         window._tc_web_bar = {};
    //     }
    //     window._tc_web_bar.tag_isStop = function(data) {
    //         // data.isStop = "true"，//webview处于失活状态，即webview在后台或者被其他页面覆盖。
    //         // data.isStop = "false"，webview处于激活状态，webview视图可见。
    //         // alert(data.isStop + JSON.stringify(data));
    //         if (data.isStop === "false") {
    //             // 恢复点击事件
    //             $('.load_wrap').addClass('hide');
    //         }
    //     }
    // })();
}
exports.loadingModule = loadingModule;
/**
 * 本地缓存模块
 *
 * @param    {string}  key        键
 * @param    {string}  value      值
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.CacheModule = {
    // 设置缓存值localStorage
    set: function(key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        } else {
            ToastModule.init('页面错误-请联系客服');
        }
    },
    // 得到缓存值
    get: function(value) {
        if (window.localStorage) {
            var val = localStorage.getItem(value);
            return val;
        } else {
            ToastModule.init('页面错误-请联系客服');
        }
    },
    containsKey: function (key) {
        if (window.localStorage) {
            var val = localStorage.getItem(key);
            return val != null ? true : false;
        } else {
            return false;
        }
    },
    add: function(key, value) {
        if (window.localStorage) {
            var val = localStorage.getItem(key);
            if(val != null) {
                return false;
            } else {
                localStorage.setItem(key, value);
                return true;
            }
        } else {
            ToastModule.init('页面错误-请联系客服');
        }
    },
    remove: function(key) {
        if (window.localStorage) {
            var val = localStorage.removeItem(key);
        } else {
            ToastModule.init('页面错误-请联系客服');
        }
    }
}
/**
 * 数组处理模块
 *
 * @param    {array}  array       键
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.ArrayModule = {
    unique: function(array) {
        var res = [];
        var json = {};
        for (var i = 0; i < array.length; i++) {
            if (!json[JSON.stringify(array[i])]) {
                res.push(array[i]);
                json[JSON.stringify(array[i])] = 1;
            }
        }
        return res;
    },
    uniqueByName: function(array) {
        var res = [];
        var json = {};
        for (var i = 0; i < array.length; i++) {
            if (!json[JSON.stringify(array[i].cName)]) {
                res.push(array[i]);
                json[JSON.stringify(array[i].cName)] = 1;
            }
        }
        return res;
    }
}
/**
 * 历史记录处理模块（固定长度、无重复）
 *
 * @param    {array}    array       数组
 * @param    {number}   number      长度
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.HistoryArrayModule = {
    unique: function(val, array, length) {
        // alert(JSON.stringify(array));
        array.unshift(val);
        array = ArrayModule.unique(array);
        // 数组去重结束控制历史个数
        if (array.length >= length) {
            array.pop();
        }
    }
}
/**
 * 咨询客服模块
 *
 * @param    {}
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.customerServiceModule = {
    showDialog: function() {
        var strJson = {
            "title": "同程旅游客服电话",
            "showList": [{
                "showTitle": "国内拨打 4007777777",
                "jumpUrl": "tel:4007777777"
            }, {
                "showTitle": "境外拨打 008651282209000",
                "jumpUrl": "tel:008651282209000"
            }, {
                "showTitle": "意见反馈",
                "jumpUrl": window.location.href + "/suggestBack?"+ window.location.href.split("#/")[1]
            }],
            "tagname": "show_dialog"
        };
        //CacheModule.remove("suggest");
        bridge.util.showDialog(strJson);
    }
}
//页面对话框
exports.dialogModule = {
    showdialog: function(desc, btnType, handler) {
        var jsonObj = {
          "tagname": "dialog",
          "desc": desc
        };
        if (btnType == "1") { // 一个按钮
            jsonObj.btnList = [{
                "showText": "取消",
                "tagname": "tag_click_single_btn"
            }];
        } else if (btnType == "2") { // 两个按钮
            jsonObj.btnList = [{
                "showText": "取消",
                "tagname": "tag_click_left_btn"
            }, {
                "showText": "继续修改机场",
                "tagname": "tag_click_right_btn"
            }];
        } else { // 没有按钮
            jsonObj.btnList = null;
        }
        bridge.util.showTipsDialog(jsonObj).then(function (data) {
          alert(JSON.stringify(data));
          handler(data);
        })
    }
}
/**
 * 时间初始化模块
 *
 * @param    {}
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.timeModule = {
    // 年月日时间存储2016-01-01
    storage_time: null,
    oTime: [],
    i: 0,
    storageTime: function(year, month, today) {
        storage_time = year + "-" + month + "-" + today;
        CacheModule.set(storage_time, storage_time);
        storage_time = CacheModule.get(storage_time);
    },
    // 获取支付时间
    getPayTime: function(createTime) {
        var startTime = this.setDateByAdd(0);
        var endTime = this.setDateByAdd(30);
        if (createTime) endTime = this.setDateByAdd(30, createTime);
        var startTimeStr = startTime.year + '-' + startTime.month + '-' + startTime.day + " " + startTime.hour + ":" + startTime.minutes + ":" + startTime.seconds;
        var endTimeStr = endTime.year + '-' + endTime.month + '-' + endTime.day + " " + endTime.hour + ":" + endTime.minutes + ":" + endTime.seconds;
        var result = {};
        result.startTime = startTimeStr;
        result.endTime = endTimeStr;
        return result;
    },
    // 初始化 时间显示
    InitTime: function() {
        var start = timeModule.setDateByAdd(0),
            startDate = start.year + '-' + start.month + '-' + start.day;
        storageTime(start.year, start.month, start.day);
        return start.year + "-" + start.month + "-" + start.day + " " + "今天";
    },
    // 设置日期时间
    setDateByAdd: function(AddDayCount, createTime) {
        var i;
        i++;
        if (createTime) {
            var date = createTime.split(/[- : \/]/);
            if (date[5] !== undefined) {
                dd = new Date(date[0], date[1] - 1, date[2], date[3], date[4], date[5]);
            } else {
                dd = new Date(date[0], date[1] - 1, date[2], date[3], date[4]);
            }
        } else {
            var dd = new Date();
        }
        dd.setMinutes(dd.getMinutes() + AddDayCount);
        var y = dd.getFullYear();
        var M = dd.getMonth() + 1;
        var D = dd.getDate();
        var H = dd.getHours();
        var m = dd.getMinutes();
        var d = dd.getDay();
        var s = dd.getSeconds();
        if (M <= 9) {
            M = '0' + M
        }
        if (D <= 9) {
            D = '0' + D
        }
        if (H <= 9) {
            H = '0' + H
        }
        if (m <= 9) {
            m = '0' + m
        }
        if (s <= 9) {
            s = '0' + s
        }
        var oTime = [];
        oTime[i] = {};
        oTime[i].year = y;
        oTime[i].month = M;
        oTime[i].day = D;
        oTime[i].hour = H;
        oTime[i].minutes = m;
        oTime[i].seconds = s;
        // console.log('第' + i + '个:' , oTime[i]);
        return oTime[i];
    }
}
/**
 * 公共日历模块
 *
 * @param    {string}      id
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
exports.calendarModule = {
    oTime: {},
    choiceTime: function(id) {
        this.oTime.start = timeModule.setDateByAdd(0);
        this.oTime.end = timeModule.setDateByAdd(180 * 24 * 60);
        var startDate = this.oTime.start.year + '-' + this.oTime.start.month + '-' + this.oTime.start.day,
            endDate = this.oTime.end.year + '-' + this.oTime.end.month + '-' + this.oTime.end.day;
        var jsonObj = {
            "title": "选择日期",
            "startDate": startDate,
            "endDate": endDate
        };
        bridge.dateTime.pickCommonCalendar(jsonObj).then(function (data) {
          //alert(JSON.stringify(data));
          if (!data) {
            // 无回调数据
            alert("无回调数据");
            return;
          }
          if (data.status) {
            // 取得数据失败
            alert("获取数据失败");
          } else {
            // 回调数据
            // alert(data.CBData);
            var cbObj = JSON.parse(data.CBData);
            var time = $("#" + id);
            var data = cbObj.selectedDate;
            var year = data.split("-")[0];
            var month = data.split("-")[1];
            var tomonth = data.split("-")[1] - 1;
            var today = data.split("-")[2];
            timeModule.storageTime(year, month, today);
            var dt = new Date(year, tomonth, today);
            var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            var week = weekDay[dt.getDay()];
            var tm = timeModule.setDateByAdd(24 * 60),
              aq = timeModule.setDateByAdd(2 * 24 * 60);
            var tday = oTime.start.year + '-' + oTime.start.month + '-' + oTime.start.day,
              tomorrow = tm.year + '-' + tm.month + '-' + tm.day,
              acquired = aq.year + '-' + aq.month + '-' + aq.day;
            switch (cbObj.selectedDate) {
              case tday:
                data = year + "-" + month + "-" + today + " " + "今天";
                break;
              case tomorrow:
                data = year + "-" + month + "-" + today + " " + "明天";
                break;
              case acquired:
                data = year + "-" + month + "-" + today + " " + "后天";
                break;
              default:
                data = year + "-" + month + "-" + today + " " + week;
                break;
            }
            // alert(data);
            time.val(data);
          }
        });
    },
    choiceTime2: function(id, callback, startNumber, tips) {
        var addNum = startNumber || 0;
        oTime.start = timeModule.setDateByAdd(addNum * 24 * 60);
        oTime.end = timeModule.setDateByAdd(180 * 24 * 60);
        var startDate = oTime.start.year + '-' + oTime.start.month + '-' + oTime.start.day,
            endDate = oTime.end.year + '-' + oTime.end.month + '-' + oTime.end.day;
        console.log(startDate);
        console.log(endDate);
        var jsonObj = {
            "title": "请选择日期（当地时间）",
            "startDate": startDate,
            "endDate": endDate
        };
        bridge.dateTime.pickCommonCalendar(jsonObj).then(function (data) {
        if (!data) {
          // 无回调数据
          alert("无回调数据");
          return;
        }
        if (data.status) {
          // 取得数据失败
          alert("获取数据失败");
        } else {
          // 回调数据
          // alert(data.CBData);
          var cbObj = JSON.parse(data.CBData);
          var time = $("#" + id);
          var data = cbObj.selectedDate;
          var year = data.split("-")[0];
          var month = data.split("-")[1];
          var tomonth = data.split("-")[1] - 1;
          var today = data.split("-")[2];
          timeModule.storageTime(year, month, today);
          var dt = new Date(year, tomonth, today);
          var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          var week = weekDay[dt.getDay()];
          var tm = timeModule.setDateByAdd(24 * 60),
            aq = timeModule.setDateByAdd(2 * 24 * 60);
          var tday = oTime.start.year + '-' + oTime.start.month + '-' + oTime.start.day,
            tomorrow = tm.year + '-' + tm.month + '-' + tm.day,
            acquired = aq.year + '-' + aq.month + '-' + aq.day;
          switch (cbObj.selectedDate) {
            case tday && addNum === 0:
              data = year + "-" + month + "-" + today + " " + "今天";
              break;
            case tomorrow && addNum === 1:
              data = year + "-" + month + "-" + today + " " + "明天";
              break;
            case acquired && addNum === 2:
              data = year + "-" + month + "-" + today + " " + "后天";
              break;
            default:
              data = year + "-" + month + "-" + today + " " + week;
              break;
          }
          time.text(data);
          callback && callback(data);
        }
        });
    }
}
/**
 * 总价
 *
 * @param    {string}      originFee     基础价
 * @param    {function}    couponAmount  优惠价
 * @param    {function}    invoiceFee    发票价
 * @param    {function}    int           计数器
 * @date     2017-01-16
 * @author   wzj42477@ly.com
 */
exports.TotalPrice = {
    TotalFee: function(originFee, couponAmount, invoiceFee, int){
        var totalFee = MathModule.sub(originFee * int, couponAmount) < 0 ?
            0 : MathModule.add(MathModule.sub(originFee * int, couponAmount), invoiceFee);
        return totalFee
    }
}
/**
 * 弹框型时间模块
 *
 * @param    {string}      id
 * @param    {string}      selectTime      选择默认时间
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
var choiceTimeModule = {
    selfDriver: function(id, selectTime, type, landTime, handler, title, tips, timeInterval) {
      var start, end, startDate, endDate;
      // if(id != "take-time" && id != "return-time"){//租车不限制结束时间
      //   start = timeModule.setDateByAdd(8 * 60);
      //   end = timeModule.setDateByAdd(3 * 30 * 24 * 60);
      // }else{
      //   start = timeModule.setDateByAdd(0);
      //   end = timeModule.setDateByAdd(50 * 30 * 24 * 60);
      // }
      // startDate = start.year + '-' + start.month + '-' + start.day + ' ' + start.hour + ':' + start.minutes;
      // endDate = end.year + '-' + end.month + '-' + end.day + ' ' + end.hour + ':' + end.minutes;
      var startDate = "2017-10-20 12:00";
      var endDate = "2017-12-20 12:00";
      if (selectTime == "请选择上车时间" || selectTime =="") {
        selectTime = startDate;
      };
      if (landTime !== "" && landTime !=="return-time") {//自驾先选择了还车时间为:return-time
        startDate = landTime;
        selectTime = landTime;
        if(id != "take-time" && id != "return-time"){//自驾不限制结束时间
          end = timeModule.setDateByAdd(12 * 60, startDate);
          endDate = end.year + '-' + end.month + '-' + end.day + ' ' + end.hour + ':' + end.minutes;
        }
      }else if(landTime =="return-time"){//自驾先选择了还车时间
        endDate = selfdriverProcess.arrDate;
      }
      var jsonObj = {
          "dateTimeInfo": {
            "startTime": startDate,
            "endTime": endDate,
            "selectTime": selectTime,
            "timeInterval": timeInterval ? timeInterval : "",
            "title": title ? title : "请选择上车时间(当地时间)",
            "tips": tips ? tips : "请选择上车时间(当地时间)"
          }
      };

      bridge.dateTime.pickDateTime(jsonObj).then(function(data){
        var cbObj = JSON.parse(data.CBData);
        //var time = $("#" + id);
        //var time_val = time.html();
        var data = cbObj.selectTime;
        handler(data);
      });
    },
    simpleInit: function(serviceTime, handler) {
      // var start = timeModule.setDateByAdd(8 * 60);
      // var end = timeModule.setDateByAdd(3 * 30 * 24 * 60);
      // var startDate = start.year + '-' + start.month + '-' + start.day + ' ' + start.hour + ':' + start.minutes;
      // var endDate = end.year + '-' + end.month + '-' + end.day + ' ' + end.hour + ':' + end.minutes;
      var startDate = "2017-10-20 12:00";
      var endDate = "2017-12-20 12:00";
      if (serviceTime == undefined || serviceTime == "") {
        serviceTime = startDate;
      }
      var jsonObj = {
            "dateTimeInfo": {
                "startTime": startDate,
                "endTime": endDate,
                "selectTime": serviceTime,
                "timeInterval": "10",
                "title": "请选择上车时间(当地时间)",
                "tips": "请选择上车时间(当地时间)"
            }
      };
      bridge.dateTime.pickDateTime(jsonObj).then(function(data){
        var cbObj = JSON.parse(data.CBData);
        var data = cbObj.selectTime;
        handler(data);
      });
    }
    // simpleInit2: function(serviceTime, handler) {
    //     var start = timeModule.setDateByAdd(6 * 60);
    //     var end = timeModule.setDateByAdd(3 * 30 * 24 * 60);
    //     var startDate = start.year + '-' + start.month + '-' + start.day + ' ' + start.hour + ':' + start.minutes;
    //     var endDate = end.year + '-' + end.month + '-' + end.day + ' ' + end.hour + ':' + end.minutes;
    //     if (serviceTime == undefined || serviceTime == "") {
    //         serviceTime = startDate;
    //     }
    //     var jsonObj = {
    //         "param": {
    //             "dateTimeInfo": {
    //                 "startTime": startDate,
    //                 "endTime": endDate,
    //                 "selectTime": serviceTime,
    //                 "timeInterval": "10",
    //                 "title": "请选择上车时间(当地时间)",
    //                 "tips": "请选择上车时间(当地时间)"
    //             }
    //         },
    //         callback: function(data) {
    //             var cbObj = JSON.parse(data.CBData);
    //             var data = cbObj.selectTime;
    //             handler(data);
    //         }
    //     };
    //     window._tc_bridge_datetime.pick_datetime(jsonObj);
    // },
    // choiceTime: function(id, selectTime, type, landTime, handler) {
    //     var start = timeModule.setDateByAdd(8 * 60);
    //     var end = timeModule.setDateByAdd(3 * 30 * 24 * 60);
    //     var startDate = start.year + '-' + start.month + '-' + start.day + ' ' + start.hour + ':' + start.minutes;
    //     var endDate = end.year + '-' + end.month + '-' + end.day + ' ' + end.hour + ':' + end.minutes;
    //     if (selectTime == "请选择上车时间") {
    //         selectTime = startDate;
    //     };
    //     if (landTime !== "") {
    //         startDate = landTime;
    //         end = timeModule.setDateByAdd(2*24 * 60, startDate);
    //         endDate = end.year + '-' + end.month + '-' + end.day + ' ' + end.hour + ':' + end.minutes;
    //     }
    //     var jsonObj = {
    //         "param": {
    //             "dateTimeInfo": {
    //                 "startTime": startDate,
    //                 "endTime": endDate,
    //                 "selectTime": selectTime,
    //                 "timeInterval": "10",
    //                 "title": "请选择上车时间(当地时间)",
    //                 "tips": "请选择上车时间(当地时间)"
    //             }
    //         },
    //         callback: function(data) {
    //             var cbObj = JSON.parse(data.CBData);
    //             var time = $("#" + id);
    //             var time_val = time.html();
    //             var data = cbObj.selectTime;
    //             if (data === undefined) {
    //                 time.html(time_val);
    //                 return;
    //             }
    //             if (type == 'input') {
    //                 time.val(data);
    //             } else {
    //                 time.find('b').empty();
    //                 time.find('i').html(data);
    //             }
    //             handler(data);
    //         }
    //     };
    //     window._tc_bridge_datetime.pick_datetime(jsonObj);
    // }
}
exports.choiceTimeModule = choiceTimeModule;
/**
 * 用户须知模块
 *
 * @param    {string}  pId          产品ID
 * @param    {string}  code         服务商代码
 * @param    {string}  header       标题名称
 * @param    {string}  className    内容类名
 * @param    {string}  id    页面ID
 * @returns  void
 *
 * @date     2016-01-12
 * @author   jdw44469@ly.com
 */
exports.UserNoticeModule = {
    init: function(pId, code, header, className, id) {
        var oLayer = !!$('#' + id +' .order_detail').find('.layer').length ?
                $('#' + id +' .order_detail').find('.layer') :
                $('#' + id +' .creat-order').find('.layer'),
            oPick = oLayer.find('.pick'),
            o8 = oLayer.find('.rent_yt8'),
            oH = oLayer.find('.rent_hbc'),
            oSend = oLayer.find('.send');
        var oCon = oLayer.find('.' + className);
        // alert('olayer:' + JSON.stringify(oLayer.length));
        oLayer.find('header').text(header);
        switch (pId) {
            case 1:
                if (code == 'hbc') {
                    oCon.find('p').addClass('hide');
                    oH.removeClass('hide');
                } else {
                    oCon.find('p').addClass('hide');
                    o8.removeClass('hide');
                }
                break;
            case 2:
                if (code == 'hbc') {
                    oCon.find('p').addClass('hide');
                    oH.removeClass('hide');
                } else {
                    oCon.find('p').addClass('hide');
                    o8.removeClass('hide');
                }
                break;
            case 10:
                if (code == 'hbc') {
                    oCon.find('p').addClass('hide');
                    oH.removeClass('hide');
                } else if (code == 'yitu8') {
                    oCon.find('p').addClass('hide');
                    o8.removeClass('hide');
                } else {
                    oCon.find('p').addClass('hide');
                    oCon.find('.' + code).removeClass('hide');
                }
                break;
            case 11:
                if (code == 'hbc') {
                    oCon.find('p').addClass('hide');
                    oH.removeClass('hide');
                    //oH.hasClass('hide') ? oH.removeClass('hide') : oH.addClass('hide');
                } else {
                    oCon.find('p').addClass('hide');
                    o8.removeClass('hide');
                    //o8.hasClass('hide') ? o8.removeClass('hide') : o8.addClass('hide');
                }
                break;
            case 12:
                if (code == 'hbc') {
                    oCon.find('p').addClass('hide');
                    oH.removeClass('hide');
                    //oH.hasClass('hide') ? oH.removeClass('hide') : oH.addClass('hide');
                } else {
                    oCon.find('p').addClass('hide');
                    o8.removeClass('hide');
                    //o8.hasClass('hide') ? o8.removeClass('hide') : o8.addClass('hide');
                }
                break;
            case '':
                // 通用模板
                oCon.hasClass('hide') ? oCon.removeClass('hide') : oCon.addClass('hide');
                break;
            case 'all':
                oLayer.find('p').addClass('hide');
                break;
        }
        oLayer.hasClass('active') ? oLayer.removeClass('active') : oLayer.addClass('active');
    }
}
/**
 * 弹出框模块（订单取消等）
 *
 * @param    {string}   header          标题
 * @param    {array}    item            选项数据
 * @param    {array}    footer          底部按钮
 * @returns  void
 *
 * @date     2016-01-12
 * @author   jdw44469@ly.com
 */
exports.PopupModule = {
    oLayer: null,
    oSelect:{},
    init: function(header, tips, item, footer, callback) {
        var oBody = $('body'),
            sContent = '',
            sFooter = '',
            sPop;
        item.forEach(function(val, key) {
            sContent += '<li class="checkbox ft14 gray-6 padding5-0" key="' + val.id + '" index="' + key + '">' + val.name + '</li>';
        });
        footer.forEach(function(val, key) {
            sFooter += '<div class="ft18 button col-6 cen-center row' + (key === 1 ? ' btn-cancel bd-left gray-9 ' : '') + '" key=' + val.id + '>' + val.name + '</div>';
        });
        sPop = '<div id="layer-pop" class="layer-pop row cen-center col-12">' +
                '<div class="box bd-radius-4 bg-white relative">' +
                    '<header class="row cen-center marg20-top ft16 gray-3">' + header + '</header>' +
                    '<div class="row cen-center tips marg5-top ft12 gray-9">' + tips + '</div>' +
                    '<div class="padding10 col-12 content">' + '<ul class="padding0-15">' +
                        sContent + '<li class="ft14 gray-6 padding5-0">' +
                        '<textarea class="otherReason bd-radius-4 bg-f9 col-12 bd1 padding10 hide" row="6" ></textarea>' +
                        '</li>' + '</ul>' +
                    '</div>' +
                    '<footer class="row col-12 text-center blue bd-top">' + sFooter + '</footer>' +
                '</div>' +
                '</div>';
        //
        if (!oBody.hasClass('pop')) oBody.append(sPop) && oBody.addClass('pop');
        oLayer = oBody.find('#layer-pop');
        setTimeout(function() {
            adjustHeight();
        }, 30);
        oLayer.on('click', '.checkbox', function() {
            // 选项
            var index = +$(this).attr('index'),
                id = +$(this).attr('key'),
                cancelBtn = oLayer.find('.btn-cancel');
            item.forEach(function(val, key) {
                if (key === index) {
                    oSelect.data = val;
                }
            });
            // 是否其它
            // alert(id);
            if (id === 99) {
                oLayer.find('.otherReason').removeClass('hide');
                cancelBtn.addClass('gray-9');
                oLayer.on('input blur', '.otherReason', function() {
                    if ($(this).val()) {
                        cancelBtn.removeClass('gray-9');
                    } else {
                        cancelBtn.addClass('gray-9');
                    }
                });
            } else {
                oLayer.find('.otherReason').addClass('hide');
                cancelBtn.removeClass('gray-9');
            }
            adjustHeight();
            oLayer.find('.checkbox').removeClass('selected');
            $(this).addClass('selected');
        }).on('click', '.button', function() {
            // 按钮
            var id = $(this).attr('key');
            // 回调函数
            callback && callback(id, oSelect.data);
        }).on('blur', '.otherReason', function() {
            oSelect.data.name = $(this).val();
        });
        return this;
    },
    show: function() {
        if (!oLayer.hasClass('active')) oLayer.addClass('active');
        return this;
    },
    hide: function() {
        if (oLayer.hasClass('active')) oLayer.removeClass('active');
        return this;
    },
    remove: function() {
        if (oLayer.hasClass('active')) oLayer.remove();
        return this;
    },
    adjustHeight: function() {
        var oH = oLayer.find('header'),
            oT = oLayer.find('.tips'),
            oC = oLayer.find('.content'),
            oF = oLayer.find('footer');
        oB = oH.height() + oT.height() + oC.height() + oF.height() + 15;
        // console.log(oH.height(), oC.height(), oF.height());
        oLayer.find('.box').css({
            'height': oB,
            'margin-top': -oB / 2
        });
    }
}
/**
 * 数据过滤
 *
 * @date     2017-01-16
 * @author   zy43766@ly.com
 */
exports.Filter = {
    emoticon: function(str) {
        if(!str) return "";
        var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
        str = str.replace(patt, function(char) {
            var H, L, code;
            if (char.length === 2) {
                H = char.charCodeAt(0);
                L = char.charCodeAt(1);
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                return "";
            } else {
                return char;
            }
        });
        return str;
    },
    isScript: function(str) {
        var re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
        if (re.test(str)) {
            return true;
        }
        return false;
    },
    autoFilter: function() {
        // $("input").on('input', function() {
        //     if (Filter.isScript($(this).val())) {
        //         $(this).val("");
        //         $(this).focus();
        //     }
        // });
        // $("textarea").on('input', function() {
        //     if (Filter.isScript($(this).val())) {
        //         $(this).val("");
        //         $(this).focus();
        //     }
        // });
    }
}
/**
 * 向上滑动弹出框模块（市区范围等）
 *
 * @param    {array}    selects          选项数据
 * @returns  void
 *
 * @date     2016-01-12
 * @author   jdw44469@ly.com
 */
exports.SlideBoxModule = {
    init: function(selects, pageId, callback) {
        // var itemId = selects[0].id,
        //     rangeStr = '',
        //     length = 0;
        // var oBox = $('#' + pageId + ' .slide-up-box');
        // // alert(JSON.stringify(selects));
        // selects.forEach(function(val, key) {
        //     var isCheckedft = val.checked ? 'green' : '';
        //     var show = val.isShow ? length++ : 'hide';
        //     var isChecked, imgStr;
        //     if (val.checked) {
        //         // isChecked = '';
        //         imgStr = '<img class="icon-select" src="../img/icon_select_green.png" style="width:22px;">' +
        //             '<img class="hide icon-cancel" src="../img/btn_cancleorder_unselect.png" style="width:22px;">';
        //     } else {
        //         imgStr = '<img class="hide icon-select" src="../img/icon_select_green.png" style="width:22px;">' +
        //             '<img class="icon-cancel" src="../img/btn_cancleorder_unselect.png" style="width:22px;">';
        //     }
        //
        //     rangeStr += '<div data-id="' + val.id + '" class="rangeCon border_bottom05 padding0-15 row cen-start content relative ' + show + '">' +
        //         '<div class="imgview ' + '" style="margin-right:5px;">' +
        //             imgStr +
        //         '</div>' +
        //         '<div class="padding10-0 marg10-left ' + show + '">' +
        //         '<h4 class="ft14 gray-6 ' + isCheckedft + '">' +
        //             val.header +
        //         '</h4>' +
        //         '<p class="ft12 gray-9">' + val.content + '</p>' +
        //         '</div>' +
        //         '</div>';
        // });
        // // alert(rangeStr);
        // if (oBox.hasClass('active')) {
        //     $('.rangeCon').remove();
        // }
        // oBox.append(rangeStr).addClass('active');
        //
        // // 计算box高度
        // var boxHeight = oBox.find('header').height() +
        //     oBox.find('.content').first().height() +
        //     oBox.find('.content').last().height();
        // oBox.height(boxHeight);
        // $('#' + pageId + ' .layer-pop').addClass('active');
        // //市区范围选择
        // oBox.on('click', '.content', function() {
        //     var self = $(this);
        //     var itemSelected = self.find('h4');
        //     var itemSelectedImg = self.find('.imgview');
        //     var otherItem = self.siblings('div').find('h4');
        //     var otherItemImg = self.siblings('div').find('.imgview');
        //     itemSelected.hasClass('green') ? '' : itemSelected.addClass('green');
        //     itemSelectedImg.find('.icon-select').removeClass('hide');
        //     itemSelectedImg.find('.icon-cancel').addClass('hide');
        //     otherItem.hasClass('green') ? otherItem.removeClass('green') : '';
        //     otherItemImg.find('.icon-select').addClass('hide');
        //     otherItemImg.find('.icon-cancel').removeClass('hide');
        //     itemId = +self.attr('data-id');
        //
        //     $('.slide-up-box').height(0);
        //     $('#slide-layer-pop').removeClass('active');
        //     $('.layer-pop').removeClass('active');
        //     selects.forEach(function(val, key) {
        //         //   console.log(val.id, itemId, val.id === itemId);
        //         if (val.id === itemId) {
        //             val.checked = true;
        //             !!callback && callback(val);
        //         } else {
        //             val.checked = false;
        //         }
        //     });
        // }).one('click', '.cancel', function(event) {
        //     //市区范围取消按钮
        //     // $('.slide-up-box').height(0);
        //     // $('#slide-layer-pop').removeClass('active');
        //     // oBox.off('click', '.sure');
        // }).one('click', '.sure', function(event) {
        //     //市区范围取消按钮
        // });
    }
}
/**
 * select
 *
 * @date     2017-01-16
 * @author   zy43766@ly.com
 */
exports.select = {
    init: function(title, selects, handler) {
        // var selectObj = selectObj || $.Select({
        //     data: [{
        //         name: 'dates',
        //         index: 1,
        //         data: selects
        //     }],
        //     selectFn: handler,
        //     maskClose: 1,
        //     title: title,
        //     btnPosition: 'top'
        // })
        // selectObj.open();
    }
}

exports.MathModule = {
    //  function div(arg1,arg2) {
    //     var t1=0,t2=0,r1,r2;
    //     try{
    //         t1 = arg1.toString().split(".")[1].length
    //     }catch(e){

    //     }
    //     try{
    //         t2 = arg2.toString().split(".")[1].length
    //     }catch(e){

    //     }
    //     with(Math){
    //         r1 = Number(arg1.toString().replace(".",""))
    //         r2 = Number(arg2.toString().replace(".",""))
    //         return (r1/r2)*pow(10,t2-t1);
    //     }
    //  }

    // function mul(arg1,arg2) {
    //      var m=0,s1=arg1.toString(),s2=arg2.toString();
    //      try{
    //         m += s1.split(".")[1].length
    //      }catch(e){

    //      }
    //      try{
    //         m += s2.split(".")[1].length
    //      }catch(e){

    //      }
    //      return Number(s1.replace(".","")) * Number(s2.replace(".",""))/Math.pow(10,m);
    // }

    add: function(arg1,arg2) {
        var r1,r2,m;
        try{
            r1=arg1.toString().split(".")[1].length
        }catch(e){
            r1=0
        }
        try{
            r2=arg2.toString().split(".")[1].length
        }catch(e){
            r2=0
        }
        m = Math.pow(10,Math.max(r1,r2));
        return (arg1*m+arg2*m)/m
    },
    sub: function(arg1,arg2){
        var r1,r2,m,n;
        try{
            r1=arg1.toString().split(".")[1].length
        }catch(e){
            r1=0
        }
        try{
            r2=arg2.toString().split(".")[1].length
        }catch(e){
            r2=0
        }
        m = Math.pow(10,Math.max(r1,r2));
        n = (r1>=r2) ? r1:r2;
        return ((arg1*m-arg2*m)/m).toFixed(n);
    }
}
/**
 * 设置标题栏模块
 *
 * @param    {string}  title        标题名
 * @param    {string}  callback     回调函数
 * @returns  void
 *
 * @date     2016-12-30
 * @author   jdw44469@ly.com
 */
 // JS生成[m,n]之间的随机数
exports.SetRandomNumber = {
    RandomNumber: function(Min, Max) {
      var Range = Max - Min;
      var Rand = Math.random();
      return(Min + Math.round(Rand * Range));
    }
}

/**
 * 折叠动作
 *
 * @param
 * @param
 * @returns  void
 *
 * @date
 * @author
 */
exports.foldingAction = {
    init: function(el) {
      var active =  $('#'+ el).siblings('.passengerInfor').hasClass('active');
      if(active){
          $('#'+ el).siblings('.passengerInfor').removeClass('active');
          $('#'+ el).find('.icon_arrow_down').addClass('active');
      }else{
          $('#'+ el).siblings('.passengerInfor').addClass('active');
          $('#'+ el).find('.icon_arrow_down').removeClass('active');
      }
    }
}

exports.ValidModule = {

    /*
     * 身份证15位编码规则：dddddd yymmdd xx p
     * dddddd：6位地区编码
     * yymmdd: 出生年(两位年)月日，如：910215
     * xx: 顺序编码，系统产生，无法确定
     * p: 性别，奇数为男，偶数为女
     *
     * 身份证18位编码规则：dddddd yyyymmdd xxx y
     * dddddd：6位地区编码
     * yyyymmdd: 出生年(四位年)月日，如：19910215
     * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
     * y: 校验码，该位数值可通过前17位计算获得
     *
     * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
     * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
     * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
     * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
     * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
     */
    idCard: function(idCard){
        //15位和18位身份证号码的正则表达式
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

        //如果通过该验证，说明身份证格式正确，但准确性还需计算
        if(regIdCard.test(idCard)){
            if(idCard.length == 18){
                var idCardWi = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
                var idCardY = new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
                for(var i = 0; i < 17; i++){
                    idCardWiSum += idCard.substring(i,i+1)*idCardWi[i];
                }

                var idCardMod = idCardWiSum%11;//计算出校验码所在数组的位置
                var idCardLast = idCard.substring(17);//得到最后一位身份证号码

                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if(idCardMod == 2){
                    if(idCardLast == "X"||idCardLast == "x"){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if(idCardLast==idCardY[idCardMod]){
                        return true;
                    }else{
                        return false;
                    }
                }
            } else if(idCard.length == 15) {
                return true;
            }
        }else{
            return false;
        }
    }
}
// //debug
// window.onerror = function(info, file, line) {
//     $('body').append('<div style="position:absolute;bottom:40px;height:88px;width:100%;padding:0 10px;">' +
//         info +　"<br>" +　file + "<br>" + line +"</div>");
// };
