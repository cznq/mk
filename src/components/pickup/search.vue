<template lang="html">
  <!-- 公共头部开始 -->
<div>
	<!-- 公共 Tab 开始 -->
  <tab :productId='1'></tab>
  <!-- 公共 Tab 结束 -->
<!-- 公共头部结束 -->
<div v-cloak class="pickup bg-body">
	<div class="p_ari_box gray-6">
		<div class="hangbanhao row cen-start relative marg10-top bg-white padding10 border-bottom05">
			<div class="hb_img marg10-right"></div>
			<!-- <div @click='flightSerch("flightNo")' id="hb_text" class="hb_text column start-cen relative" :class="{'gray-9': !flightNumber, 'gray-6': flightNumber}"> -->
			<router-link :to="{path:'flightSearch/no', query: {name: 'no'}}" class="hb_text column start-cen relative" :class="{'gray-9': !flightNumber, 'gray-6': flightNumber}">
				<div v-if="flightNumber ==''" class="">接机航班号</div>
				<span v-if="flightNumber ==''" class="ft14">若延误司机将免费等待</span>

				<div v-if="flightNumber !=''" class="">{{flightNumber}}</div>
				<span v-if="flightNumber !=''" class="ft14"></span>

				<img v-on:click.stop='pickRemove' id="pick_remove" src="../../assets/img/icon_close_circle.png" class="btn_cancel button ">
			</router-link>

			<div @click='flightSerch("myFlight")' class="my_hb column cen-center relative">
				<span class="img"></span>
				<div class="green">我的航班</div>
				<div class="border-left05 h-right-der"></div>
			</div>
		</div>

		<div @click='selectTime' onselectstart='return false;' class="time row cen-start marg10-top bg-white padding0-15 relative">
			<span class="time-icon"></span>
			<span type="text" v-if="!serviceTime || serviceTime == ''" style="width:90.5%" class="padding10-left gray-9 ft16 tips">请选择上车时间</span>
			<span v-else class="col-11 padding15-left ft16 tips start-cen">{{serviceTime}}</span>
				<img src="../../assets/img/icon_arrow_right.png" class="corner ">
			<div class="border-bottom05 h-divider"></div>
		</div>
		<div @click='selectAir' class="place_up row cen-start bg-white padding0-15 relative">
			<span class="dot_green"></span>
			<span v-if="!airportName || airportName == ''" class='col-11 padding15-left ft16 tips ellipsis gray-9'>请选择出发机场</span>
			<span v-if="airportName && airportName != ''" class='col-11 padding15-left ft16 tips ellipsis gray-9'>{{airportName}}</span>
				<img src="../../assets/img/icon_arrow_right.png" class="icon_right corner">
			<div class="border-bottom05 h-divider"></div>
			<div v-on:click.stop='pickClickOnce' id="pick_scar_failed" class="failed hide"></div>
		</div>
		<div @click='selectGetcity' class="place_down row cen-start bg-white padding0-15">
			<span class="dot_red"></span>
				<span v-if='arrAddress == ""' class='col-11 padding15-left ft16 tips ellipsis gray-9'>您要去哪儿</span>
				<span v-if='arrAddress != ""' class='col-11 padding15-left ft16 tips ellipsis gray-9'>{{arrAddress}}</span>
			<img src="../../assets/img/icon_arrow_right.png" class="icon_right corner">
		</div>
		</div>
		<div id="searchPickExpectedLongDistance" class="map distance_time">
			<p class="tips" v-if='duration&&distance'>
				预计时长{{durationHumanReadable}}，行驶{{distanceHumanReadable}}
			<!--，<p color="#6495ed">点击查看</p> -->
			</p>
		</div>
	<div id="btn_pick_choice_car" @click='toSelectCar' class="car_button green button">去选车</div>
	<br><br><br>

</div>
<foot :productId='10'></foot>
</div>

</template>

<script>
import foot from '../common/foot/foot'
import tab from '../common/tab/tab'
import Vue from 'vue'
// const {choiceTimeModule, ToastModule} = require('../../utils/commonUtils');
// const {SelectCityWidget} = require('../../utils/widgetUtils');
const {pickupProcess} = require('../../process/pickupProcess');
// const {searchPlacePage} = require('../../process/searchPlacePage');
// const {directionsPage} = require('../../process/directionsPage');

export default {
	name: 'pickupSearch',
	components: {
      tab,
      foot
	},
	data() {
      return pickupProcess;
	},
    beforeCreate() {
	  pickupProcess.init();

    },
    methods:{

    }
}
</script>

<style scoped lang="less">
@imgsrc: '../../assets';
.pickup  .p_ari_box  .failed{
		position: absolute;
		top: 0;
		left: 0px;
		width: 100%;
		height: 55px;
		/*border: 1px solid red;*/
		z-index: 999;
}
// /*我的航班号开始*/
.pickup .hangbanhao {
	.hb_img {
		background: url('@{imgsrc}/img/icon_flight_small.png') no-repeat center center;
		background-size: contain;
			width: 20px;
			height: 42px;
			padding:0 5px
	}
	.hb_text {
			width: 66%;
			height: 54px;
				padding: 10px 0 10px 0;
			h2 {
					padding-top: 10px;
					font-size: 16px;
					color: gray;
			}
	}
	.btn_cancel {
			position: absolute;
			width: 20px;
			right: 0;
	}

	.my_hb {
		width:25%;
		margin-left: 5%;
		font-size:13px;
		.img {
				background: url('@{imgsrc}/img/icon_flight_big.png') no-repeat center center;
				background-size: contain;
				width: 30px;
				height: 21px;
		}
	}
}
.pickup .v-divider {
		height: 55px;
}
/*时间选择开始*/
.pickup  .p_ari_box  .time {
		height: 60px;
		.time-icon {
			background: url('@{imgsrc}/img/icon_clock.png') no-repeat center center;
			background-size: contain;
				width: 18px;
				height: 17px;
		}
 }
.h-right-der {
    position: absolute;
    top: 0;
    height: 100%;
    left: 0;
}
.h-divider {
    position: absolute;
    bottom: 0;
    width: 90%;
    right: 0;
}
.pickup  .p_ari_box .corner{
		width: 8px;
}
/*下车地址选择*/
.pickup  .p_ari_box  .place_up {
		height: 55px;
		.dot_green{
			border-radius: 50%;
			background: #23beae;
				margin-left: 5px;
			width: 8px;
			height: 8px;
		}
}
.pickup  .p_ari_box  .place_down {
		height: 55px;
		.dot_red{
	     border-radius: 50%;
	     background: #ff5346;
	     margin-left: 5px;
	     width: 8px;
	     height: 8px;
	 }
}
/*地图开始*/
.pickup   .map {
		width: 100%;
		height: 30px;
		text-align: center;
		color: #999;
		font-size: 12px;
		margin: 5px 0;
		p{
			 line-height: 30px;
	 }
	 a{
	 		color: #00a0ff;
	 }
}
.pickup .distance_time {
		width: 100%;
		height: 30px;
}
.pickup  .car_button {
		width: 90%;
		border-radius: 3px;
		height: 40px;
		line-height: 40px;
		background: #ff5346;
		text-align: center;
		color: #fff;
		margin: auto;
}

</style>
