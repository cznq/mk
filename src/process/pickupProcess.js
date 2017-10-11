// const {flightService} = require('../service/flight/flightService');
const {CacheModule, PageModule, BeanUtils} = require('../utils/commonUtils');
// const {searchPlacePage} = require('../process/searchPlacePage');

var pickupProcess = {
    PICKUP_PROCESS : "PICKUP_PROCESS",
    userId : "",
    productId : 1,
    airportCode : "",
    flightNumber : "",
    serviceTime : "",
    servicetimeTip : "",
    depAddress : "",
    depAddressDetail : "",
    arrAddress : "",
    arrAddressDetail : "",
    depLat : 0,
    depLng : 0,
    arrLat : 0,
    arrLng : 0,
    cityName : "",
    cityId : 0,
    passengerName : "",
    passengerCellphone : "",
    totalFee : 0,
    carFee : "",
    remark : "",
    priceMark : "",
    merchantCode : "",
    merchantType : 2,
    merchantName : "",
    carTypeId : "",
    carModel : "",
    carPeopleNum : 0,
    carPackageNum : 0,
    estimateKilos : 0,
    estimateMinuts : 0,
    safeSeatFee : "",
    depDate : "",
    depCityCode : "",
    arrCityCode : "",
    depCityName : "",
    arrCityName : "",
    arrAirportName : "",
    arrivalTime : "",
    flightSearchType : "",
    flightsTitle : "",
    createOrderFlag : "",
    couponId : 0,
    couponAmount : 0,
    finalPrice : 0,
    noUseCoupon : false,
    originFee : 0,
    duration : 0,
    distance : 0,
    distanceHumanReadable : '',
    durationHumanReadable : '',
    noUseCoupon : null,
    returnFlag : false,
    showCouponAmount : 0,

    invoiceFee : 0,
    invoiceNo : "",
    invoiceTitle : "",
    invoiceProject : "",
    sendCellphone : 0,
    sendName : "",
    sendAddress : "",
    customerIdentifier : "",
    invoiceFlag : 0,
    handMove : false,
    electronic : 0,
    sendEmail : "",

    casList : {
        seat : null,
        board : null,
        chinese : null,
        insure : null,
        invoice :null
    },

    adultNum : 0,
    childNum : 0,
    childSeatNum : 0,
    chineseGuide : 0,
    plaCardService : 0,
    accidentInsurance : 0,

    showPeopleNum : "",

    insurance : "",
    overseaCellphone : "",
    showOverseaCellphone : "",
    wechat : "",
    togglePicker : "",
    childSeatRule : "",
    airportName: "",

    buildCas: function(data) {
        this.casList.seat = null;
        this.casList.board = null;
        this.casList.chinese = null;
        this.casList.insure = null;
        this.casList.invoice = null;
        for(var i = 0; i < data.length; i++) {
            var cas = data[i];
            switch (cas.type) {
                case 1: this.casList.seat = cas; break;
                case 2: this.casList.board = cas; break;
                case 3: this.casList.chinese = cas; break;
                case 4: this.casList.insure = cas; break;
                case 5: this.casList.invoice = cas; break;
            }
        }
    },

    init: function() {
        var variables = JSON.parse(CacheModule.get(this.PICKUP_PROCESS));
        BeanUtils.merge(variables, this);
        //if(variables.casList) this.casList = variables.casList;
        return this;
    },

    searchAddress: function() {
        CacheModule.set(this.PICKUP_PROCESS, JSON.stringify(BeanUtils.copy(pickupProcess, {})));
        searchPlacePage.cityId = pickupProcess.cityId;
        searchPlacePage.productId = pickupProcess.productId;
        searchPlacePage.cityName = pickupProcess.cityName;
        searchPlacePage.go();
    },

    flightSerch: function( param ) {
      pickupProcess.handMove = false;
        if(param == "myFlight") {
            window._tc_bridge_user.get_device_info({
                param: {}, callback: function (data) {
                    data = ({}).toString.call(data.CBData) == "[object Object]" ? data.CBData : JSON.parse(data.CBData);
                    if (data.memberInfo.memberId) {
                        PageModule.localJump("flightSearch", param);
                    } else {
                        UserUtils.toLogin(H5URL + "/interCarTouch/view/main.html#/flightSearch?myFlight");
                    }
                }
            });
        } else {
            PageModule.localJump("flightSearch", param);
        }
    },

    searchFlightsByNo: function() {
        this.flightSearchType = "flightNo";
        this.flightsTitle = this.depDate + " " + this.flightNumber;
        PageModule.localJump("flights");
    },

    searchFlightsByCity: function() {
        this.flightSearchType = "City";
        this.flightsTitle = this.depCityName + "-" + this.arrCityName + " " + this.depDate;
        PageModule.localJump("flightFlights");
    },

    showHistory: function(key, handler) {
        var history = JSON.parse(CacheModule.get(key)) || [];
        if (history.length !== 0) handler(history);
    },

    getFlightPlan: function(handler) {
        //pickupProcess.debug();
      console.log(this.flightSearchType);
        if (this.flightSearchType === "flightNo") {
            flightService.pickupGetPlanByNo(this.flightNumber, this.depDate, handler);
        }
        if (this.flightSearchType === "City") {
            flightService.pickupGetPlanByCity(this.depCityCode, this.arrCityCode, this.depDate, handler);
        }
    },

    selectFlight: function() {
        PageModule.localJump("pickupSearch");
    },

    search: function() {
        this.data();
        pickupProcess.clear();
        PageModule.jump("pickupSearch");
    },

    selectCar: function() {
        this.data();
        if(this.flightNumber === "" || this.flightNumber === "接机航班号" || this.serviceTime === "接机航班号") {
            ToastModule.init("请填写航班号");
            return false;
        }
        if (this.serviceTime === "" || this.serviceTime === "请选择上车时间") {
            ToastModule.init("请选择上车时间");
            return false;
        }
        if (this.airportCode === "" || this.depAddress === "") {
            ToastModule.init("请选择出发机场");
            return false;
        }
        if (this.arrLat === "" || this.arrLng === "" || this.arrAddress === "") {
            ToastModule.init("您要去哪儿");
            return false;
        }
        //this.source = CacheModule.get(gloab_refid);
        //_hmt.push(['_trackEvent', '接机', '点去选车', this.source && this.source != "" ? this.source : 100003]);
        PageModule.jump("pickupSelectCar");
    },

    createOrder: function() {
        if(pickupProcess.createOrderFlag == 1) {
            pickupProcess.invoiceFee = 0;
            pickupProcess.invoiceFlag = 0;
        }
        pickupProcess.createOrderFlag = 0;
        this.data();
        this.source = CacheModule.get(gloab_refid);
        _hmt.push(['_trackEvent', '接机', '点预订', this.source && this.source != "" ? this.source : 100003]);
        PageModule.jump("pickupCreateOrder");
    },

    submitOrder: function() {
        this.data();
        var kilos = parseInt(this.distance / 1000);
        var minutes = this.duration;
        if(this.createOrderFlag == 1) {
            return;
        } else {
            //alert(this.userId);
            if(this.userId == null || this.userId == "null") {
                ToastModule.init("创建订单失败");
                return;
            }
            this.source = CacheModule.get(gloab_refid);
            //_hmt.push(['_trackEvent', '接机', '点提交订单', this.source && this.source != "" ? this.source : 100003]);
            //CacheModule.remove(gloab_refid);
            pickupService.createOrder(this.userId, this.carTypeId, this.productId, this.cityId, 0, this.depAddress,
                this.depAddress, this.depLat, this.depLng, this.arrAddress, this.arrAddressDetail,
                this.arrLat, this.arrLng, this.passengerName, this.passengerCellphone, this.overseaCellphone, this.flightNumber,
                this.serviceTime + ":00", kilos, minutes, this.remark, this.priceMark,
                this.merchantCode, this.merchantType, this.airportCode, this.couponId, this.couponAmount,
                this.source, this.invoiceFlag, this.adultNum, this.childNum, this.childSeatNum, this.chineseGuide,
                this.plaCardService, this.accidentInsurance, this.wechat, this.insurance, function(data) {
                //alert(JSON.stringify(data));
                if(data.length == 0) {
                    ToastModule.init("创建订单失败");
                    return;
                // } else if(data.totalFee != parseInt(pickupProcess.totalFee)) {
                //     ToastModule.init("价格验证失败");
                //     return;
                } else {
                    pickupProcess.totalFee = data.totalFee;
                    if(pickupProcess.totalFee == 0) {
                        PageModule.jump("orderDetail", "orderId=" + data.id);
                    } else {
                        if (pickupProcess.invoiceTitle && pickupProcess.invoiceTitle != "") {
                            invoiceService.init(pickupProcess.userId,
                                data.id,
                                pickupProcess.invoiceNo, pickupProcess.invoiceTitle, pickupProcess.invoiceProject,
                                pickupProcess.sendCellphone, pickupProcess.sendName, pickupProcess.sendAddress,
                                pickupProcess.customerIdentifier, pickupProcess.electronic, pickupProcess.sendEmail, function(returnData){
                                    pickupProcess.createOrderFlag = 1;
                                    pickupProcess.invoiceTitle = "";
                                    pickupProcess.data();
                                    pickupProcess.pay(data.id, data.serialId);
                                });
                        } else {
                            pickupProcess.createOrderFlag = 1;
                            pickupProcess.data();
                            pickupProcess.pay(data.id, data.serialId);
                        }
                    }
                }
            });
        }
    },

    pay: function(orderId, serialId) {
        //this.totalFee = 0.01;
        payService.weixinPay(orderId, "接机", this.userId, this.totalFee, serialId, ORDER_LIST, "接机", "", 30, PAY_RETURN_URL + orderId, function(data) {
            //alert(JSON.stringify(data));
            if(data.length == 0) {
                ToastModule.init("订单异常，支付失败");
                return;
            } else {
                if(pickupProcess.totalFee == data.totalFee) {
                    window.location.href = data.payUrl;
                } else {
                    ToastModule.init("订单异常，支付失败");
                    return;
                }
            }
        });
    },

    cost: function() {
        if(pickupProcess.casList.seat != null && pickupProcess.childSeatNum > 1) pickupProcess.totalFee = MathModule.add(pickupProcess.totalFee, pickupProcess.casList.seat.fee * (pickupProcess.childSeatNum - 1));
        if(pickupProcess.casList.board != null) pickupProcess.totalFee = MathModule.add(pickupProcess.totalFee, pickupProcess.casList.board.fee * pickupProcess.plaCardService);
        if(pickupProcess.casList.chinese != null) pickupProcess.totalFee = MathModule.add(pickupProcess.totalFee, pickupProcess.casList.chinese.fee * pickupProcess.chineseGuide);
    },

    seatValid: function(childSeatNum, chineseGuide, adultNum, childNum, msg) {
        if((childSeatNum * 1.5 + chineseGuide + adultNum + (childNum - childSeatNum)) > parseInt(this.carPeopleNum)) {
            ToastModule.init(msg);
            return false;
        } else {
          return true;
        }
    },

    estimate: function(handler) {
        this.data();
        if (this.depLat != 0 && this.depLng != 0 && this.arrLat != 0 && this.arrLng != 0) {
            mapService.directions(this.depLat, this.depLng, this.arrLat, this.arrLng, function(data) {
                //alert(JSON.stringify(data));
                if (data.distance != 0 && data.duration != 0) {
                    pickupProcess.distance = data.distance;
                    pickupProcess.duration = data.duration;
                    pickupProcess.distanceHumanReadable = data.distanceHumanReadable;
                    pickupProcess.durationHumanReadable = data.durationHumanReadable;
                } else {
                    pickupProcess.distance = 0;
                    pickupProcess.duration = 0;
                    pickupProcess.distanceHumanReadable = "";
                    pickupProcess.durationHumanReadable = "";
                }
                pickupProcess.data();
                handler(data);
            });
        }
    },

    reconfirm: function() {
        this.data();
        PageModule.jump("pickupSearch");
    },

    platform: function() {
        this.data();
        PageModule.jump("pickupSearch");
    },

    data: function() {
        CacheModule.set(this.PICKUP_PROCESS, JSON.stringify(BeanUtils.copy(pickupProcess, {})));
    },

    clear: function() {
        //searchPlacePage.clear();
        CacheModule.remove(this.PICKUP_PROCESS);
    },

    debug: function() {
        alert(JSON.stringify(pickupProcess));
    }
}
exports.pickupProcess = pickupProcess;
