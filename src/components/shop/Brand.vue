<template>
    <div>
      <h1 align="center">品牌管理</h1>
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
            prop="bandE"
            label="首字母"
          >
          </el-table-column>

          <el-table-column
            prop="imgpath"
            label="图片">
            <!-- 按文本处理   :formatter="formatImg"    -->
            <!-- 模板处理  html  -->
            <template slot-scope="scope">
              <!-- <img src="192.168.1.43:8080/imgFiless/f86a6cd6-a0e3-47a6-ba03-62a68ff41c99.gif"/>-->
              <img width="50px" :src="scope.row.imgpath"/>
            </template>
          </el-table-column>

          <el-table-column
            prop="bandDesc"
            label="品牌故事">
          </el-table-column>

          <el-table-column
            prop="ord"
            label="排序">
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
      <el-dialog title="品牌信息" :visible.sync="addFormFlag">

        <el-form :model="addForm" ref="addForm"   label-width="80px">

          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="addForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="首写字母" prop="bandE">
            <el-input v-model="addForm.bandE" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="图片" prop="imgpath">
            <div> <img :src="addForm.imgpath" width="80"></div>
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

          <el-form-item label="品牌故事" prop="bandDesc">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="addForm.bandDesc"
              maxlength="50"
              show-word-limit
            >
            </el-input>
          </el-form-item>

            <el-form-item label="排序字段" prop="ord">
              <el-input-number v-model="addForm.ord"  :step="1" :min="0" :max="9999999999"></el-input-number>
            </el-form-item>



        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addBrand">确 定</el-button>
        </div>
      </el-dialog>












    </div>
</template>

<script>
    export default {
        name: "Brand",
      data(){
          return{
            searchForm:{
              name:"",
            },
            addForm:{
              id:"",
              name:"",
              imgpath:"",
              bandE:"",
              bandDesc:"",
              ord:"",
            },
            BrandData:[],
            count:0,
            sizes:[2,3,5,10],
            size:2,
            addFormFlag:false,
          }
      },methods: {
       queryData:function (page) {

         this.$axios.get("http://localhost:8080/api/brand/getData?limit="+this.size+"&page="+page).then(res=>{
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
           this.$axios.post("http://localhost:8080/api/brand/add",this.$qs.stringify(this.addForm)).then(res=>{
             this.addFormFlag=false;
             this.queryData(1);
           }).catch(err=>console.log(err))
         }else{
           console.log(this.$qs.stringify(this.addForm))
           this.$axios.post("http://localhost:8080/api/brand/update",this.$qs.stringify(this.addForm)).then(res=>{
             this.addFormFlag=false;
             this.queryData(1);
           }).catch(err=>console.log(err))
         }

        },toupdate:function (row) {
          this.$axios.post("http://localhost:8080/api/brand/queryByid?id="+row.id).then(res=>{
            this.addFormFlag=true,
              this.addForm=res.data.data
          }).catch(err=>console.log(err))
        },delBrand:function (id) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          this.$axios.post("http://localhost:8080/api/brand/del?id="+id).then(res=>{
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
          this.$axios.get("http://localhost:8080/api/brand/getData?limit="+this.size+"&page=1&name="+this.searchForm.name).then(res=>{
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
