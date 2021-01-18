<template>
    <div>
      <div id="searchDiv" align="center">

        <el-form :inline="true" :model="searchForm" class="demo-form-inline">

          <el-form-item label="名称">
            <el-input v-model="searchForm.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchbtu">查  询</el-button>

        </el-form>
      </div>
      <el-table
        :data="ShopData"
        style="width: 100%"
     >

        <el-table-column
          prop="id"
          label="序号"
          width="180">
        </el-table-column>

        <el-table-column
          prop="name"
          label="英文名">
        </el-table-column>

        <el-table-column
          prop="nameCH"
          label="名称"
          width="180">
        </el-table-column>

        <el-table-column
          prop="typeId"
          label="商品类型"
          :formatter="changetypeId"
        >
        </el-table-column>


        <el-table-column
          prop="type"
          label="属性类型"
          :formatter="changetype">
        </el-table-column>




        <el-table-column
          prop="id"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"   @click="toupdate(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="delBrand(scope.row.id)"></el-button>
            <el-button v-if="scope.row.type!=3" type="success"  @click="toDataValue(scope.row)">属性值维护</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--属性值弹框-->

      <el-dialog :title="nameCH" :visible.sync="dataValueFlag">
        <el-button type="success" @click="toDataValueadd">新增</el-button>
        <el-table
          v-if="!addValueFlag"
          :data="DataValue"
          style="width: 100%">

          <el-table-column
            prop="id"
            label="序号"
            width="150">
          </el-table-column>

          <el-table-column
            prop="value"
            label="英文属性值">
          </el-table-column>

          <el-table-column
            prop="valueCH"
            label="中文属性值"
            width="150">
          </el-table-column>

          <el-table-column
            prop="attId"
            label="属性ID"
            width="150">
          </el-table-column>

          <el-table-column
            prop="id"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit"   @click="toValueUpdate(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete"  @click="delValue(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>


        <!--属性值新增修改模板-->


          <el-form :model="addValueForm" ref="addValueForm"   label-width="100px" v-if="addValueFlag">

            <el-form-item label="属性值英文名" prop="value">
              <el-input v-model="addValueForm.value" autocomplete="off" ></el-input>
            </el-form-item>

            <el-form-item label="属性值中文名" prop="valueCH">
              <el-input v-model="addValueForm.valueCH" autocomplete="off" ></el-input>
            </el-form-item>

            <el-form-item align="right">
              <el-button @click="addValueFlag = false">取 消</el-button>
              <el-button type="primary" @click="addDataValue">确 定</el-button>
            </el-form-item>


          </el-form>



      </el-dialog>












      <!--分页-->
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




















      <!--新增模板-->
      <el-dialog title="属性信息" :visible.sync="addFormFlag">

        <el-form :model="addForm" ref="addForm"   label-width="100px">

          <el-form-item label="属性英文名" prop="name">
            <el-input v-model="addForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="属性中文名" prop="nameCH">
            <el-input v-model="addForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>



          <el-form-item label="商品类型" prop="typeId">
          <el-select v-model="addForm.typeId" placeholder="请选择">
            <el-option
              v-for="item in TypeDatas"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>

          <el-form-item label="属性类型" prop="type">
            <el-radio v-model="addForm.type" :label="0">下拉框</el-radio>
            <el-radio v-model="addForm.type" :label="1">单选框</el-radio>
            <el-radio v-model="addForm.type" :label="2">复选框</el-radio>
            <el-radio v-model="addForm.type" :label="3">输入框</el-radio>
          </el-form-item>

          <el-form-item label="是否为SKU" prop="isSKU">
            <el-radio v-model="addForm.isSKU" :label="0">是</el-radio>
            <el-radio v-model="addForm.isSKU" :label="1">否</el-radio>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addShopData">确 定</el-button>
        </div>
      </el-dialog>







    </div>
</template>

<script>
    export default {
        name: "ShopData",
        data(){
          return{
            searchForm:{
              name:"",
            },
            ShopData:[],
            TypeDatas:[],
            TypeData:[],
            count:0,
            sizes:[2,3,5,10],
            size:2,
            addForm:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:"",
            },
            parentData:{},
            addFormFlag:false,


            /*属性值相关*/
            DataValue:[],
            dataValueFlag:false,
            addValueFlag:false,
            addValueForm:{
              id:"",
              value:"",
              valueCH:"",
              attId:""
            },
            attId:"",
            nameCH:"",



          }
        },methods:{
        delBrand:function(id){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post("http://localhost:8080/api/shopData/del?id="+id).then(res=>{
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
        },
        toupdate:function(row){
          this.$axios.post("http://localhost:8080/api/shopData/queryByid?id="+row.id).then(res=>{
            this.addForm=res.data.data
            this.queryData(1)
          }).catch(err=>console.log(err))
          this.addFormFlag=true
        },
        toadd:function(){
            this.addForm={};
            this.addFormFlag=true
        },addShopData:function(){
          console.log(this.addForm)
          if (this.addForm.id==null) {
            this.$axios.post("http://localhost:8080/api/shopData/add", this.$qs.stringify(this.addForm)).then(res => {
              this.addFormFlag = false
              this.queryData(1)
            }).catch(err => console.log(err))
          }else{
            this.$axios.post("http://localhost:8080/api/shopData/update", this.$qs.stringify(this.addForm)).then(res => {
              this.addFormFlag = false
              this.queryData(1)
            }).catch(err => console.log(err))
          }
        },
        handleCurrentChange:function(page){ //跳转页面
          console.log(page);
          this.queryData(page);
        },handleSizeChange:function(size){ //跳转页面
          this.size=size;
          this.queryData(1);
        },
        queryData:function (page) {
          this.$axios.get("http://localhost:8080/api/shopData/getData?limit="+this.size+"&page="+page).then(res=>{
            this.ShopData=res.data.data;
            this.count=res.data.count;
          }).catch(err=>console.log(err))
        },changetypeId:function (row, column) {
          for (let i = 0; i <this.TypeData.length ; i++) {
            if (row.typeId==this.TypeData[i].id){
              return this.TypeData[i].name
            }
          }
         return "未知"
        },getTypeData:function () {
          this.$axios.get("http://localhost:8080/api/type/getData").then(res=>{
            //console.log(res)
            this.TypeData=res.data.data;
            this.getTypeDatas()
          }).catch(err=>console.log(err))
        },changetype:function (row, column) {
          return row.type==0?"下拉框":row.type==1?"单选框":row.type==2?"复选框":"输入框"
        },getTypeDatas(){
          for (var i = 0; i <this.TypeData.length ; i++) {
            var rs  =this.isParent(this.TypeData[i])
            if (rs==false){
              this.getParent(this.TypeData[i].pid)
              this.TypeData[i].name = "分类列表/"+this.parentData.name+"/"+this.TypeData[i].name
              this.TypeDatas.push(this.TypeData[i])
              //console.log(this.TypeDatas)
            }
          }
        },isParent:function (datas) {
          for (var j = 0; j <this.TypeData.length ; j++) {
            if (datas.id==this.TypeData[j].pid){
             return true
            }
          }
          return false
        },
        getParent:function(pid){
          for (var i = 0; i <this.TypeData.length ; i++) {
            if (this.TypeData[i].id==pid){
              this.parentData=this.TypeData[i]
            }
          }
        },
        searchbtu:function () {
          this.$axios.get("http://localhost:8080/api/shopData/getData?limitit="+this.size+"&page=1&name="+this.searchForm.name).then(res=>{
            this.ShopData=res.data.data;
            this.count=res.data.count;
          }).catch(err=>console.log(err))
        },






        /*属性值相关*/
        toDataValue:function (row) {
          this.attId =row.id
          this.nameCH =row.nameCH+"的选项信息"
          this.dataValueFlag=true;
          this.addValueFlag=false;
          this.$axios.get("http://localhost:8080/api/value/getDataByAttId?attId="+row.id).then(res=>{
            this.DataValue=res.data.data;
            console.log(res)
          }).catch(err=>console.log(err))
        },
        toDataValueadd:function () {
          this.addValueForm={}
          this.addValueFlag=true
        },
        addDataValue:function () {
          this.addValueForm.attId=this.attId
          if (this.addValueForm.id==null){
          this.$axios.post("http://localhost:8080/api/value/add",this.$qs.stringify(this.addValueForm)).then(res=>{
            this.toDataValue(this.addValueForm.attId)
            this.addValueFlag=false
          }).catch(err=>console.log(err))
          }else{
            this.$axios.post("http://localhost:8080/api/value/update",this.$qs.stringify(this.addValueForm)).then(res=>{
              this.toDataValue(this.addValueForm.attId)
              this.addValueFlag=false
            }).catch(err=>console.log(err))
          }
        },
        toValueUpdate:function (row) {
          this.$axios.get("http://localhost:8080/api/value/getDataById?id="+row.id).then(res=>{
            this.addValueFlag=true;
            this.addValueForm=res.data.data
          }).catch(err=>console.log(err))
        },
        delValue:function(id){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post("http://localhost:8080/api/value/del?id="+id).then(res=>{
              this.toDataValue(this.attId)
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
        },














      },created:function () {
        this.queryData(1)
        this.getTypeData()


      }
    }
</script>

<style scoped>

</style>
