<template style="background:#0064C8;">
  <body>
  <div class="login" >
    <div class="login_title">
      <p><img src="../../assets/img/jinghui.png" style="width:80px;height:80px;margin-right:30px;"/>郑州市公安局子豪分局抓逃犯平台</p>
    </div>
    <div class="login_main">
      <div class="main_left"></div>
      <div class="main_right">
        <div class="right_title">用户登录</div>
        <form >
          <div class="username">
            <img src="../../assets/img/username.png" alt="">
            <input type="text" placeholder="请输入用户名" v-model="name" autocomplete="off">
          </div>
          <div class="password">
            <img src="../../assets/img/password.png" alt="">
            <input type="password" placeholder="请输入密码" v-model="password" autocomplete="off">
          </div>

          <div style="margin-left: 105px;">
            <el-button type="success" round @click="login">登    录</el-button>
            <el-button type="primary" round>注    册</el-button>
           <!-- <button type="button" class="layui-btn layui-btn-lg layui-btn-radius layui-btn-normal" id="log" onclick="login()">登录</button>
            <button type="button" class="layui-btn layui-btn-lg layui-btn-radius layui-btn-warm" onclick="zhuce()">注册</button>-->
          </div>
          <center><p style="margin-top:20px;font-size:12px;color:#FA6F03;">登录遇到问题，请联系管理员:张子豪</p></center>
        </form>
      </div>
    </div>
    <div class="login_footer">
      <p class="name">版权所有：郑州市公安局子豪分局</p>
      <p>建议浏览器：IE8及以上、360、谷歌、Firefox v22</p>
      <p>技术支持：郑州市公安局子豪公司 联系电话：022-110</p>

    </div>
  </div>
  </body>
</template>

<script>
    export default {
        name: "Login",
      data(){
          return{
            name:"",
            password:"",
          }
      },methods:{
          login:function () {
            if (this.name!=""){
                if (this.password!=""){

                } else{
                  this.$message({
                    message: '警告哦，密码不可为空',
                    type: 'warning'
                  });
                }
            }else{
              this.$message({
                message: '警告哦，用户名不可为空',
                type: 'warning'
              });
            }
          }
      }
    }
</script>

<style scoped>
  @import "../../assets/css/login.css";
</style>
