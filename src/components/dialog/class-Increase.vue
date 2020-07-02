<template>
  <!-- 添加班级对话框 -->
  <div>
    <el-dialog
      title="添加班级"
      :visible.sync="dialogFormVisible"
      @close="updateDialog"
      :append-to-body="true"
      width="30%"
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
          <!-- <el-select @change="getMajorAll()" v-model="form.professional" placeholder="请选择专业群">
            <el-option
              v-for="item in majorAll"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select> -->
          <el-select v-model="form.major" placeholder="请选择对应专业">
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
        <el-button @click="updateDialog">取 消</el-button>
        <el-button type="primary" @click="updateDialog();addCalss()">确定添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        grades: "",
        major: "",
        // professional:""
      },
      formLabelWidth: "120px",
      gradesAll: [],
      majorAll: [],
      flag:false
    };
  },
  methods: {
    //关闭Dialog
    updateDialog() {
      this.$emit("setDailog", false);
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
    },
    //添加班级
    addCalss(){
      this.$axios.post('/api/backstage/class',{
        name:this.form.name,
        majorId: this.form.major,
        gradeId: this.form.grades
      }).then(res => {
        if(res.data.code==0){
          this.$emit('refresh',true)
        }
      })
    }
  },
  computed: {
    //替换父组件传来的值,打开dialog
    dialogFormVisible: {
      get() {
        return this.dialog;
      },
      set() {}
    }
  },
  mounted() {
    this.getGradeAll();
    this.getMajorAll();
  }
};
</script>
<style>
</style>