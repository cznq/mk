<template>

  <div class="hello">
  <TcRefresh>
    <h2>{{msg}}</h2>
     <p>{{count}}
    <button @click="inc">+</button>
    <button @click="dec">-</button>
    <button @click="dinc">+2</button>
    <button @click="tinc">+3</button>
    <button @click="finc">+4</button>
    <button @click="ddfinc">点我</button>
  </p>
  <div id="example">
  </div>
    <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">点击登录</div>
                           
                                <div class="wirelessBtn" @click="login">点击登录</div>
                          
                            
                     
                        </div>
     <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">分享</div>
                           
                                <div class="wirelessBtn" @click="share">点击分享</div>
                          
                            
                     
                        </div>
    <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">city路由页面</div>
                           
                                <div class="wirelessBtn"><router-link to="/city">立即打开</router-link></div>
                          
                            
                     
                        </div>
       <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">原生city</div>
                           
                                <div class="wirelessBtn" @click="opencity">点击原生city</div>
                          
                            
                     
                        </div>
         <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">上传图片</div>
                           
                                <div class="wirelessBtn" @click="upload">点击</div>
                          
                            
                     
                        </div>
        <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">接口请求</div>
                           
                                <div class="wirelessBtn" @click="getDate">getDate</div>
                          
                            
                     
                        </div>
        <div class="wirelessListbg" >
                           
                            <div class="wirelessTitle">拨打电话</div>
                           
                                <div class="wirelessBtn" @click="call">点击拨打</div>
                          
                            
                     
                        </div>
    </TcRefresh>
  </div>
</template>

<script>



import {TcRefresh,bridge} from 'tcvui'
import 'tcvui/static/tcrefresh.min.css'
const { navbar, util, map, user} = bridge.default;

console.log(bridge)

export default {
  name: 'hello',
  components:{
      "TcRefresh": TcRefresh.default,
      "bridge":bridge.default,
    },
  data () {
    return {
      msg: '环境测试',
    }
  },
  beforeCreate (){
    navbar.setNavbar({
      "center": [{"tagname": "tag_click_title", "value": "标题啊"}
      ],
      "right": [{"tagname": "tag_click_city", "value": "苏州", "icon_type": "i_down"}]
    }).then(function(a){
      console.log(a)
    })
  },
  computed: {
    count () {
      return this.$store.state.count
    },
    doneTodosCount () {
      return this.$store.getters.doneTodosCount
   }
  },
  methods: {
    share () {
        navbar.share({
        "tcsharetxt": "用在标题信息展示http://m.ly.com/",
        "tcsharedesc": "这是一段描述内容，应该可以比较长吧",
        "tcshareurl": "http://m.ly.com/",
        "tcshareimg": "http://img1.40017.cn/cn/comm/images/product/20140421/shouji0422.jpg"
    })
    },
    login () {
      user.userLogin({})
    },
    call () {
       util.callTel({
        phone: '10086'
      })
    },
    getDate () {
       util.getData({
            requrl: 'http://tcmobileapitest1.17usoft.com/mymessage/MyMessageHandler.ashx',
            reqbody: { memberId: "b5d0e0dcd3d9b7187eeaee6afae431bc" },
            servicename: 'GetRedPoint'
          }).then(function(data){
            alert(data)
          })
    },
    upload (){
    util.uploadPhoto({
        "imgCount": "12",
        "projectTag": "guoneiyou",
        callback: function (data) {

        }
      })
    },
    opencity () {
      map.city({ title: "测试标题信息",
        sName: "苏州",
        cityConfig: [{
            subTitle: "左tab",
            tips:"请输入城市名称(如北京,bj,Beijing)",
            allCitys:'{"cellType":"line","tagList":[{"title":"当前","longTitle":"用于设置","cellType":"block","cityList":[{"extend":"aiji","cName":"埃及right block","cPY":"aiji","cPYS":"aj"}]},{"title":"line","cellType":"line","cityList":[{"extend":"eeeee","cName":"北京right line","cPY":"beijing","cPYS":"bji"},{"extend":"eeeee22","cName":"北京2right line","cPY":"beijing22","cPYS":"bji"}]}]}'
        }]}).then(function(data){
           console.log(data)
        })
    },
    inc () {
      this.$store.commit({type:'INC_MUTATION'})
    },
    dec () {
      this.$store.commit('dec')
    },
    dinc () {
     this.$store.dispatch({type:'dincrement'})
    },
    tinc (){
    console.log('等待中。。。');
     this.$store.dispatch('actionA').then(() => {
          console.log('完成');
      })
    },
    finc (){
      this.$store.dispatch('actionB');
    },
    ddfinc (){ //手动
      this.$run("incrementAsync", {count:3})
      .then((res) => {
        console.log('ok')
      })
    }
  },
  created() {
      //自动触发
    }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.wirelessListbg {
    background: #ffffff;
    border-radius: 5px;
    height: 80px;
    margin: 5px 10px;
  }

  .wirelessListMoney {
    font-size: $xlarge;
    float: left;
    height: 80px;
    line-height: 80px;
    padding: 0 30px;
    color: $orange;

  }

  .wirelessYen {
    font-size: 14px;
  }

  .wirelessTitle {
    font-size: 14px;
    color: #000;
    float: left;
    margin-top: 30px;
  }

  .wirelessBtn {
    float: right;
    background: $deeporange;
    color: $white;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border-radius: 5px;
    margin-right: 10px;
    top: 50%;
    transform: translate(0, -50%);
    position: relative;
  }
</style>
