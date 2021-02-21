<template>
  <div>
    <h1 align="center">角色管理</h1>
    <div id="searchDiv" align="center">

      <el-form :inline="true" :model="searchForm" class="demo-form-inline">

        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchbtu">查  询</el-button>
        <el-button type="success" @click="toadd">新增</el-button>
      </el-form>
    </div>
    <div id="BrandTable">

      <el-table
        :data="BrandData"
        style="width: 100%">

        <el-table-column
          prop="id"
          label="序号"
          width="180">
        </el-table-column>

        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>



        <el-table-column
          prop="id"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"   @click="toupdate(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="delBrand(scope.row.id)"></el-button>
          </template>
        </el-table-column>
        <!--分页-->

      </el-table>
      <el-pagination
        align="right"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="sizes"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </div>




    <!--新增模板-->
    <el-dialog title="角色管理" :visible.sync="addFormFlag">

      <el-form :model="addForm" ref="addForm"   label-width="80px">

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" autocomplete="off" ></el-input>
        </el-form-item>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormFlag = false">取 消</el-button>
        <el-button type="primary" @click="addBrand">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script> export default {
  name: "Menu",
  data(){
    return{
      searchForm:{
            name:"",
          },
          addForm:{
            id:"",
            name:"",
          },
          BrandData:[],
          count:0,
          sizes:[2,3,5,10],
          size:2,
          addFormFlag:false,
        }
      },methods: {
      queryData:function (page) {

        this.$axios.get("http://localhost:8080/api/role/getData?limit="+this.size+"&page="+page).then(res=>{
          this.BrandData=res.data.data;
          this.count=res.data.count;
        }).catch(err=>console.log(err))
      },
      handleCurrentChange:function(page){ //跳转页面
        console.log(page);
        this.queryData(page);
      },handleSizeChange:function(size){ //跳转页面
        this.size=size;
        this.queryData(1);
      },imgCallBack:function(response, file, fileList){ //图片上传的回调函数
        // 赋值
        console.log(response)
        this.addForm.imgpath=response.data;
      },toadd:function(){
        this.addForm={};
        this.addFormFlag=true
      },
      addBrand:function () {
        console.log(this.addForm)
        debugger;

        if (this.addForm.id==null){
          this.$axios.post("http://localhost:8080/api/role/add",this.$qs.stringify(this.addForm)).then(res=>{
            this.addFormFlag=false;
            this.queryData(1);
          }).catch(err=>console.log(err))
        }else{
          console.log(this.$qs.stringify(this.addForm))
          this.$axios.post("http://localhost:8080/api/role/update",this.$qs.stringify(this.addForm)).then(res=>{
            this.addFormFlag=false;
            this.queryData(1);
          }).catch(err=>console.log(err))
        }

      },toupdate:function (row) {
        this.$axios.post("http://localhost:8080/api/role/queryByid?id="+row.id).then(res=>{
          this.addFormFlag=true,
            this.addForm=res.data.data
        }).catch(err=>console.log(err))
      },delBrand:function (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("http://localhost:8080/api/role/del?id="+id).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryData(1);
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: '删除失败'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },searchbtu:function () {
        this.$axios.get("http://localhost:8080/api/role/getData?limit="+this.size+"&page=1&name="+this.searchForm.name).then(res=>{
          this.BrandData=res.data.data;
          this.count=res.data.count;
        }).catch(err=>console.log(err))
      }
    },
    created:function () {
      this.queryData(1);
    }
    }
</script>

<style scoped>

</style>
