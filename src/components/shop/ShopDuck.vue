<template>
    <div>
      <h1 align="center">商品管理</h1>
      <div id="searchDiv" align="center">

        <el-form :inline="true" :model="searchForm" class="demo-form-inline">

          <el-form-item label="名称">
            <el-input v-model="searchForm.name" placeholder="名称"></el-input>
          </el-form-item>
         <el-button type="primary" @click="searchbtu">查  询</el-button>
          <!--  <el-button type="success" @click="toadd">新增</el-button>-->
        </el-form>
      </div>
      <div id="BrandTable">

        <el-table
          :data="ShopDuckData"
          style="width: 100%">

          <el-table-column
            prop="id"
            label="序号"
            >
          </el-table-column>

          <el-table-column
            prop="bandId"
            label="品牌"
            :formatter="changebandId"
            >
          </el-table-column>

          <el-table-column
            prop="name"
            label="名称"
           >
          </el-table-column>


          <el-table-column
            prop="title"
            label="标题"
           >
          </el-table-column>

          <el-table-column
            prop="typeId"
            label="商品类型"
            :formatter="changetypeId"
          >
          </el-table-column>

          <el-table-column
            prop="imgPath"
            label="图片">
            <!-- 按文本处理   :formatter="formatImg"    -->
            <!-- 模板处理  html  -->
            <template slot-scope="scope">
              <!-- <img src="192.168.1.43:8080/imgFiless/f86a6cd6-a0e3-47a6-ba03-62a68ff41c99.gif"/>-->
              <img width="50px" :src="scope.row.imgPath"/>
            </template>
          </el-table-column>

          <el-table-column
            prop="productdecs"
            label="商品介绍">
          </el-table-column>

          <el-table-column
            prop="price"
            label="价格">
          </el-table-column>

          <el-table-column
            prop="stocks"
            label="库存">
          </el-table-column>

          <el-table-column
            prop="sortNum"
            label="排序">
          </el-table-column>


          <el-table-column
            prop="id"
            label="操作"
          width="200">
            <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit"   @click="toupdateduck(scope.row)"></el-button>
             <el-button type="danger" icon="el-icon-delete"  @click="delDuck(scope.row.id)"></el-button>
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


      <!--修改模板-->
      <div>
        <el-dialog title="属性信息" :visible.sync="updateFormFlag">
          <el-form :model="updateForm"  ref="updateForm"   label-width="200px">

            <el-form-item label="商品名称" prop="name">
              <el-input v-model="updateForm.name" autocomplete="off" ></el-input>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input v-model="updateForm.title" autocomplete="off" ></el-input>
            </el-form-item>

            <el-form-item label="商品品牌" prop="bandId">
              <el-select v-model="updateForm.bandId" placeholder="请选择">
                <el-option
                  v-for="item in BrandData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="品牌故事" prop="productdecs">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="updateForm.productdecs"
                maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="price">
              <el-input-number v-model="updateForm.price"  :step="1" :min="0" :max="9999999999"></el-input-number>
            </el-form-item>

            <el-form-item label="商品库存" prop="stocks">
              <el-input-number v-model="updateForm.stocks"  :step="1" :min="0" :max="9999999999"></el-input-number>
            </el-form-item>

            <el-form-item label="商品排序" prop="sortNum">
              <el-input-number v-model="updateForm.sortNum"  :step="1" :min="0" :max="100"></el-input-number>
            </el-form-item>

            <el-form-item label="图片" prop="imgPath">
              <div> <img :src="updateForm.imgPath" width="80"></div>
              <el-upload
                class="upload-demo"
                action="http://localhost:8080/api/brand/upload"
                :on-success="imgCallBack"
                name="img"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <el-form-item align="right">
                <el-button @click="updateFormFlag = false">取 消</el-button>
                <el-button type="primary" @click="updateShopDuck">确 定</el-button>
              </el-form-item>
            </el-form-item>

          </el-form>
        </el-dialog>
      </div>













    </div>
</template>

<script>
    export default {
        name: "ShopDuck",
        data(){
          return{
            searchForm:{
              name:"",
            },
            ShopDuckData:[],
            count:0,
            sizes:[2,3,5,10],
            size:2,
            updateForm:{
              id:"",// 主键
              name:"",// 名称
              title:"",//  标题
              typeId:"",
              bandId:"",//  品牌id
              productdecs:"",//  商品介绍
              imgPath:"",//  图片路径
              price:0,//   价格
              stocks:0,//  库存
              sortNum:0,//  排许
            },
            TypeDatas:[],
            TypeData:[],
            typeName:"",
            updateFormFlag:false,
            BrandData:{
              id:"",
              name:""
            },
          }
        },methods:{
        handleCurrentChange:function(page){ //跳转页面
          this.queryData(page);
        },handleSizeChange:function(size){ //跳转页面
          this.queryData(1);
        },
        queryShopDuckData:function (page) {
          this.$axios.get("http://localhost:8080/api/duck/getData?limit="+this.size+"&page="+page).then(res=>{
            this.ShopDuckData=res.data.data;
            this.count=res.data.count;
          }).catch(err=>console.log(err))
        },


        /*品牌*/
        getBrandData:function () {
          this.$axios.get("http://localhost:8080/api/brand/getAllData").then(res=>{
            this.BrandData=res.data.data;
          }).catch(err=>console.log(err))
        },

        /*图片上传*/
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          // 赋值
          console.log(response)
          this.addForm.imgPath=response.data;
        },



        /* 子节点*/
        getTypeData:function () {
          this.$axios.get("http://localhost:8080/api/type/getData").then(res=>{
            //console.log(res)
            this.TypeData=res.data.data;
            this.getTypeDatas();
            for (let i = 0; i <this.TypeDatas.length ; i++) {
              this.typeName="",
                this.chandleName(this.TypeDatas[i]);
              this.TypeDatas[i].name=this.typeName.split("/").reverse().join("/").substr(0,this.typeName.length-1);
            }
          }).catch(err=>console.log(err))
        },getTypeDatas:function(){
          for (let i = 0; i <this.TypeData.length ; i++) {
            let  node=this.TypeData[i];
            this.isChildrenNode(node);
          }
        },isChildrenNode:function (node) {
          let rs=true; //标示
          for (let i = 0; i <this.TypeData.length ; i++) {
            if(node.id==this.TypeData[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.TypeDatas.push(node);
          }
        },
        chandleName:function(node){
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.TypeData.length ; i++) {
              if(node.pid==this.TypeData[i].id){
                this.chandleName(this.TypeData[i]);
                break;
              }
            }
          }else{
            this.typeName+="/"+node.name;
          }
        },

      changetypeId:function (row, column) {
        for (let i = 0; i <this.TypeData.length ; i++) {
          if (row.typeId==this.TypeData[i].id){
            return this.TypeData[i].name.substr(this.TypeData[i].name.lastIndexOf("/")+1)
          }
        }
        return "未知"
      },
        changebandId:function (row, column) {
        for (let i = 0; i <this.BrandData.length ; i++) {
          if (row.bandId==this.BrandData[i].id){
            return this.BrandData[i].name
          }
        }
        return "未知"
      },

        /*修改弹框*/
        toupdateduck:function (row) {

          this.$axios.get("http://localhost:8080/api/duck/queryDuckById?id="+row.id).then(res=>{
            this.updateForm=res.data.data;
          }).catch(err=>console.log(err))
          this.updateFormFlag=true;
        },
        updateShopDuck:function () {
          this.$axios.post("http://localhost:8080/api/duck/update",this.$qs.stringify(this.updateForm)).then(res=>{
            this.updateFormFlag = false
            this.queryShopDuckData(1)
          }).catch(err=>console.log(err))
        },
        delDuck:function (id){
          this.$axios.post("http://localhost:8080/api/duck/del?id="+id).then(res=>{
            this.queryShopDuckData(1)
          }).catch(err=>console.log(err))
        },
        searchbtu:function () {
          this.$axios.get("http://localhost:8080/api/duck/getData?limit="+this.size+"&page=1&name="+this.searchForm.name).then(res=>{
            this.ShopDuckData=res.data.data;
            this.count=res.data.count;
          }).catch(err=>console.log(err))
        },
      },created:function () {
        this.queryShopDuckData(1);
        this.getTypeData();
        this.getBrandData();
      }
    }
</script>

<style scoped>

</style>
