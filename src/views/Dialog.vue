<template>
<!-- dialog中嵌套form表单，并进行验证 -->
  <div class="business-card">
    <el-form :inline="true" :model="filterForm" class="filter-form">
      <el-form-item label="姓名：" :span="6">
        <el-input
          v-model="filterForm.name"
          placeholder="姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="区域：" :span="6">
        <el-input
          v-model="filterForm.customerRegion"
          placeholder="区域"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCustomerInfoData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd" class="filter-form-add-btn">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="customer-content">
      <el-table
        :data="customerInfo"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobilephone" label="手机号码"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="regionName" label="区域"> </el-table-column>
        <el-table-column prop="department" label="部门"> </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <i
              title="编辑"
              class="el-icon-edit-outline"
              style="font-size: 24px; color:#1792E6"
              @click="handleEditForCard(scope.$index,scope.row)"
            ></i>
            <i
              title="手机号码"
              class="el-icon-phone-outline"
              aria-hidden="true"
              style="font-size: 24px; color:#3BC35A"
              @click="handleEditForPhone(scope.$index,scope.row)"
              circle
            ></i>
            <i
              title="删除"
              class="el-icon-delete"
              style="font-size: 24px; color:#E54C48"
              @click="handleDelete(scope.$index,scope.row)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="w-pagination">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增/编辑名片/编辑手机号弹窗 -->
    <el-dialog
      :title="operation == 1 ? '新增名片' : (operation == 2?'编辑名片':'编辑手机号码')"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="handleDialogClose()"
    >
      <el-form :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm" label-width="100px" >
        <el-form-item label="姓名：" prop="name" key="name" v-if="operation == 1 || operation == 2">
          <el-input
            v-model="ruleForm.name"
            placeholder="姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobilephone" key="mobilephone" v-if="operation == 1 || operation == 3">
          <el-input
            v-model="ruleForm.mobilephone"
            placeholder="手机号码"
            ref="mobilePhoneFocus"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="verificationCode" key="verificationCode" v-if="operation == 1 || operation == 3" class="verification-code-item">
          <el-input v-model="ruleForm.verificationCode" @input="input()"></el-input>
          <el-button type="primary" @click="sendCode" :disabled="codeDisabled" v-if="verificationCodeShow">发送验证码
          </el-button>
          <el-button type="primary" :disabled="codeDisabled" v-if="!verificationCodeShow">{{btntxt}}
          </el-button>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" key="email" v-if="operation == 1 || operation == 2">
          <el-input v-model="ruleForm.email" ref="emailFocus"></el-input>
        </el-form-item>
        <el-form-item label="区域：" key="regionName" v-if="operation == 1 || operation == 2">
          <PopupTreeInput
            :treeData="regionFrom"
            :props="regionFormProps"
            :propLabel="ruleForm.regionName"
            :nodeKey="'' + ruleForm.regionId"
            :currentChangeHandle="addFormCurrentChangeHandle"
            @sendId="getId"
          ></PopupTreeInput>
        </el-form-item>
        <el-form-item label="部门：" key="department" v-if="operation == 1 || operation == 2">
          <el-input v-model="ruleForm.department"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click.native="submitDialogForm()" 
          :loading="editLoading"
          :disabled="dialogbtnDisabled"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import axios from "../../http/axios";

export default {
  name: "BusinessCard",
  components:{
    PopupTreeInput,
  },
  data() {
    var validateMobilePhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      if (!value) {
        this.validateMobilePhoneFlag = false;
        return callback(new Error("请输入电话号码"));
      }
      // setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          this.validateMobilePhoneFlag = false;
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            this.validateMobilePhoneFlag = true;
            callback();
          } else {
            this.validateMobilePhoneFlag = false;
            callback(new Error("请输入正确的电话号码"));
          }
        }
      // }, 100);
      // console.log(this.validateMobilePhoneFlag,"this.validateMobilePhoneFlag = true;")
    };
    var validateEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        this.validateEmailFlag = false;
        return callback(new Error("请输入邮箱"));
      }
      // setTimeout(() => {
        if (mailReg.test(value)) {
          this.validateEmailFlag = true;
          callback();
        } else {
          this.validateEmailFlag = false;
          callback(new Error("请输入正确的邮箱格式"));
        }
      // }, 100);
      // console.log(this.validateEmailFlag,"this.validateEmailFlag = true;")
    };
    return {
      filterForm: {
        name: "",
        customerRegion: "",
      },
      loading: false,
      customerInfo: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 1, //总页数

      //弹框
      operation: 1, // 1:新增, 2:编辑名片,3:编辑手机号码
      dialogVisible: false, // 新增/编辑名片/编辑手机号码弹框
      validateMobilePhoneFlag: false, //手机号是否验证通过
      validateEmailFlag: false, //邮箱是否验证通过
      ruleForm: {
        name: "",
        mobilephone:"",
        verificationCode:"",
        email:"",
        regionName: "",
        regionId: "",
        // regionid: "",
        department: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: ["blur","change"] },
        ],
        mobilephone: [
           { required: true, validator: validateMobilePhone, trigger: ["blur","change"] }
        ],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: ["blur","change"] },
        ],
        email: [
          { required: true, validator: validateEmail, trigger: ["blur","change"] },
        ],
      },
      //验证码
      codeDisabled: false,
      verificationCodeShow: true, //发送验证码
      codetime: 0,
      btntxt: "重新发送",
      //区域
      label: "",
      regionFrom: [],
      regionFormProps: {
        label: "label",
        children: "children",
      },
      editLoading: false,
    };
  },
  computed:{
    dialogbtnDisabled:function(){
      let temp = true;
      if(this.operation == 1) {
        temp = this.ruleForm.name == '' || this.ruleForm.verificationCode == '' || !this.validateMobilePhoneFlag || !this.validateEmailFlag;
      }else if(this.operation==2) {
        temp = this.ruleForm.name == ''|| this.ruleForm.name == null || !this.validateEmailFlag;
      }else{
        temp = this.ruleForm.verificationCode == ''|| this.ruleForm.verificationCode == null || !this.validateMobilePhoneFlag;
        console.log(temp,this.ruleForm.verificationCode,this.validateMobilePhoneFlag,"this.operation == 3")
      }
      return temp;
    }
  },
  mounted() {
    this.getCustomerInfoData();
    this.getRegionForm();
  },
  methods: {
    // 获取表格数据
    getCustomerInfoData() {
      this.loading = true;
      let params = {
        name: this.filterForm.name,
        regionName: this.filterForm.customerRegion,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      this.$api.sms_message.customerQuery(params).then((res) => {
        // console.log(res, "======================res=====================");
        if (res.code == 200) {
          this.customerInfo = res.data.content;
          this.currentPage = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.totalCount = res.data.totalSize;
          this.loading = false;
        }
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getCustomerInfoData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCustomerInfoData();
    },
    // 显示编辑名片页面
    handleEditForCard(index,row) {
      this.operation = 2, //显示编辑名片界面
      this.dialogVisible = true;
      Object.assign(this.ruleForm, row);
      this.$nextTick(()=>{
        this.$refs.ruleForm.validate(()=>{});  //手动触发校验
      });
    },
    // 显示编辑手机号码页面
    handleEditForPhone(index,row){
      this.operation = 3, //显示编辑手机号码界面
      this.dialogVisible = true;
      Object.assign(this.ruleForm, row);
      this.$nextTick(()=>{
        this.$refs.ruleForm.clearValidate();
        this.$refs.ruleForm.validateField("mobilephone");  //手动触发手机校验
      });
    },
    // 删除操作
    handleDelete (index,row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
          this.$api.sms_message.delManageBook({id: row.id }).then((res)=>{
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.getCustomerInfoData();
              } else {
                this.$message.error(res.msg);
                return;
              }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 显示新增界面
    handleAdd() {
      this.operation = 1, //显示新增界面
      this.dialogVisible = true;
      this.ruleForm = {
          name: "",
          mobilephone: "",
          email: "",
          regionName: "",
          department: "",
      };
      this.$nextTick(()=>{
        this.$refs.ruleForm.clearValidate(); //清除表单项校验结果,不清除表单项数值
      });
    },
    //发送验证码
    sendCode() {
      const reg = /^1[3|4|5|6|7|8|9]\d{9}$/
      if (this.ruleForm.mobilephone == '') {
          this.$message({
              message:'请输入手机号码',
              center: true,
              type: "error",
          })
          return
      }
      if (!reg.test(this.ruleForm.mobilephone)) {
          this.$message({
              message:'请输入正确的手机号码',
              center:true,
              type: "error",
          })
          return
      } else {
          this.$api.sms_message.getVerificationCode({mobilephone:this.ruleForm.mobilephone}).then((res) => {
            if (res.code == 200) {
              this.$message({
                  message: res.msg,
                  type: 'success',
                  center:true
              });
              this.codetime = 60;
              this.timer();
            }
          });
      }
    },
    //60s倒计时
    timer() {
      if (this.codetime > 0) {
          this.codeDisabled = true;
          this.verificationCodeShow = false;
          this.codetime--;
          this.btntxt = this.codetime + "s后重新获取";
          setTimeout(this.timer, 1000);
      } else {
          clearInterval(this.timer); // 清除定时器
          this.codetime = 0;
          this.btntxt = "获取验证码";
          this.codeDisabled = false;
          this.verificationCodeShow = true;
      }
    },
    // 获取区域列表
    getRegionForm() {
      let regionId = sessionStorage.getItem("regionid");
      let address = `${this.global.baseUrl}/region/findRegionTreeNode/${regionId}`;
      axios({
        method: "get",
        url: address,
      }).then((res) => {
        console.log(res,'==============================getRegionForm');
        this.regionFrom = res.data;
        this.label = res.data[0].label;
        this.ruleForm.regionName = this.label;
        console.log(this.ruleForm.regionName,'this.ruleForm.regionName')
        console.log(this.regionFrom,'this.regionFrom')
      });
    },
     // 区域列表点击响应
    addFormCurrentChangeHandle(data, node) {
      console.log(data,node,"data-node-------------");
      this.ruleForm.regionId = node.data.regionId;
      this.label = node.data.label;
      this.ruleForm.regionName = this.label;
    },
    getId(v) {
      console.log(v,'v---------------')
      if (v.label) {
        this.ruleForm.regionName = v.label;
        this.ruleForm.regionId = v.regionId;
      // }else {
      //   this.ruleForm.deptId = v.id;
      //   this.ruleForm.deptName = v.name;
      }
    },
    submitDialogForm(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.ruleForm);
            console.log(params, "params==========");
            if(this.operation == 1) {
              this.$api.sms_message.addBook(params).then((res) => {
                  // console.log(res,"add return data======");
                  this.editLoading = false;
                  if(res.code == 200){
                    this.$message({ message: "新增成功", type: "success" });
                    this.handleDialogClose();
                    
                  }else {
                    this.$message({
                      message: "新增失败, " + res.msg,
                      type: "error",
                    });
                  }
                  this.getCustomerInfoData();
              })
            }else if(this.operation == 2) {
              this.$api.sms_message.updateBook(params).then((res) => {
                  // console.log(res,"edit return data======");
                  this.editLoading = false;
                  if(res.code == 200){
                    this.$message({ message: "名片编辑成功", type: "success" });
                    this.handleDialogClose();
                    
                  }else {
                    this.$message({
                      message: "编辑失败, " + res.msg,
                      type: "error",
                    });
                  }
                  this.getCustomerInfoData();
              })
            }else{
              this.$api.sms_message.updateMobilePhone(params).then((res) => {
                  // console.log(res,"editPhone return data======");
                  this.editLoading = false;
                  if(res.code == 200){
                    this.$message({ message: "手机号码编辑成功", type: "success" });
                    this.handleDialogClose();
                    
                  }else {
                    this.$message({
                      message: res.msg,
                      type: "error",
                    });
                  }
                  this.getCustomerInfoData();
              })
            }
          });
        }else{
          this.$message({ message: "请确保信息填写完整且格式正确", type: "error" });
        }
      });
    },
    handleDialogClose() {
      this.dialogVisible = false;
      // this.ruleForm = {
      //     name: "",
      //     mobilephone: "",
      //     email: "",
      //     regionName: "",
      //     department: "",
      // };
      if(this.$refs.ruleForm){
        // if(this.operation == 1) {
        //   this.$refs.ruleForm.clearValidate(); //清除表单项校验结果,不清除表单项数值
        // }else if (this.operation ==2){
        //   this.$refs.ruleForm.clearValidate("name"); //清除表单项校验结果,不清除表单项数值
        //   this.$refs.ruleForm.clearValidate("email"); //清除表单项校验结果,不清除表单项数值
        // }else{
        //   this.$refs.ruleForm.clearValidate("mobilephone"); //清除表单项校验结果,不清除表单项数值
        //   this.$refs.ruleForm.clearValidate("verificationCode"); //清除表单项校验结果,不清除表单项数值
        // }
        // this.$refs.ruleForm.clearValidate(); //清除表单项校验结果,不清除表单项数值
        this.$refs.ruleForm.resetFields(); //清除表单项校验结果,也清除表单项数值

      };
      this.codetime = 0;
      this.validateMobilePhoneFlag = false;
      this.validateEmailFlag = false;
    },
    input(){
      this.$forceUpdate(); //强制页面刷新
    }
  },
};
</script>

<style lang="scss" scoped>
.business-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  .filter-form {
    text-align: left;

    .el-form-item {
      margin-right: 24px;

      .el-button {
        width: 81px;
        height: 37px;
        line-height: 11px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        /deep/ span {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          // line-height: 20px;
          color: #f8f9fa;
          opacity: 1;
        }
      }

      .filter-form-add-btn {
        background:#F8F9FA;
        border-color: #F8F9FA;
        /deep/ span {
            color: #1592E6;
            opacity: 1;
        }    
      }
    }
  }

  .customer-content {
    flex: 1;

    .el-table {
      width: 100%;
      height: 95%;

      .el-table__body-wrapper {
        .el-table__row {
          .cell {
            i {
              margin-left: 10px;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }

  .el-dialog__wrapper {

    .el-dialog__body {
      .el-form {
        display: flex;
        flex-direction: column;
        .el-form-item {
          display: flex;
          justify-content: center;
          /deep/ .el-form-item__content {
            width: 73%;
          }
        }
        .verification-code-item {
          
          /deep/ .el-form-item__content {
            // display: flex;
            // justify-content: space-between;
              .el-input, .el-input span {
                width: 70%;
                margin-right: 20px;
              }
              .el-button {
                width: 26%;
                height: 40px;
              }
          }
        }
      }
    }
  }
}
</style>
