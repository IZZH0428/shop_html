<template>
    <div>
      <h1 align="center">商品管理</h1>
      <div id="searchDiv" align="center">

        <el-form :inline="true" :model="searchForm" class="demo-form-inline">

          <el-form-item label="名称">
            <el-input v-model="searchForm.name" placeholder="名称"></el-input>
          </el-form-item>
         <el-button type="primary" @click="searchbtu">查  询</el-button>
          <router-link to="/ShopAdd">
            <el-button type="success" >新增</el-button>
          </router-link>

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
             <el-button type="primary" icon="el-icon-edit"   @click="toupdateData(scope.row)"></el-button>
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
        <el-dialog title="修改商品信息" :visible.sync="updateFormFlag">
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





      <!--商品属性 -->
      <el-dialog title="商品属性信息" :visible.sync="updateDataFlag">
      <el-form :model="updateForm"  ref="updateForm"   label-width="200px" >

        <!-- 类型-->
        <el-form-item label="商品类型" prop="typeId">
          <el-select v-model="updateForm.typeId" placeholder="请选择" >
            <el-option
              v-for="item in TypeDatas"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!--是SKU属性-->
        <div>

          <el-form-item v-if="SkuData.length>0" label="商品参数  :" prop="name">

            <br>
            <el-form-item v-for="a in  SkuData" :key="a.id" :label="a.nameCH" style="margin-left: -150px">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->

              <el-checkbox-group v-show="a.type==2" v-model="a.ckValues">
                <el-checkbox-button v-for="b in a.values" :key="b.id" :label="b.valueCH" @change="skuChange" ></el-checkbox-button>
              </el-checkbox-group>

            </el-form-item>

          </el-form-item>


        </div>
        <el-table
          v-if="tableShow"
          :data="tableData"
          style="width: 1000px; ">


          <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name" >
          </el-table-column>

          <el-table-column
            label="库存"
            width="180">

            <template slot-scope="scope">
              <el-input-number v-model="scope.row.kucun"  :step="1" :min="0" :max="100"></el-input-number>
            </template>

          </el-table-column>
          <el-table-column
            label="价格"
            width="180" >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.price"  :step="1" :min="0" :max="100"></el-input-number>

            </template>
          </el-table-column>
        </el-table>

        <!--不是SKU属性-->
        <div>

          <el-form-item v-if="noSkuData.length>0" label="商品参数  :" prop="prop
            name">

            <br>
            <el-form-item v-for="a in  noSkuData" :key="a.id" :label="a.nameCH" style="margin-left: -150px">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->

              <el-select v-show="a.type==0"  placeholder="请选择"  v-model="a.ckValues1">
                <el-option v-for="b in a.values" :key="b.id"  :label="b.valueCH" :value="b.id"></el-option>
              </el-select>

              <el-radio-group v-show="a.type==1" v-model="a.ckValues1">
                <el-radio-button v-for="b in a.values" :key="b.id" :label="b.id" :value="b.id">{{b.valueCH}}</el-radio-button>
              </el-radio-group>




              <el-checkbox-group v-show="a.type==2" v-model="a.ckValues1">
                <el-checkbox-button v-for="b in a.values" :key="b.id" :label="b.valueCH" :value="b.id" ></el-checkbox-button>
              </el-checkbox-group>

              <el-input v-show="a.type==3" v-model="a.ckValues1"></el-input>



            </el-form-item>

          </el-form-item>
          <el-form-item align="right">
            <el-button @click="updateDataFlag = false">取 消</el-button>
            <el-button type="primary" @click="updateShopData">确 定</el-button>
          </el-form-item>

        </div>

      </el-form>
      </el-dialog>





    </div>
</template>

<script>
  import $ from "jquery"
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
            SkuData:[],
            noSkuData:[],
            tableData:[],
            cols:[],
            tableShow:true,
            dika:[],
            updateFormFlag:false,
            BrandData:{
              id:"",
              name:""
            },
            updateDataFlag:false,
          }
        },methods:{
        handleCurrentChange:function(page){ //跳转页面
          this.queryShopDuckData(page);
        },
        handleSizeChange:function(size){ //跳转页面
          this.queryShopDuckData(1);
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
          this.updateForm.imgPath=response.data;
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
        },
        getTypeDatas:function(){
          for (let i = 0; i <this.TypeData.length ; i++) {
            let  node=this.TypeData[i];
            this.isChildrenNode(node);
          }
        },
        isChildrenNode:function (node) {
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
        toupdateData: function (row) {
          this.updateForm.typeId =row.typeId

          this.updateForm.id=row.id
          this.updateDataFlag=true;
          this.getShopDataByTypeId(row.id,row.typeId)
        },
        /*通过分类查到属性*/
        getShopDataByTypeId:function (id,typeId) {
          this.SkuData=[];
          this.noSkuData=[];
          let skuAll=[];
          let skuattr=[];
          let noskuattr=[];
                  //发起请求 查询此属性对应的选项值
                  $.get({
                    url:"http://localhost:8080/api/duck/queryshopatt",
                    data:{id:id}
                    ,async:false,
                    success:function (res) {
                     //console.log(res)
                      for (let i = 0; i <res.data.length ; i++) {
                        if (res.data[i].price!=null){
                          skuAll.push(res.data[i]);
                          skuattr.push(JSON.parse(res.data[i].attrData))
                          console.log(skuAll)
                        }else {
                          noskuattr.push(JSON.parse(res.data[i].attrData))
                          //console.log(noskuattr)
                        }
                      }
                    }
                })
          this.$axios.get("http://localhost:8080/api/shopData/getDataByTypeId?typeId="+typeId).then(res=>{
                  //console.log(res.data.data)
            let shopDatas=res.data.data
            for (let i = 0; i <shopDatas.length ; i++) {
              //sku属性
                if (shopDatas[i].isSKU==0){
                  shopDatas[i].ckValues=[];
                  for (let j = 0; j <skuattr.length ; j++) {
                    if (shopDatas[i].ckValues.indexOf(skuattr[j][shopDatas[i].name])==-1){
                      shopDatas[i].ckValues.push(skuattr[j][shopDatas[i].name])
                    }
                  }
                  $.get({
                    url:"http://localhost:8080/api/value/getDataByAttId",
                    data:{attId:shopDatas[i].id}
                    ,async:false,
                    success:function (res) {
                      //console.log(res)
                      shopDatas[i].values=res.data
                    }
                  })
                  this.SkuData.push(shopDatas[i])
                }else if(shopDatas[i].isSKU==1){
                  $.get({
                    url:"http://localhost:8080/api/value/getDataByAttId",
                    data:{attId:shopDatas[i].id}
                    ,async:false,
                    success:function (res) {
                      //console.log(res)
                      shopDatas[i].values=res.data
                      shopDatas[i].ckValues1=""                    }
                  })
                  console.log(noskuattr)
                  this.noSkuData.push(shopDatas[i])
                  let hh=""
                  for (let j = 0; j <noskuattr.length ; j++) {
                    if(noskuattr[j][shopDatas[i].name]!=undefined){
                      hh=noskuattr[j][shopDatas[i].name]
                       this.noSkuData[j].ckValues1 =hh
                    }

                  }
                }
            }
            this.skuChange1(skuAll)
            //console.log(this.noSkuData)
            }).catch(err=>console.log(err))

        },


        skuChange:function () {
          //console.log(this.SkuData);
          //判断是否要生成笛卡尔积
          var a=[]
          this.cols=[];
          this.tableData=[];
          let flag=true;
          for (let i = 0; i <this.SkuData.length ; i++) {
            if(this.SkuData[i].ckValues.length==0 ){
              flag=false;
              break;
            }
          }
          if(flag==true) {
            //console.log(this.SkuData)
            for (let i = 0; i < this.SkuData.length; i++) {
              this.cols.push({"id":this.SkuData[i].id,"nameCH":this.SkuData[i].nameCH,"name":this.SkuData[i].name});
              a.push(this.SkuData[i].ckValues)
            }
            this.dika = this.discarts(a)

            for (let i = 0; i <  this.dika.length; i++) {
              let tableValue = {};
              for (let j = 0; j <  this.dika[i].length; j++) {
                let key = this.cols[j].name;
                tableValue[key] = this.dika[i][j];
              }

              this.tableData.push(tableValue);
            }
          }
          this.tableShow=flag;
        },
        skuChange1:function (sku) {
          //console.log(this.SkuData);
          //判断是否要生成笛卡尔积
          var a=[]
          this.cols=[];
          this.tableData=[];
          let flag=true;
          for (let i = 0; i <this.SkuData.length ; i++) {
            if(this.SkuData[i].ckValues.length==0 ){
              flag=false;
              break;
            }
          }
          if(flag==true) {
            //console.log(this.SkuData)
            for (let i = 0; i < this.SkuData.length; i++) {
              this.cols.push({"id":this.SkuData[i].id,"nameCH":this.SkuData[i].nameCH,"name":this.SkuData[i].name});
              a.push(this.SkuData[i].ckValues)
            }
            this.dika = this.discarts(a)

            for (let i = 0; i <  this.dika.length; i++) {
              let tableValue = {};
              for (let j = 0; j <  this.dika[i].length; j++) {
                let key = this.cols[j].name;
                tableValue[key] = this.dika[i][j];
              }
              tableValue.price=sku[i].price
              tableValue.kucun=sku[i].storcks
              this.tableData.push(tableValue);
            }
          }
          this.tableShow=flag;
        },



        //笛卡尔积
        discarts:function() {
          var twodDscartes = function (a, b) {
            var ret = [];
            for (var i = 0; i < a.length; i++) {
              for (var j = 0; j < b.length; j++) {
                ret.push(ft(a[i], b[j]));
              }
            }
            return ret;
          }
          var ft = function (a, b) {
            if (!(a instanceof Array))
              a = [a];
            var ret = a.slice(0);
            ret.push(b);
            return ret;
          }
          //多个一起做笛卡尔积
          return (function (data) {
            var len = data.length;
            if (len == 0)
              return [];
            else if (len == 1)
              return data[0];
            else {
              var r = data[0];
              for (var i = 1; i < len; i++) {
                r = twodDscartes(r, data[i]);
              }
              return r;
            }
          })(arguments.length > 1 ? arguments : arguments[0]);
        },



        updateShopData:function () {
          let sku=[];
          let nosku=[];

          //非SKU
          for (let i = 0; i <this.noSkuData.length; i++) {
            let arr=this.noSkuData[i].name
            console.log(arr)
            let arr1=this.noSkuData[i].ckValues1;
            let ass='{'+'"'+arr+'"'+':'+'"'+arr1+'"'+'}'
            let saveAddvalues={proId:this.updateForm.id,attrData:ass}
            sku.push(saveAddvalues);
          }
          //SKU
          for (let i = 0; i <this.tableData.length; i++) {
            let saveAddvalues = {
              proId: this.updateForm.id,
              price: this.tableData[i].price,
              storcks: this.tableData[i].kucun
            }
            delete this.tableData[i].price
            delete this.tableData[i].kucun
            saveAddvalues.attrData = JSON.stringify(this.tableData[i]);
            sku.push(saveAddvalues)
            //console.log(JSON.stringify(this.tableData[i]))
          }
          console.log(JSON.stringify(sku))
          this.updateForm.sku=JSON.stringify(sku)
          var add1=this.$qs.stringify(this.updateForm)
          console.log(this.updateForm)
          this.$axios.post("http://localhost:8080/api/duck/updateData",add1).then(res=>{
            this.$message.success("修改成功");
            this.updateDataFlag=false;
          }).catch(err=>console.log(err));
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
