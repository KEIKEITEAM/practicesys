<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" size="small" @click="centerDialogVisible = true">添加</el-button>
      </div>

      <div>
        <el-dialog title="添加专业群" :visible.sync="centerDialogVisible" width="30%">
          <el-form :model="form">
            <el-row :gutter="0">
              <el-col :span="24">
                <el-form-item label="专业群名称" label-width="100px">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProfession()">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- <div class="search">
        <el-input placeholder="请输入班级名字" size="small" v-model="search" clearable></el-input>
        <el-button type="primary" size="small">查找</el-button>
      </div>
      <div class="export">
        <el-button type="primary" size="small">导出表格</el-button>
      </div> -->
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="专业群"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDialog(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteClass(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog title="修改专业群" :visible.sync="openUpdateDailog" width="30%">
        <el-form :model="form">
          <el-row :gutter="0">
            <el-col :span="24">
              <el-form-item label="专业群名称" label-width="100px">
                <el-input v-model="profession" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openUpdateDailog = false">取 消</el-button>
          <el-button type="primary" @click="updateProfession()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      tableData: [],
      form: {
        name: ""
      },
      centerDialogVisible: false,
      openUpdateDailog: false,
      profession: "",
      professionId: 0
    };
  },
  methods: {
    //获取列表
    getProfessionalList() {
      this.$axios.get("/api/backstage/professional").then(res => {
        console.log(res);
        this.tableData = res.data.data.list;
      });
    },
    //添加
    addProfession() {
      this.$axios
        .post("/api/backstage/professional", {
          name: this.form.name
        })
        .then(res => {
          console.log(res);
          this.getProfessionalList();
        });
      this.centerDialogVisible = false;
    },
    //修改
    updateProfession() {
      this.$axios
        .put(`/api/backstage/professional`, {
          id: this.professionId,
          name: this.profession
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getProfessionalList()
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        });
      this.openUpdateDailog = false;
    },
    //打开修改对话框，并获取对应信息
    updateDialog(id) {
      this.openUpdateDailog = true;
      this.$axios.get(`/api/backstage/professional/${id}`).then(res => {
        console.log(res);
        this.profession = res.data.data.name;
        this.professionId = res.data.data.id;
      });
    },
    // 删除
    deleteClass(id) {
      this.$axios.delete(`/api/backstage/professional/${id}`).then(res => {
        if (res.data.code == 0) {
          this.getProfessionalList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    }
  },
  mounted() {
    this.getProfessionalList();
  }
};
</script>
<style scoped>
.el-dialog {
  width: 35% !important;
}
.head {
  display: flex;
  width: 100%;
  background: white;
  height: 50px;
  line-height: 50px;
}
.btn {
  margin-left: 10px;
}
.search {
  margin-left: 60px;
  display: flex;
}
.search .el-button {
  height: 31px;
  margin-top: 10px;
}
.export {
  position: absolute;
  right: 20px;
}
</style>
