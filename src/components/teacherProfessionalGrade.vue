<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" @click="centerDialogVisible = true">添加</el-button>
      </div>
      <div class="btn">
        <el-button type="primary" @click="getEnough">未满实习学生的老师</el-button>
      </div>

      <div class="btn">
        <el-button type="primary" @click="internDialogVisible = true">随机分配实习生</el-button>
      </div>

      <div>
        <el-dialog title="随机分配实习生" :visible.sync="internDialogVisible" width="30%">
          <el-form :model="form">
            <el-form-item label="实习指导老师" label-width="120px">
              <el-select v-model="tpgId" placeholder="请选择班级">
                <el-option
                  v-for="item in enoughTeacher"
                  :key="item.id"
                  :label="item.teacher.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="internDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="randomChoose()">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <div>
        <el-dialog title="添加专业群" :visible.sync="centerDialogVisible" width="30%">
          <el-form :model="form">
            <el-form-item label="实习指导老师" label-width="120px">
              <el-select v-model="form.teacherNumber" placeholder="请选择班级">
                <el-option
                  v-for="item in teacher"
                  :key="item.name"
                  :label="item.name"
                  :value="item.teacherNumber"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级专业群" label-width="120px">
              <el-select v-model="form.professionalGradeId" placeholder="请选择班级">
                <el-option
                  v-for="item in professionalGrade"
                  :key="item.name"
                  :label="item.grades.name+item.professional.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指导实习生数量" label-width="120px">
              <el-input v-model="form.studentQuantity" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProfession()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.name" placeholder="输入教师姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.professionalId" clearable placeholder="请选择专业群">
            <el-option
              v-for="item in professionalGrade"
              :key="item.professional.id"
              :label="item.professional.name"
              :value="item.professional.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTeacherProfessionalGradeList">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="export">
        <el-button type="primary">导出表格</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="teacher.teacherNumber" label="工号"></el-table-column>
      <el-table-column prop="teacher.name" label="姓名"></el-table-column>
      <el-table-column prop="professionalGrade" label="专业群">
        <template
          slot-scope="scope"
        >{{scope.row.professionalGrade.grades.name}}{{scope.row.professionalGrade.professional.name}}</template>
      </el-table-column>
      <el-table-column prop="studentQuantity" label="指导实习生最大数量"></el-table-column>
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
          <el-form-item label="实习指导老师" label-width="120px">
            <el-select v-model="teacherNumber" placeholder="请选指导老师">
              <el-option
                v-for="item in teacher"
                :key="item.name"
                :label="item.name"
                :value="item.teacherNumber"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级专业群" label-width="120px">
            <el-select v-model="professionalGradeId" placeholder="请选年级专业群">
              <el-option
                v-for="item in professionalGrade"
                :key="item.name"
                :label="item.grades.name+item.professional.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指导实习生数量" label-width="120px">
            <el-input v-model="studentQuantity" auto-complete="off"></el-input>
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
      tableData: [],
      centerDialogVisible: false,
      openUpdateDailog: false,
      form: {
        teacherNumber: "",
        professionalGradeId: "",
        studentQuantity: ""
      },
      teacher: [],
      professionalGrade: [],
      teacherNumber: "",
      professionalGradeId: "",
      studentQuantity: "",
      teacherId: "",
      formInline: {
        name: "",
        professionalId: ""
      },
      page: {
        currentPage: 1,
        limit: 20
      },
      internDialogVisible: false,
      enoughTeacher:{},
      tpgId:""
    };
  },
  methods: {
    //获取教师专业年级列表
    getTeacherProfessionalGradeList() {
      this.$axios
        .get("/api/backstage/teacherProfessionalGrade", {
          params: {
            page: this.page.currentPage,
            limit: this.page.limit,
            name: this.formInline.name,
            professionalId: this.formInline.professionalId
          }
        })
        .then(res => {
          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    //获取年级专业群
    getProfessionalGrade() {
      this.$axios.get("/api/backstage/professionalGrade").then(res => {
        this.professionalGrade = res.data.data.list;
      });
    },
    //获取教师信息
    getTeacher() {
      this.$axios.get("/api/backstage/teacher").then(res => {
        // console.log(res);
        this.teacher = res.data.data.list;
      });
    },
    getEnough() {
      this.$axios("/api/backstage/teacherProfessionalGrade/getEnough").then(
        res => {
          console.log(res);
          this.tableData = res.data.data.list;
        }
      );
    },
    getEnough2() {
      this.$axios("/api/backstage/teacherProfessionalGrade/getEnough").then(
        res => {
          console.log(res);
          this.enoughTeacher = res.data.data.list
        }
      );
    },
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getTeacherProfessionalGradeList();
    },
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getTeacherProfessionalGradeList();
    },
    //添加
    addProfession() {
      this.$axios
        .post("/api/backstage/teacherProfessionalGrade", {
          teacherNumber: this.form.teacherNumber,
          professionalGradeId: this.form.professionalGradeId,
          studentQuantity: this.form.studentQuantity
        })
        .then(res => {
          // console.log(res);
          this.getTeacherProfessionalGradeList();
        });
      this.centerDialogVisible = false;
    },
    //修改
    updateProfession() {
      this.$axios
        .put("/api/backstage/teacherProfessionalGrade", {
          id: this.teacherId,
          teacherNumber: this.teacherNumber,
          professionalGradeId: this.professionalGradeId,
          studentQuantity: this.studentQuantity
        })
        .then(res => {
          console.log(res);
          this.getTeacherProfessionalGradeList();
        });
      this.openUpdateDailog = false;
    },
    //打开修改对话框，并获取对应信息
    updateDialog(id) {
      this.openUpdateDailog = true;
      this.$axios
        .get(`/api/backstage/teacherProfessionalGrade/${id}`)
        .then(res => {
          // console.log(res);
          this.teacherId = id;
          this.studentQuantity = res.data.data.studentQuantity;
          this.teacherNumber = res.data.data.teacher.teacherNumber;
          this.professionalGradeId = res.data.data.teacher.professional.id;
        });
    },
    randomChoose(){
      this.$axios
        .post(`/api/backstage/teacherStudent/randomChoose/${this.tpgId}`)
        .then(res => {
          this.internDialogVisible = false
          console.log(res)
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
      });
    },
    // 删除
    deleteClass(id) {
      this.$axios
        .delete(`/api/backstage/teacherProfessionalGrade/${id}`)
        .then(res => {
          if (res.data.code == 0) {
            this.getTeacherProfessionalGradeList();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          }
      });
    }
  },
  mounted() {
    this.getTeacherProfessionalGradeList();
    this.getProfessionalGrade();
    this.getTeacher();
    this.getEnough2()
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
