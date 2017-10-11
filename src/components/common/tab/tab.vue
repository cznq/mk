<template lang="html">
  <div class="">
    <div class="row tabs ft18 border_bottom05 bg-white">
        <div class="tab-item padding0-10">
          <div @click="toPickup" :class="{'active green': pid===1}">接机</div>
        </div>
        <div class="tab-item padding0-10">
          <div @click="toSend" :class="{'active green': pid===2}">送机</div>
        </div>
        <div class="tab-item padding0-10">
          <div @click="toDaily" :class="{'active green': pid===10}">包车</div>
        </div>
        <div class="tab-item padding0-10">
          <div @click="toLine" :class="{'active green': pid===100}">线路</div>
        </div>
        <div class="tab-item padding0-10">
          <div @click="toSelfdrive" :class="{'active green': pid===1001}">自驾</div>
        </div>
    </div>
  </div>

</template>

<script>
  // const {sendProcess} = require('../../../process/sendProcess');
  // const {pickupProcess} = require('../../../process/pickupProcess');
  // const {dailyProcess} = require('../../../process/dailyProcess');
  // const {PageModule} = require('../../../utils/commonUtils');

  export default {
  name: 'tab',
  props: {
    productId: {
      type: Number
    }
  },
  data: function () {
    return {
        pid : this.productId
    };
  },
  methods: {
      toPickup: function (event) {
          sendProcess.clear();
          dailyProcess.clear();
          PageModule.localJump("pickupSearch");
      },
      toSend: function (event) {
          pickupProcess.clear();
          dailyProcess.clear();
          PageModule.localJump("sendSearch");
      },
      toDaily: function (event) {
        pickupProcess.clear();
        sendProcess.clear();
        PageModule.localJump("dailySearch");
      },
      toLine: function (event) {
        pickupProcess.clear();
        sendProcess.clear();
        dailyProcess.clear();
        PageModule.localJump("lineSearch");
      },
      toSelfdrive: function () {
        PageModule.localJump("selfdriveSearch");
      }
  }

}
</script>

<style scoped lang="less">
// .tabs {
//     height: 44px;
//     .tab-item {
//       text-align: center;
//       line-height: 41px;
//       box-sizing: border-box;
//       flex: 1;
//     }
//     .active {
//         border-bottom: 3px solid #23beae;
//     }
// }

</style>
