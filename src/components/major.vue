<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" @click="centerDialogVisible = true">添加</el-button>
      </div>

      <div>
        <el-dialog title="添加专业群" :visible.sync="centerDialogVisible" width="30%">
          <el-form :model="form">
            <el-form-item label="专业群名称" label-width="100px">
              <el-select v-model="form.professionalId" placeholder="请选择">
                <el-option
                  v-for="item in professional"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业名称" label-width="100px">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addMajor()">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.availableOpen" clearable placeholder="选择开放状态">
            <el-option label="未开放" value="false" key="1"></el-option>
            <el-option label="已开放" value="true" key="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.professionalId" clearable placeholder="请选择专业群">
            <el-option
              v-for="item in professional"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMajorList">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="export">
        <el-button type="primary">导出表格</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="professional.name" label="专业名称"></el-table-column>
      <el-table-column prop="name" label="专业名称"></el-table-column>
      <el-table-column prop="open" label="是否开放">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.open"
            inactive-color="#f0f0f0"
            @change="changeOpen(scope.row.open,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
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
          <el-form-item label="专业群名称" label-width="100px">
            <el-select v-model="professionalId" placeholder="请选择">
              <el-option
                v-for="item in professional"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业名称" label-width="100px">
            <el-input v-model="major.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openUpdateDailog = false">取 消</el-button>
          <el-button type="primary" @click="updateProfession()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
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
export default {
  data() {
    return {
      search: "",
      tableData: [],
      form: {
        name: "",
        professionalId: ""
      },
      centerDialogVisible: false,
      openUpdateDailog: false,
      major: {},
      professionalId: "",
      professional: [],
      formInline: {
        availableOpen: "",
        professionalId: ""
      },
      page: {
        currentPage: 1,
        limit: 20
      }
    };
  },
  methods: {
    //获取列表
    getMajorList() {
      this.$axios
        .get("/api/backstage/major", {
          params: {
            page: this.page.currentPage,
            limit: this.page.limit,
            availableOpen: this.formInline.availableOpen,
            professionalId: this.formInline.professionalId
          }
        })
        .then(res => {
          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    //获取专业群列表
    getProfessional() {
      this.$axios.get("/api/backstage/professional").then(res => {
        // console.log(res);
        this.professional = res.data.data.list;
      });
    },
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getMajorList();
    },
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getMajorList();
    },
    //添加
    addMajor() {
      this.$axios
        .post("/api/backstage/major", {
          professionalId: this.form.professionalId,
          name: this.form.name,
          open: false
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
          this.getMajorList();
        });
      this.centerDialogVisible = false;
    },
    //修改
    updateProfession() {
      this.$axios
        .put(`/api/backstage/major`, {
          id: this.major.id,
          name: this.major.name,
          professionalId: this.professionalId
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getMajorList();
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        });
      this.openUpdateDailog = false;
    },
    //开启或关闭权限
    changeOpen(val, id) {
      this.$axios
        .put("/api/backstage/major", {
          id: id,
          open: val
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getMajorList();
          }
        });
    },
    //打开修改对话框，并获取对应信息
    updateDialog(id) {
      this.openUpdateDailog = true;
      this.$axios.get(`/api/backstage/major/${id}`).then(res => {
        console.log(res);
        this.major = res.data.data;
        this.professionalId = res.data.data.professional.id;
      });
    },
    // 删除
    deleteClass(id) {
      this.$axios.delete(`/api/backstage/major/${id}`).then(res => {
        if (res.data.code == 0) {
          this.getMajorList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    }
  },
  mounted() {
    this.getMajorList();
    this.getProfessional();
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
}
.btn {
  margin-left: 10px;
  margin-right: 20px;
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
