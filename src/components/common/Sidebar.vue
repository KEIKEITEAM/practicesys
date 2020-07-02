<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <el-submenu index="0">
        <template slot="title">
          <i class="el-icon-message"></i>学生管理
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/student">所有学生名单</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/index/teacher">
        <template slot="title">
          <i class="el-icon-menu"></i>教师管理
        </template>
      </el-menu-item>
      <el-menu-item index="/index">
        <template slot="title">
          <i class="el-icon-setting"></i>班级管理
        </template>
      </el-menu-item>
      <el-menu-item index="/index/grade">
        <template slot="title">
          <i class="el-icon-setting"></i>年级管理
        </template>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"></i>实习名单管理
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/practice">老师指导学生名单</el-menu-item>
          <el-menu-item index="/index/teacherProfessionalGrade">实习指导老师名单</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-setting"></i>专业管理
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/major">专业管理</el-menu-item>
          <el-menu-item index="/index/profession">专业群管理</el-menu-item>
          <el-menu-item index="/index/professionalGrade">专业群年级管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>