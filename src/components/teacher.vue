<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" @click="centerDialogVisible = true">添加</el-button>
      </div>

      <el-col :span="20">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="输入教师姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.professionalId" clearable  placeholder="请选择专业群">
              <el-option
                v-for="item in professional"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTeacherList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 查找条件 -->
      <div>
        <el-dialog title="添加专业群" :visible.sync="centerDialogVisible" width="30%">
          <el-form :model="form">
            <el-form-item label="工　号" label-width="80px">
              <el-input v-model="form.teacherNumber" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓　名" label-width="80px">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="专业群" label-width="80px">
              <el-select v-model="form.professionalId" placeholder="请选择专业群">
                <el-option
                  v-for="item in professional"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addTeacher()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <el-col :span="2">
        <div class="export">
          <el-button type="primary">导出表格</el-button>
        </div>
      </el-col>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="teacherNumber" label="工号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="grades" label="专业群">
        <template slot-scope="scope">{{scope.row.professional.name}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDialog(scope.row.teacherNumber)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteClass(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog title="修改专业群" :visible.sync="openUpdateDailog" width="30%">
        <el-form :model="form">
          <el-form-item label="工　号" label-width="80px">
            <el-input v-model="teacherNumber" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓　名" label-width="80px">
            <el-input v-model="name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="专业群" label-width="80px">
            <el-select v-model="professionalId" placeholder="请选择专业群">
              <el-option
                v-for="item in professional"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
      page: {
        currentPage: 1,
        limit: 20
      },
      form: {
        name: "",
        professionalId: "",
        teacherNumber: ""
      },
      centerDialogVisible: false,
      openUpdateDailog: false,
      professional: [],
      name: "",
      professionalId: "",
      teacherNumber: "",
      formInline: {
        name: "",
        professionalId: ""
      }
    };
  },
  methods: {
    //获取班级列表
    getTeacherList() {
      this.$axios
        .get("/api/backstage/teacher", {
          params: {
            page: this.page.currentPage,
            limit: this.page.limit,
            name:this.formInline.name,
            professionalId: this.formInline.professionalId
          }
        })
        .then(res => {

          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    //获取年级专业群
    getProfessional() {
      this.$axios.get("/api/backstage/professional").then(res => {

        this.professional = res.data.data.list;
      });
    },
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getTeacherList()
    },
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getTeacherList()
    },
    //添加教师
    addTeacher() {
      this.$axios
        .post("/api/backstage/teacher", {
          teacherNumber: this.form.teacherNumber,
          name: this.form.name,
          professionalId: this.form.professionalId
        })
        .then(res => {
          console.log(res);
        });
    },
    //打开修改对话框，并获取对应信息
    updateDialog(id) {
      this.openUpdateDailog = true;
      this.$axios.get(`/api/backstage/teacher/${id}`).then(res => {

        this.name = res.data.data.name;
        this.teacherNumber = res.data.data.teacherNumber;
        this.professionalId = res.data.data.professional.id;
      });
    },
    // 删除
    deleteClass(id) {
      this.$axios.delete(`/api/backstage/teacher/${id}`).then(res => {
        if (res.data.code == 0) {
          this.getStudentList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    }
  },
  mounted() {
    this.getTeacherList();
    this.getProfessional();
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
