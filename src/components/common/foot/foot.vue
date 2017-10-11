<template>
    <div class="row footer bg-white col-12 gray-6 ft10 padding10-0">
      <div v-on:touchend="showDialog" @touchstart='changeState("service")' class="column col-4 cen-center">
        <span class="icon service" :class="{'active': service}"></span>
        <span class="marg5-top">咨询客服</span>
      </div>
      <div v-on:touchend="toOrderList" @touchstart='changeState("orders")' class="column col-4 cen-center">
        <span class="icon orders" :class="{'active': orders}"></span>
        <span class="marg5-top">我的订单</span>
      </div>
      <div v-on:touchend="myCoupon" @touchstart='changeState("coupon")' class="column col-4 cen-center relative">
        <div v-if="count > 0" class="number">
          {{count}}张
        </div>
        <span class="icon coupon" :class="{'active': coupon}"></span>
        <span class="marg5-top">抵用券</span>
      </div>
    </div>
</template>
<script>
  // const {PageModule, customerServiceModule} = require('../../../utils/commonUtils');

  export default {
    props: {
      productId: {
        type: Number
      }
    },
    data(){
      return {
        pId:this.productId,
        count:0,
        service: false,
        orders: false,
        coupon: false
      }
    },
    methods: {
      showDialog: function (event) {
        this.service = false;
        customerServiceModule.showDialog();
      },
      toOrderList: function (event) {
        window.location.href = "tctclient://orderCenter/all?refresh=0&backToMine=0&projectTag=guojiyongche";
      },
      myCoupon:function(){
        this.coupon = false;
        //console.log(this.pId);
        PageModule.localJump("couponList", this.pId);
      },
      changeState: function (name) {
        switch (name) {
          case 'service':
            this.service = true;
            break;
          case 'orders':
            this.orders = true;
            break;
          case 'coupon':
            this.coupon = true;
            break;
        }
      }
    }
  }
</script>
<style scoped lang="less">
  // .footer {
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  //   box-shadow: 0px -1px 6px #dcdcdc;
  //
  //   .icon {
  //     width: 23px!important;
  //     height: 23px;
  //   }
  //   .service {
  //     background: url('../../../assets/img/icon_service_gray.png') no-repeat center;
  //     background-size: contain;
  //   }
  //   .service.active {
  //     background-image: url('../../../assets/img/icon_service_gray2.png');
  //   }
  //   .orders {
  //     background: url("../../../assets/img/icon_orders_gray.png") no-repeat center;
  //     background-size: contain;
  //   }
  //   .orders.active {
  //     background-image: url("../../../assets/img/icon_orders_gray2.png");
  //   }
  //   .coupon {
  //     background: url('../../../assets/img/Coupon.png') no-repeat center;
  //     background-size: contain;
  //   }
  //   .coupon.active {
  //     background-image: url('../../../assets/img/Coupon2.png');
  //   }
  // }
</style>
