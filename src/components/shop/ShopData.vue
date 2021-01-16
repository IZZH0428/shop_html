<template>
    <div>
      <el-table
        :data="ShopData"
        style="width: 100%">

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
          label="操作">
          <template slot-scope="scope">
           <!-- <el-button type="primary" icon="el-icon-edit"   @click="toupdate(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="delBrand(scope.row.id)"></el-button>-->
          </template>
        </el-table-column>

      </el-table>
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
    </div>
</template>

<script>
    export default {
        name: "ShopData",
        data(){
          return{
            ShopData:[],
            TypeData:[],
            count:0,
            sizes:[2,3,5,10],
            size:2,
          }
        },methods:{
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
          }).catch(err=>console.log(err))
        },changetype:function (row, column) {
          return row.type==0?"下拉框":row.type==1?"单选框":row.type==2?"复选框":"输入框"
        }
      },created:function () {
        this.queryData(1)
        this.getTypeData()
      }
    }
</script>

<style scoped>

</style>
