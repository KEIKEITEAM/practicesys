<template>
  <!-- 修改班级对话框 -->
  <div>
    <el-dialog
      title="修改班级"
      :visible.sync="updateDialogFormVisible"
      @close="updateDialog2"
      :append-to-body="true"
      custom-class="customWidth"
    >
      <el-form :model="form">
        <el-form-item label="专业年级" :label-width="formLabelWidth">
          <el-select v-model="form.grades" placeholder="请选择">
            <el-option
              v-for="item in gradesAll"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业名称" :label-width="formLabelWidth">
          <el-select v-model="form.major.id" placeholder="请选择">
            <el-option
              v-for="item in majorAll"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业班级" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog2">取 消</el-button>
        <el-button type="primary" @click="updateDialog2();updateClassData(classID)">确定修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    uDialog: {
      default: false
    },
    classID: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: "",
        grades: {},
        major: {}
      },
      formLabelWidth: "120px",
      gradesAll: [],
      majorAll: []
    };
  },
  methods: {
    //关闭Dialog
    updateDialog2() {
      this.$emit("setUDailog", false);
    },
    updateClassData(id) {
      this.$axios
        .put(`/api/backstage/class`, {
          id: id,
          name: this.form.name,
          majorId: this.form.major.id,
          gradeId: this.form.grades.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.$emit("refresh", this.form.grades.id+""+this.form.major.id+this.form.name+"");
          }
        });
    },
    //获取全部年级
    getGradeAll() {
      this.$axios.get("/api/backstage/grade").then(res => {
        this.gradesAll = res.data.data.list;
      });
    },
    //获取全部专业 major
    getMajorAll() {
      this.$axios.get("/api/backstage/major").then(res => {
        this.majorAll = res.data.data.list;
      });
    }
  },
  computed: {
    //替换父组件传来的值,打开dialog
    updateDialogFormVisible: {
      get() {
        // console.log(this.uDialog)
        return this.uDialog;
      },
      set() {}
    }
  },
  watch: {
    classID: {
      handler(newVal, objVal) {
        this.$axios.get(`/api/backstage/class/${newVal}`).then(res => {
          this.form = res.data.data;
          // console.log(this.form)
        });
      }
    }
  },
  mounted() {
    this.getGradeAll();
    this.getMajorAll();
  }
};
</script>