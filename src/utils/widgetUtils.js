var TcVui = require('tcvui2');
//console.log(TcVui);
var bridge = TcVui.Bridge
const {airportService} = require('../service/common/airportService');
const {cityService} = require('../service/common/cityService');
const {CacheModule, ArrayModule, timeModule} = require('../utils/commonUtils');

var SelectCityWidget = {

    init: function(title, sName, subTitle, tips, headerCitys, allCitys, handler) {
        var jsonObj = {
                title: title,
                sName: sName,
                cityConfig: [{
                    subTitle: subTitle,
                    tips: tips,
                    headerCitys: headerCitys,
                    allCitys: allCitys
                }]
            };
        bridge.map.$city(jsonObj).then(function(data){
            if (!data || data.status == 1) {
                ToastModule.init("获取数据失败");
                return;
            }
            handler(data);
        });
    },
    initArray: function(title, sName, subTitle, tips, headerCitys, allCitys, handler) {
        var cityConfigList = [];

        for(var i = 0; i < subTitle.length; i++) {
            var cityConfigBean = {
                "subTitle" : "",
                "tips" : "",
                "headerCitys" : "",
                "allCitys" : "",
            };
            cityConfigBean.subTitle = subTitle[i];
            cityConfigBean.tips = tips[i];
            cityConfigBean.headerCitys = JSON.stringify(headerCitys[i]);
            //cityConfigBean.allCitys = cityStaticData.getData(allCitys[i]);
            if(allCitys[i] == cityStaticData.dCity) {
                cityConfigBean.allCitys = cityStaticData.dAllCityList;
            }
            if(allCitys[i] == cityStaticData.oCity) {
                cityConfigBean.allCitys =  cityStaticData.oAllCityList;
            }
            cityConfigList.push(cityConfigBean);
        }
        var jsonObj = {
                "title": title,
                "sName": sName,
                "cityConfig": cityConfigList
        };
        bridge.map.$city(jsonObj).then(function(data){
          if (!data || data.status == 1) {
            ToastModule.init("获取数据失败");
            return;
          }
          handler(data);
        });
    },
    buildAllCitys: function(cityId, cityName, productId, key, title, sName, subTitle, tips, handler) {
        HeaderCitysWidget.build(productId, key, function (headercitys) {
            // alert('HeaderCitysWidget.build`s callback has called! ');
            SelectCityWidget.initArray(title, sName,
                                        subTitle,
                                        tips,
                                        [headercitys, headercitys],
                                        [cityStaticData.dCity, cityStaticData.oCity],
                                        function (data) {
                                            var city = JSON.parse(data.CBData);
                                            HistoryModule.buildCity(key, city.cityInfo, 4);
                                            handler(data);
                                        });
        });
    },
    buildCitys: function(cityId, cityName, productId, key, title, sName, subTitle, tips, handler) {
        if(cityId != null && cityId != "undefined" && cityId != "") {
            cityService.getNearbyList(productId, cityId, function(allCitys){
                //HeaderCitysWidget.build(productId, key, function(headerCitys){
                    var headerCitys = {
                        "tagList": [{
                            "title": "",
                            "longTitle": cityName + "接送机仅支持以下城市",
                            "cellType": "grid",
                            "cityList": []
                        }]
                    };
                    SelectCityWidget.init(title, sName, subTitle, tips,
                                          JSON.stringify(headerCitys),
                                          JSON.stringify(allCitys), function(data){
                        handler(data);
                    });
                //});
            });
        } else {
            cityService.getAvailable(productId, function(allCitys){
                HeaderCitysWidget.build(productId, key, function(headerCitys){
                    SelectCityWidget.init(title, sName, subTitle, tips,
                                          JSON.stringify(headerCitys),
                                          JSON.stringify(allCitys), function(data){
                        var city = JSON.parse(data.CBData);
                        HistoryModule.buildCity(key, city.cityInfo, 4);
                        handler(data);
                    });
                });
            });
        }
    },
    buildAirport: function(key, title, sName, subTitle, tips, handler) {
        console.log("buildAirport");
        airportService.getAvailable(function(allCitys){
            HeaderAirportsWidget.build(key, function(headerCitys){
                SelectCityWidget.init(title, sName, subTitle, tips,
                                      JSON.stringify(headerCitys),
                                      JSON.stringify(allCitys), function(data){
                    var city = JSON.parse(data.CBData);
                    //HistoryModule.buildAirport(key, city.cityInfo, 4);
                    handler(data);
                });
            });
        });
    }
}
exports.SelectCityWidget = SelectCityWidget;

var HistoryModule = {
    buildCity: function buildCity(key, value, length) {
        this.saveHistory(key, value, length);
    },
    buildAirport: function buildAirport(key, value, length) {
        value.cName = value.extend.airportName;
        var history = JSON.parse(CacheModule.get(key)) || [];
        if (value !== "") {
            history.unshift(value);
            history = ArrayModule.uniqueByName(history);
            if (history.length >= length) {
                history.pop();
            }
            CacheModule.set(key, JSON.stringify(history));
        }
    },
    saveHistory: function saveHistory(key, value, length) {
        //alert(JSON.stringify(value));
        var history = JSON.parse(CacheModule.get(key)) || [];
        if (value !== "") {
            history.unshift(value);
            history = ArrayModule.unique(history);
            if (history.length >= length) {
                history.pop();
            }
            //alert(JSON.stringify(history));
            CacheModule.set(key, JSON.stringify(history));
        }
    }
}
exports.HistoryModule = HistoryModule;

var HeaderCitysWidget = {
    build: function build(productId, key, handler) {
        cityService.getHot(productId, function(data){
            var citys = JSON.parse(CacheModule.get(key));
            var history = {
                    "tagList": [{
                        "title": "历史",
                        "longTitle": "历史记录",
                        "cellType": "grid",
                        "cityList": []
                    }]
                };
            if(citys != null && citys != []) {
                history.tagList[0].cityList = citys;
            } else {
                history.tagList = [];
            }
            if(data.tagList[0].cityList.length > 0) {
                history.tagList = history.tagList.concat(data.tagList);
                // alert('history---' + JSON.stringify(history.tagList));
            }
            handler(history);
        });
    }
}
exports.HeaderCitysWidget = HeaderCitysWidget;

var HeaderAirportsWidget = {
    build: function(key, handler) {
        airportService.getHot(function(data){
            //var airports = JSON.parse(CacheModule.get(key));
            var airports = null;
            var history = {
                    "tagList": [{
                        "title": "历史",
                        "longTitle": "历史记录",
                        "cellType": "grid",
                        "cityList": []
                    }]
                };
            if(airports != null && airports != []) {
                history.tagList[0].cityList = airports;
            } else {
                history.tagList = [];
            }
            if(data.tagList[0].cityList.length > 0) {
                history.tagList = history.tagList.concat(data.tagList);
            }
            handler(history);
        });
    }
}
exports.HeaderAirportsWidget = HeaderAirportsWidget;

var userWidget =  {
    getCommonContacts: function(handle) {
      bridge.user.pickCommonTravelers({projectId: "9"}).then(function (data) {
        data = ({}).toString.call(data.CBData) == "[object Object]" ? data.CBData : JSON.parse(data.CBData);
        handle(data.contactList[0]);
      });
    },
    getContacts: function(handle) {
      bridge.user.getContacts({}).then(function (data) {
        data = ({}).toString.call(data.CBData) == "[object Object]" ? data.CBData : JSON.parse(data.CBData);
        handle(data.contactList[0]);
      });
    },
    writeReceipt: function(amount,handle){
      // window._tc_bridge_project.write_invoice({
      //   param:{
      //       invoiceContentInfoList:[{
      //           "invoiceContent": "服务费",
      //           "invoiceContentType": "3",
      //           "invoiceDesc": ""
      //       },
      //       {
      //           "invoiceContent": "旅游服务费",
      //           "invoiceContentType": "9",
      //           "invoiceDesc": ""
      //       }
      //       ],
      //       invoiceTitle: "",
      //       bottomTips: '发票金额￥'+amount+'<br>1、发票会在订单完成后5个工作日内寄出'+
      //       '<br>2、发票金额包含邮寄费用<br>3、发票金额不含抵用券优惠及面付金额',
      //   },
      //   callback:function(data){
      //     data = ({}).toString.call(data.CBData) == "[object Object]" ? data.CBData : JSON.parse(data.CBData);
      //     handle(data);
      //   }
      // })
    }
}
exports.userWidget = userWidget;

var payWidget = {
    init: function(orderId, serialId, totalFee, displayFields, createTime) {
        var payTime = timeModule.getPayTime();
        if(createTime) payTime = timeModule.getPayTime(createTime);
        // alert(JSON.stringify(payTime));
        var orderInfo = {
            "displayFields": displayFields,
            "countDown": {
                "enabled": "1",
                "serverTime": payTime.startTime,
                "expiryTime": payTime.endTime
            },
            "projectTag": "guojiyongche",
            "orderId": orderId,
            "orderSerialId": serialId,
            "totalAmount": ""+totalFee,//totalFee
            "goodsName": "同程旅游国际用车",
            "goodsDesc": "同程旅游国际用车",
            "payInfo": "{\"companyType\":\"1\"}",
            "actionBarTitle": "支付成功",
            "headerTitle": "订单支付成功",
            "paySuccessTip": "请等待服务商接单，车辆信息将在服务开始前通过短信发送给您。",
            "paySucUrl": domain + "#/order_detail?orderId=" + orderId
        };
        var jsonpay = {
                     "param": {
                         "orderInfo": orderInfo,
                         "projectTag": "guojiyongche",
                         "orderId": orderId,
                         "orderSerialId": serialId,
                         "backType": "allOrders"
                     }
                 };
        bridge.pay.payPlatform(jsonpay).then(function (data) {});
    },
    newPay: function(orderId, serialId, totalFee, displayFields, payInfo, createTime) {
        var payTime = timeModule.getPayTime();
        if(createTime) payTime = timeModule.getPayTime(createTime);
        // alert(JSON.stringify(payTime));
        var orderInfo = {
            "displayFields": displayFields,
            "countDown": {
                "enabled": "1",
                "serverTime": payTime.startTime,
                "expiryTime": payTime.endTime
            },
            "projectTag": "guojiyongche",
            "orderId": orderId,
            "orderSerialId": serialId,
            "totalAmount": ""+totalFee,//totalFee
            "goodsName": "同程旅游国际用车",
            "goodsDesc": "同程旅游国际用车",
            "payInfo": payInfo,
            "actionBarTitle": "支付成功",
            "headerTitle": "订单支付成功",
            "paySuccessTip": "请等待服务商接单，车辆信息将在服务开始前通过短信发送给您。",
            "paySucUrl": DOMAIN_URL + "#/order_detail?orderId=" + orderId
        };
        var jsonpay = {
                     "orderInfo": orderInfo,
                     "projectTag": "guojiyongche",
                     "orderId": orderId,
                     "orderSerialId": serialId,
                     "backType": "allOrders"
                 };
        bridge.pay.payPlatform(jsonpay).then(function (data) {
            alert(JSON.stringify(data));
        });
    }
}
exports.payWidget = payWidget;
