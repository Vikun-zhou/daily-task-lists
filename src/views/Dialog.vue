<template>
<!-- 解决三个问题：
    1. 三个弹框合为一个弹框的问题
    2. 再次打开弹框，验证结果依然存在问题
    3. 如何拿到form表单验证结果的问题
 -->
  <div>
    <el-button type="text" @click="open()"
      >点击打开 Dialog</el-button
    >

    <el-dialog
      :title="
        operation > 1 ? (operation == 2 ? '编辑名片' : '编辑手机号码') : '新增'
      "
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item
            label="姓名"
            prop="name"
            v-if="operation == 1 || operation == 2 ? true : false"
          >
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
            v-if="operation == 1 || operation == 2 ? true : false"
          >
            <el-input v-model="form.email" @blur="onEmailBlur"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="tel"
            v-if="operation == 1 || operation == 3 ? true : false"
          >
            <el-input v-model="form.tel" @blur="onTelBlur"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" 
          @click="dialogVisible = false" 
          :disabled="this.form.name == '' || (!this.checkEmail && !this.checkPhone )"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('手机号不能为空'));
        } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            if (reg.test(value)) {
                callback();
            } else {
            return callback(new Error('请输入正确的手机号'));
            }
        }
    };
    var isEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空')); 
      } else {
        const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error("邮箱格式如:admin@163.com"));
        } else {
          callback();
        }
      }
    };
    return {
      form: {
        name: "",
        email: "",
        tel: "",
      },
      dialogVisible: false,
      operation: 1,
      checkPhone: false,
      checkEmail:false,
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        email: [
          { required: true, validator:isEmail, trigger: "blur" },
        ],
        tel: [{ required: true,  validator: checkPhone, trigger: "blur" }],
      },
    };
  },
  methods: {
    open(){
        this.dialogVisible = true;
        this.$nextTick(()=>{
            this.$refs.form.resetFields();
        })
        
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onEmailBlur(){
        if(this.$refs.form){
            this.$refs.form.validateField('email',errorMessage=>{
                if(!errorMessage){
                    this.checkEmail =  true
                }else{
                    this.checkEmail =  false;
                }
                console.log(this.checkEmail,"111111");
            })
        }
    },
    onTelBlur(){
        if(this.$refs.form){
        this.checkPhone = this.$refs.form.validateField('tel',errorMessage=>{
            if(!errorMessage){
                this.checkPhone = true;
            }else{
                this.checkPhone = false;
            }
            console.log(this.checkPhone,"111111222");
        })
        
    }
    }
    
  },
};
</script>

<style>
</style>