<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" @click="centerDialogVisible = true">添加</el-button>
      </div>

      

      <div class="export">
        <el-button type="primary">导出表格</el-button>
      </div>

      <el-row>
        <el-col :span="20">
          <div class="search">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item>
                <el-select v-model="formInline.tpgId" clearable placeholder="请选择教师">
                  <el-option
                    v-for="item in teacherProfessionalGrade"
                    :key="item.id"
                    :label="item.teacher.name"
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
                <el-select v-model="formInline.professionalQuery" clearable placeholder="请选择专业群">
                  <el-option
                    v-for="item in professional"
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
                <el-input v-model="formInline.studentName" clearable  placeholder="输入学生姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getPracticeList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="teacherProfessionalGrade.teacher.teacherNumber" label="工号"></el-table-column>
      <el-table-column prop="teacherProfessionalGrade.teacher.name" label="教师姓名"></el-table-column>
      <el-table-column prop="teacherProfessionalGrade.teacher.professional.name" label="专业群"></el-table-column>
      <el-table-column prop="student.name" label="学生姓名"></el-table-column>
      <el-table-column prop="student.studentNumber" label="学号"></el-table-column>
      <el-table-column prop="student.classes.grades.name" label="年级"></el-table-column>
      <el-table-column prop="student.classes.major.name" label="专业"></el-table-column>
      <el-table-column prop="student.classes.name" label="班级"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDialog(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteClass(scope.row.id)">删除</el-button>
        </template>
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
export default {
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      search: "",
      tableData: [],
      page: {
        currentPage: 1,
        limit: 20
      },
      form: {},
      centerDialogVisible: false,
      openUpdateDailog: false,
      data: generateData(),
      value1: [1, 4],
      formInline: {
        tpgId: "",
        gradeQuery: "",
        professionalQuery: "",
        majorQuery: "",
        classQuery: "",
        studentName: ""
      },
      grades: {},
      professional: {},
      majors: {},
      classes: {},
      teacherProfessionalGrade: {}
    };
  },
  methods: {
    //获取班级列表
    getPracticeList() {
      this.$axios
        .get("/api/backstage/teacherStudent", {
          params: {
            page: this.page.currentPage,
            limit: this.page.limit,
            tpgId: this.formInline.tpgId,
            gradeQuery: this.formInline.gradeQuery,
            professionalQuery: this.formInline.professionalQuery,
            majorQuery: this.formInline.majorQuery,
            classQuery: this.formInline.classQuery,
            studentName: this.formInline.studentName
          }
        })
        .then(res => {
          this.page = res.data.data;
          this.tableData = res.data.data.list;
        });
    },
    //当条数大小改变时
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getPracticeList();
    },
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getPracticeList();
    },
    //获取年级列表
    getGrades() {
      this.$axios.get("/api/backstage/grade").then(res => {
        this.grades = res.data.data.list;
      });
    },
    //获取专业群列表
    getProfessionals() {
      this.$axios.get("/api/backstage/professional").then(res => {
        this.professional = res.data.data.list;
      });
    },
    //获取专业列表
    getMajors() {
      this.$axios.get("/api/backstage/major").then(res => {
        this.majors = res.data.data.list;
      });
    },
    //获取班级列表
    getClass() {
      this.$axios.get("/api/backstage/class").then(res => {
        this.classes = res.data.data.list;
      });
    },
    //获取实习教师列表
    getPracticeTeacher() {
      this.$axios.get("/api/backstage/teacherProfessionalGrade").then(res => {
        this.teacherProfessionalGrade = res.data.data.list;
      });
    }
    //删除班级
    // deleteClass(id) {
    //   // console.log("jinglai")
    //   this.$axios.delete(`/api/backstage/student/${id}`).then(res => {
    //     console.log(res)
    //     if (res.data.code == 0) {
    //       this.$message({
    //         message: "删除成功",
    //         type: "success"
    //       });
    //       this.getClassList()
    //     }
    //   });
    // }
  },
  mounted() {
    this.getPracticeList();
    this.getClass();
    this.getGrades();
    this.getMajors();
    this.getProfessionals();
    this.getPracticeTeacher();
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
}
.btn {
  margin-right: 20px;
  margin-bottom: 15px;
}
.search {
  margin-left: 60px;
  display: flex;
}
.search {
  display: flex;
  flex-flow: wrap;
  margin-left: -5px;
}
.export {
  position: absolute;
  right: 20px;
}
</style>
