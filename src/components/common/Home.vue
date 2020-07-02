<template>
  <div class="home">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box">
      <div class="content_wrapper">
        <div class="content" style="flex:1;">
          <div class="content_inner">
            <router-view></router-view>
          </div>
        </div>
        <v-footer></v-footer>
      </div>
    </div>
  </div>
</template>
<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vFooter from "./Footer.vue";
export default {
  components: {
    vSidebar,
    vHead,
    vFooter
  },
  mounted() {
  }
};
</script>
<style scoped>
.content-box {
  position: absolute;
  right: 0;
  width: calc(100% - 250px);
  height: calc(100% - 60px);
  overflow-y: scroll;
  background: #f0f0f0;
}
.content_wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.content {
  width: auto;
  padding: 10px;
}
.content_wrapper .content_inner {
  height: 100%;
  width: 100%;
}
</style>