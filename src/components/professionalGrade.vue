<template>
  <div class="index">
    <div class="head">
      <div class="btn">
        <el-button type="primary" @click="centerDialogVisible = true">添加</el-button>
      </div>

      <div>
        <el-dialog title="添加年级专业群" :visible.sync="centerDialogVisible" width="30%">
          <el-form>
            <el-form-item label="专业群名称" label-width="100px">
              <el-select v-model="professionalId" placeholder="请选择">
                <el-option
                  v-for="item in professional"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年 级" label-width="100px">
              <el-select v-model="gradeId" placeholder="请选择">
                <el-option
                  v-for="item in grades"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开 始 时 间" label-width="100px">
              <div class="block">
                <el-date-picker v-model="startTime" type="date" placeholder="选择日期"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="结 束 时 间" label-width="100px">
              <div class="block">
                <el-date-picker v-model="endTime" type="date" placeholder="选择日期"></el-date-picker>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProfessionGrade()">确 定</el-button>
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
          <el-select v-model="formInline.gradeId" clearable placeholder="请选择年级">
            <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getProfessionalGradeList">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- <div class="export">
        <el-button type="primary">导出表格</el-button>
      </div> -->
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="professional.name" label="专业群名称"></el-table-column>
      <el-table-column prop="grades.name" label="年级"></el-table-column>
      <el-table-column prop="open" label="是否开放">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.open"
            inactive-color="#f0f0f0"
            @change="changeOpen(scope.row.open,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDialog(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteClass(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog title="修改年级专业群" :visible.sync="openUpdateDailog" width="30%">
        <el-form>
          <el-form-item label="专业群名称" label-width="100px">
            <el-select v-model="object.professionalId" placeholder="请选择">
              <el-option
                v-for="item in professional"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年 级" label-width="100px">
            <el-select v-model="object.gradeId" placeholder="请选择">
              <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开 始 时 间" label-width="100px">
            <div class="block">
              <el-date-picker v-model="object.startTime" type="date" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="结 束 时 间" label-width="100px">
            <div class="block">
              <el-date-picker v-model="object.endTime" type="date" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openUpdateDailog = false">取 消</el-button>
          <el-button type="primary" @click="updateProfessionGrade()">确 定</el-button>
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
      startTime: "", //开始时间
      endTime: "", //结束时间
      professional: [], //专业群对象
      professionalId: "", //专业群ID
      grades: {}, //年级对象
      gradeId: "", //年级ID
      centerDialogVisible: false, //添加对话框
      openUpdateDailog: false, //修改对话框
      object: {
        id: 0,
        startTime: "",
        endTime: "",
        gradeId: 0,
        professionalId: 0
      },
      formInline: {
        professionalId: "",
        gradeId: "",
        availableOpen: ""
      },
      page: {
        currentPage: 1,
        limit: 20
      }
    };
  },
  methods: {
    //获取班级列表
    getProfessionalGradeList() {
      this.$axios
        .get("/api/backstage/professionalGrade", {
          params: {
            professionalId: this.formInline.professionalId,
            gradeId: this.formInline.gradeId,
            availableOpen: this.formInline.availableOpen,
            page: this.page.currentPage,
            limit: this.page.limit
          }
        })
        .then(res => {
          console.log(res);
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
    //获取班级列表
    getGrades() {
      this.$axios.get("/api/backstage/grade").then(res => {
        // console.log(res);
        this.grades = res.data.data.list;
      });
    },
    handleSizeChange(nowSize) {
      this.page.limit = nowSize;
      this.getProfessionalGradeList();
    },
    handleCurrentChange(nowPage) {
      this.page.currentPage = nowPage;
      this.getProfessionalGradeList();
    },
    //开启或关闭权限
    changeOpen(val, id) {
      this.$axios
        .put("/api/backstage/professionalGrade", {
          id: id,
          open: val
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getProfessionalGradeList();
          }
        });
    },
    //添加
    addProfessionGrade() {
      this.$axios
        .post("/api/backstage/professionalGrade", {
          professionalId: this.professionalId,
          startTime: this.dateFormat("YYYY-mm-dd HH:MM", this.startTime),
          endTime: this.dateFormat("YYYY-mm-dd HH:MM", this.endTime),
          gradeId: this.gradeId,
          open: false
        })
        .then(res => {
          // console.log(res);
          this.getProfessionalGradeList();
        });
      this.centerDialogVisible = false;
    },
    //修改
    updateProfessionGrade() {
      this.$axios
        .put(`/api/backstage/professionalGrade`, {
          id: this.object.id,
          gradeId: this.object.gradeId,
          professional: this.object.professionalId,
          startTime:
            this.object.startTime.length == 16
              ? this.object.startTime
              : this.dateFormat("YYYY-mm-dd HH:MM", this.object.startTime),
          endTime:
            this.object.endTime.length == 16
              ? this.object.endTime
              : this.dateFormat("YYYY-mm-dd HH:MM", this.object.endTime)
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getProfessionalGradeList();
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
      this.$axios.get(`/api/backstage/professionalGrade/${id}`).then(res => {
        console.log(res);
        this.object.id = res.data.data.id;
        this.object.professionalId = res.data.data.professional.id;
        this.object.gradeId = res.data.data.grades.id;
        this.object.startTime = res.data.data.startTime;
        this.object.endTime = res.data.data.endTime;
      });
    },
    // 删除
    deleteClass(id) {
      this.$axios.delete(`/api/backstage/professionalGrade/${id}`).then(res => {
        if (res.data.code == 0) {
          this.getProfessionalGradeList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    }
  },
  mounted() {
    this.getProfessionalGradeList();
    this.getProfessional();
    this.getGrades();
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
