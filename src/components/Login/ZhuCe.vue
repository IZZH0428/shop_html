<template>
    <div>
      <el-form :model="addForm"  ref="addForm"   label-width="200px" >




        <el-form-item label="用户账号" prop="name">
          <el-input v-model="addForm.name" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="addForm.idCard" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthday">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="图片" prop="imgPath">
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/brand/upload"
            :on-success="imgCallBack"
            name="img"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="学历" prop="eduId">
          <el-select v-model="addForm.eduId" placeholder="请选择">
            <el-option
              v-for="item in EduData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门" prop="deptId">
          <el-select v-model="addForm.deptId" placeholder="请选择">
            <el-option
              v-for="item in DeptData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUser()">立即创建</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
          <router-link to="/Login">
            <el-button type="primary" round>返回</el-button>
          </router-link>
        </el-form-item>

      </el-form>
    </div>
</template>

<script>
    export default {
        name: "ZhuCe",
      data(){
          return{
            addForm:{
              name:"",
              realName:"",
              password:"",
              sex:"",
              phone:"",
              email:"",
              idCard:"",
              birthday:"",
              imgPath:"",
              eduId:"",
              deptId:"",
            },
            EduData:[
              {"id":1,"name":"小学"},
              {"id":2,"name":"初中"},
              {"id":3,"name":"高中"},
              {"id":4,"name":"大学"},
            ],
        DeptData:[
          {"id":1,"name":"安保"},
          {"id":2,"name":"运维"},
          {"id":3,"name":"测试"},
          {"id":4,"name":"开发"},
        ]
          }
      },methods:{
        /*图片上传*/
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          // 赋值
          console.log(response)
          this.addForm.imgPath=response.data;
        },
        resetForm:function (addFome) {
          this.$refs[addFome].resetFields();
        },
        addUser:function () {
          //console.log(this.addForm)
          this.$axios.post("http://localhost:8080/api/login/addUser",this.$qs.stringify(this.addForm)).then(res=>{

            if (res.data.data==1) {
              this.$message({
                message: '注册成功',
                type: 'success'
              });
              this.$router.push("/Login");
            }else{
              this.$message({
                message: '警告哦，账号已存在',
                type: 'warning'
              });
            }
          }).catch(err=>console.log(err))
        }
      }
    }
</script>

<style scoped>

</style>
