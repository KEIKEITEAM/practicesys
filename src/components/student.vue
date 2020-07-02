<template>
  <div class="index">
    <div class="head">
      <el-row>
        <el-col :span="1.7">
          <div class="btn">
            <el-button type="primary" @click="centerDialogVisible = true">添加</el-button>
          </div>
        </el-col>
        <!-- 添加对话框 -->
        <div>
          <el-dialog title="添加学生信息" :visible.sync="centerDialogVisible" width="35%">
            <el-form :model="form">
              <el-form-item label="学号" label-width="60px">
                <el-input v-model="form.number" auto-complete="off"></el-input>
              </el-form-item>
              <el-row :gutter="0">
                <el-col :span="12">
                  <el-form-item label="姓名" label-width="60px">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="班级" label-width="60px">
                    <el-select v-model="form.classId" placeholder="请选择班级">
                      <el-option
                        v-for="item in classes"
                        :key="item.id"
                        :label="item.grades.name+item.major.name+item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="电话" label-width="60px">
                    <el-input v-model="form.phone" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Q Q" label-width="55px">
                    <el-input v-model="form.qq" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addStudent">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 查找条件 -->
        <el-col :span="20">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="formInline.name" clearable placeholder="输入姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.professionQuery" clearable placeholder="请选择专业群">
                <el-option
                  v-for="item in professionals"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.majorQuery" clearable placeholder="请选择专业">
                <el-option
                  v-for="item in majors"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.gradeQuery" clearable placeholder="请选择年级">
                <el-option
                  v-for="item in grades"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.classQuery" clearable placeholder="请选择班级">
                <el-option
                  v-for="item in classes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getStudentList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 查找条件 -->
        <el-col :span="2">
          <div class="export">
            <el-button type="primary">导出表格</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="margin-left:10px">
            <el-button type="primary" @click="getNotChooseStudent">未选择实习老师的学生</el-button>
          </div>
        </el-col>
        <el-col :span="2">
          <div style="margin-left:10px">
            <el-button type="primary" @click="internDialogVisible = true">实习生批量选择实习教师</el-button>
          </div>
        </el-col>
      </el-row>

      <div>
        <el-dialog title="添加实习生" :visible.sync="internDialogVisible" width="45%">
          <el-form :model="form">
            <el-form-item label="指导老师" label-width="120px">
              <el-select style="width:50%" v-model="tpgId" placeholder="请选择指导老师">
                <el-option
                  v-for="item in enoughTeacher"
                  :key="item.id"
                  :label="item.teacher.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实 习 生" label-width="120px">
              <el-select style="width:50%" multiple  v-model="studentNumbers" placeholder="请选择实习生">
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
            <el-button @click="internDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStudenAndTeacher()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="studentNumber" label="学号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column label="年级">
        <template
          slot-scope="scope"
        >{{scope.row.classes.grades.name}}{{scope.row.classes.major.name}}{{scope.row.classes.name}}</template>
      </el-table-column>
      <el-table-column prop="tel" label="电话号码"></el-table-column>
      <el-table-column prop="qq" label="Q Q号码"></el-table-column>
      <el-table-column label="是否开放">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.classes.major.open"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDialog(scope.row.studentNumber)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteClass(scope.row.studentNumber)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改对话框 -->
    <div>
      <el-dialog title="添加学生信息" :visible.sync="openUpdateDailog" width="35%">
        <el-form :model="student">
          <el-form-item label="学号" label-width="60px">
            <el-input v-model="student.studentNumber" auto-complete="off"></el-input>
          </el-form-item>

          <el-row :gutter="0">
            <el-col :span="12">
              <el-form-item label="姓名" label-width="60px">
                <el-input v-model="student.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班级" label-width="60px">
                <el-select v-model="classId" placeholder="请选择班级">
                  <el-option
                    v-for="item in classes"
                    :key="item.grades.name+item.major.name+item.name"
                    :label="item.grades.name+item.major.name+item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="电话" label-width="60px">
                <el-input v-model="student.tel" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Q Q" label-width="55px">
                <el-input v-model="student.qq" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openUpdateDailog = false">取 消</el-button>
          <el-button type="primary" @click="updateStudent()">确 定</el-button>
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
      page: {
        currentPage: 1,
        limit: 20
      },
      centerDialogVisible: false,
      openUpdateDailog: false,
      form: {
        name: "",
        number: "",
        classId: "",
        phone: "",
        qq: ""
      },
      student: {},
      classId: "",
      classes: [],
      grades: [],
      majors: [],
      professionals: [],
      formInline: {
        name: "",
        gradeQuery: "",
        professionQuery: "",
        majorQuery: "",
        classQuery: "",
        gradeQuery: ""
      },
      internDialogVisible: false,
      enoughTeacher:{},
      formEnoughTeacher: {
        tpgId: "",
        studentNumbers: ""
      },
    };
  },
  methods: {
    //获取学生列表
    getStudentList() {
      this.$axios
        .get("/api/backstage/student", {
          params: {
            page: this.page.currentPage,
            limit: this.page.limit,
            name: this.formInline.name,
            gradeQuery: this.formInline.gradeQuery,
            professionalQuery: this.formInline.professionQuery,
            majorQuery: this.formInline.majorQuery,
            classQuery: this.formInline.classQuery
          }
        })
        .then(res => {
          console.log(res);
          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    //获取未选择实习老师的学生
    getNotChooseStudent() {
      this.$axios
        .get("/api/backstage/student/getNotChooseStudent")
        .then(res => {
          console.log(res);
          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    //获取班级列表
    getClass() {
      this.$axios.get("/api/backstage/class").then(res => {
        console.log(res);
        this.classes = res.data.data.list;
      });
    },
    //获取年级列表
    getGrades() {
      this.$axios.get("/api/backstage/grade").then(res => {
        console.log(res);
        this.grades = res.data.data.list;
      });
    },
    //获取专业列表
    getMajors() {
      this.$axios.get("/api/backstage/major").then(res => {
        console.log(res);
        this.majors = res.data.data.list;
      });
    },
    //获取专业列表
    getProfessionals() {
      this.$axios.get("/api/backstage/professional").then(res => {
        console.log(res);
        this.professionals = res.data.data.list;
      });
    },
    //当条数大小改变时
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getStudentList();
    },
    //当页数改变时
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getStudentList();
    },
    updateDialog(id) {
      this.openUpdateDailog = true;
      this.$axios.get(`/api/backstage/student/${id}`).then(res => {
        console.log(res);
        this.student = res.data.data;
        this.classId = res.data.data.classes.id;
      });
    },
    addStudent() {
      console.log(this.form.number);
      this.$axios
        .post(`/api/backstage/student`, {
          studentNumber: this.form.number,
          name: this.form.name,
          classId: this.form.classId,
          qq: this.form.qq,
          tel: this.form.phone
        })
        .then(res => {
          this.getStudentList();
          this.centerDialogVisible = false;
          console.log(res);
        });
    },
    addStudenAndTeacher(){
      this.internDialogVisible = false
    },
    updateStudent() {
      this.$axios
        .put(`/api/backstage/student`, {
          studentNumber: this.student.studentNumber,
          name: this.student.name,
          classId: this.classId,
          qq: this.student.qq,
          tel: this.student.phone
        })
        .then(res => {
          this.getStudentList();
          this.openUpdateDailog = false;
          console.log(res);
        });
    },
    getEnough() {
      this.$axios("/api/backstage/teacherProfessionalGrade/getEnough").then(
        res => {
          console.log(res);
          this.enoughTeacher = res.data.data.list
        }
      );
    },
    // 删除
    deleteClass(id) {
      // console.log("jinglai")
      this.$axios.delete(`/api/backstage/student/${id}`).then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getStudentList();
        }
      });
    }
  },
  mounted() {
    this.getStudentList();
    this.getClass();
    this.getGrades();
    this.getMajors();
    this.getProfessionals();
    this.getEnough();
  }
};
</script>
<style scoped>
.index {
  background: white;
}
.page {
  padding: 15px 0;
}
.head {
  display: flex;
  width: 100%;
  background: white;
  height: 110px;
  display: flex;
  flex-direction: column;
}
.btn {
  margin-left: 10px;
  margin-right: 20px;
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
