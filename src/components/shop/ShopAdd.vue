<template>
    <div>
      <!-- 步骤条-->
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <div  style="width: 650px; margin-left: 100px" >
      <el-form :model="addForm"  ref="addForm"   label-width="200px" v-if="active==0">




        <el-form-item label="商品名称" prop="name">
          <el-input v-model="addForm.name" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="商品品牌" prop="bandId">
          <el-select v-model="addForm.bandId" placeholder="请选择">
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
            v-model="addForm.productdecs"
            maxlength="50"
            show-word-limit
          >
          </el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="addForm.price"  :step="1" :min="0" :max="9999999999"></el-input-number>
        </el-form-item>

        <el-form-item label="商品库存" prop="stocks">
          <el-input-number v-model="addForm.stocks"  :step="1" :min="0" :max="9999999999"></el-input-number>
        </el-form-item>

        <el-form-item label="商品排序" prop="sortNum">
          <el-input-number v-model="addForm.sortNum"  :step="1" :min="0" :max="100"></el-input-number>
        </el-form-item>

        <el-form-item label="图片" prop="imgPath">
          <div> <img :src="addForm.imgPath" width="80"></div>
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

      </el-form>
      </div>



        <!--步骤2-->
        <div v-if="active==1">
        <el-form :model="addForm"  ref="addForm"   label-width="200px" >

          <!-- 类型-->
        <el-form-item label="商品类型" prop="typeId">
              <el-select v-model="addForm.typeId" placeholder="请选择" @change="getShopDataByTypeId(addForm.typeId)">
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
            style="width: 1000px; margin-left:150px ">


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


          </div>

        </el-form>

          <el-button  @click="ShopAdd">提交</el-button>
      </div>
      <div align="center">
      <el-button style="margin-top: 12px;" @click="before">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "ShopAdd",
      data() {
        return {
          active: 0,
          addForm:{
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
          ShopData1:[],
          SkuData:[],
          noSkuData:[],
          tableData:[],
          cols:[],
          tableShow:false,
          aa:[],
          bb:[],
          cc:[],
          dika:[],
          BrandData:{
            id:"",
            name:""
          },
          TypeDatas:[],
          TypeData:[],
          typeName:"",
        };
      },

      methods: {
        next() {
          if (this.active++ > 2) this.active = 0;
        },
        before() {
          if (this.active-- < 2) this.active = 0;
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

        /*品牌*/
        getBrandData:function () {
          this.$axios.get("http://localhost:8080/api/brand/getAllData").then(res=>{
            this.BrandData=res.data.data;
          }).catch(err=>console.log(err))
        },

        /*通过分类查到属性*/
        getShopDataByTypeId:function (typeId) {
          this.tableShow=false;
          this.SkuData=[];
          this.noSkuData=[];
          this.$axios.get("http://localhost:8080/api/shopData/getDataByTypeId?typeId="+typeId).then(res=>{
            var ShopData=res.data.data;
            for (let i = 0; i <ShopData.length ; i++) {
              if (ShopData[i].isSKU==0 ){
                if(ShopData[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$axios.get("http://localhost:8080/api/value/getDataByAttId?attId="+ShopData[i].id).then(res=>{
                    ShopData[i].values=res.data.data
                    //console.log(ShopData[i].values)
                    ShopData[i].ckValues=[]
                    this.SkuData.push(ShopData[i])
                  }).catch(err=>console.log(err))}else {
                  ShopData[i].ckValues=[]
                  this.SkuData.push(ShopData[i])
                }
                }else {
                if(ShopData[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$axios.get("http://localhost:8080/api/value/getDataByAttId?attId="+ShopData[i].id).then(res=>{
                    ShopData[i].values=res.data.data
                    ShopData[i].ckValues1="";
                    this.noSkuData.push(ShopData[i])
                  }).catch(err=>console.log(err))
                }else{
                  ShopData[i].ckValues1="";
                  this.noSkuData.push(ShopData[i])
                }

              }
            }
          }).catch(err=>console.log(err))
          this.$axios.get("http://localhost:8080/api/shopData/getDataByTypeId?typeId="+typeId).then(res=>{
            this.ShopData1=res.data.data
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
        ShopAdd:function () {

          //this.shopAddForm.typeId=this.addForm.typeId
          //商品的新增
          let sku=[];
          let nosku=[];



          //非SKU
          for (let i = 0; i <this.noSkuData.length; i++) {
            let arr=this.noSkuData[i].id
            console.log(arr)
            let arr1=this.noSkuData[i].ckValues1;
            let ass='{'+'"'+arr+'"'+':'+'"'+arr1+'"'+'}'
            let saveAddvalues={proId:this.addForm.typeId,attrData:ass}
            sku.push(saveAddvalues);
          }
          //SKU
          for (let i = 0; i <this.tableData.length; i++) {
            let saveAddvalues = {
              proId: this.addForm.typeId,
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
            this.addForm.sku=JSON.stringify(sku)
          var add1=this.$qs.stringify(this.addForm)
          console.log(this.addForm)
         this.$axios.post("http://192.168.1.32:8080/api/duck/add",add1).then(res=>{
           this.$message.success("添加成功");
          }).catch(err=>console.log(err));






          //console.log(this.tableData)
          // console.log(this.SkuData)
          // console.log(this.noSkuData)
          //console.log(this.addForm)
          //console.log(this.ShopData1)


          /*表格中的值*/
         /* var attrDataStr =''
          var bb=[]
          for (let i = 0; i <this.SkuData.length ; i++) {
            for (let j = 0; j <this.SkuData[i].ckValues.length ; j++) {

              attrDataStr ="{"+ this.SkuData[i].id+":"+this.SkuData[i].ckValues[j]+"}"
              bb.push(attrDataStr)
              console.log(bb)
            }

          }*/

        /*var aa=[]
          for (let i = 0; i <this.tableData.length ; i++) {

              aa.push({"proId":this.addForm.typeId,"price":this.tableData[i].price,"kucun":this.tableData[i].kucun,"attrData":""})
          }*/
          //console.log(aa)

          /*this.$axios.post("http://localhost:8080/api/duck/add?",this.$qs.stringify(this.addForm)).then(res=>{

          }).catch(err=>console.log(err))*/
        }

      },created:function () {
        this.getTypeData()
        this.getBrandData()
      }

    }
</script>

<style scoped>

</style>
