<template>
  <div class="login_wrapper">
    <div class="login">
      <el-form :model="formLogin">
        <el-form-item>
          <h2 class="title">后台管理系统</h2>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.loginName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登陆</el-button>
        </el-form-item> 
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login {
  width: 460px;
  height: 296px;
  margin-top: 150px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.title {
  text-align: center;
  color: #505458;
}
.el-form-item__content {
  width: 300px;
}
.el-button {
  width: 100%;
}
.el-form {
  margin: 30px 80px auto 80px;
}
.error {
  display: block;
  text-align: center;
  color: red;
}
.recover {
  position: absolute;
  bottom: 0px;
  cursor: pointer;
  color: #e6a23c;
  /*  display: none; */
}
.bei {
  position: absolute;
  bottom: 20px;
  cursor: pointer;
  color: #505458;
}
</style>

<script>
export default {
  name: "login",
  data() {
    return {
      formLogin: {
        //表单对象
        loginName: "user",
        password: "123456"
      }
    };
  },
  methods:{
    login(){
      this.$axios.get('/api/backstage/login',{
        params:{
          username: this.formLogin.loginName,
          password: this.formLogin.password
        }
      }).then(res => {
        console.log(res)
        if(res.data.code==0){
          this.$router.push({
            path: "/index"
          })
        }else{
          this.$message.error('用户名或密码错误！请重新输入');
        }
      })
    }
  }
};
</script>
