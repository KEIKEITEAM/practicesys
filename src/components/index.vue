<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" @click="addDialog">添加</el-button>
        <increase
          :dialog="addDialogFormVisible"
          @setDailog="addGetDialogFormVisible"
          @refresh="refresh2"
        ></increase>
      </div>
      <div class="search">
        <el-input placeholder="请输入班级名字" v-model="search" clearable></el-input>
        <el-button type="primary" @click="getClassList">查找</el-button>
      </div>
      <div class="export">
        <el-button type="primary">导出表格</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="grades" label="年级" width="220">
        <template slot-scope="scope">{{scope.row.grades.name}}</template>
      </el-table-column>
      <el-table-column prop="major" label="专业" width="220">
        <template slot-scope="scope">{{scope.row.major.name}}</template>
      </el-table-column>
      <el-table-column prop="name" label="班级" width="220"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDialog(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteClass(scope.row.id)">删除</el-button>
        </template>
        <update
          :uDialog="updateDialogFormVisible"
          :classID="classID"
          @setUDailog="updateGetDialogFormVisible"
          @refresh="refresh"
        ></update>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="sizes, prev, pager, next,total"
        :current-page="page.page"
        :total="page.totalRecords"
        :page-sizes="[15, 20, 25, 30]"
        :page-size="page.limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Increase from "./dialog/class-Increase";
import Update from "./dialog/class-Update";
export default {
  components: {
    Increase,
    Update
  },
  data() {
    return {
      search: "",
      tableData: [],
      addDialogFormVisible: false,
      updateDialogFormVisible: false,
      classID: 0,
      classname: "",
      flag: "",
      page: {
        currentPage: 1,
        limit: 20
      }
    };
  },
  methods: {
    //打开添加dialog
    addDialog() {
      this.addDialogFormVisible = true;
    },
    //关闭添加dialog
    addGetDialogFormVisible(value) {
      this.addDialogFormVisible = value;
    },
    //打开修改dialog
    updateDialog(id) {
      this.updateDialogFormVisible = true;
      this.classID = id;
    },
    //关闭修改dialog
    updateGetDialogFormVisible(value) {
      this.updateDialogFormVisible = value;
    },
    //获取班级列表
    getClassList() {
      this.$axios
        .get("/api/backstage/class", {
          params: {
            page: this.page.currentPage,
            limit: this.page.limit,
            name: this.classname
          }
        })
        .then(res => {
          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getClassList()
    },
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getClassList()
    },
    //更新时刷新列表
    refresh2(val) {
      this.classname = val;
    },
    refresh(val) {
      this.flag = val;
      console.log(this.flag);
    },
    //删除班级
    deleteClass(id) {
      // console.log("jinglai")
      this.$axios.delete(`/api/backstage/class/${id}`).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getClassList();
        }
      });
    }
  },
  mounted() {
    this.getClassList();
  },
  //监听子组件更改的名称
  watch: {
    classname: "getClassList",
    flag: "getClassList"
  }
};
</script>
<style scoped>
.head {
  display: flex;
  width: 100%;
  background: white;
  height: 50px;
}
.btn {
  margin-left: 10px;
}
.search {
  margin-left: 60px;
  display: flex;
}
.search .el-button {
  height: 40px;
}
.export {
  position: absolute;
  right: 20px;
}
</style>
