<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="@/assets/touxiang.png" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click">
          <span class="el-dropdown-link">
           小明
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="changeZh">切换中文</el-dropdown-item>
            <el-dropdown-item command="changeEn">切换英文</el-dropdown-item>
            <el-dropdown-item @click.native="loginOut()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    loginOut(){
      // console.log("点中");
      this.$axios.get('/api/backstage/logout').then(res => {
        if(res.data.code==0){
          this.$router.push('/login')
        }
      })

    }
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  color: #fff;
  background: #07c4a8;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 60px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 60px;
}
.header-right {
  float: right;
  padding-right: 70px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.user-name {
  margin-left: 15px;
  font-size: 16px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
