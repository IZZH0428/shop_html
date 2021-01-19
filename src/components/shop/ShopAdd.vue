<template>
    <div>
      <!-- 步骤条-->
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <div  style="width: 650px; margin-left: 100px" >
      <el-form :model="addForm"  ref="addForm"   label-width="200px" v-if="active==0?true:false">




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

      </el-form>



        <!--步骤2-->
        <div v-if="active==1?true:false">
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

               <el-select v-show="a.type==0"  placeholder="请选择"  v-model="cc">
                 <el-option v-for="b in a.values" :key="b.id"  :label="b.valueCH" :value="b.id"></el-option>
               </el-select>

               <el-radio-group v-show="a.type==1" v-model="aa">
                 <el-radio-button v-for="b in a.values" :key="b.id" :label="b.valueCH"></el-radio-button>
               </el-radio-group>


               <el-checkbox-group v-show="a.type==2" v-model="bb">
                 <el-checkbox-button v-for="b in a.values" :key="b.id" :label="b.valueCH"  ></el-checkbox-button>
               </el-checkbox-group>


               <el-input v-show="a.type==3"></el-input>

             </el-form-item>

           </el-form-item>


         </div>


          <h1>------------------------------------------------------</h1>
          <!--不是SKU属性-->
          <div>

            <el-form-item v-if="noSkuData.length>0" label="商品参数  :" prop="name">

              <br>
              <el-form-item v-for="a in  noSkuData" :key="a.id" :label="a.nameCH" style="margin-left: -150px">

                <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->

                <el-select v-show="a.type==0"  placeholder="请选择"  v-model="cc">
                  <el-option v-for="b in a.values" :key="b.id"  :label="b.valueCH" :value="b.id"></el-option>
                </el-select>

                <el-radio-group v-show="a.type==1" v-model="aa">
                  <el-radio-button v-for="b in a.values" :key="b.id" :label="b.valueCH"></el-radio-button>
                </el-radio-group>


                <el-checkbox-group v-show="a.type==2" v-model="bb">
                  <el-checkbox-button v-for="b in a.values" :key="b.id" :label="b.valueCH"  ></el-checkbox-button>
                </el-checkbox-group>


                <el-input v-show="a.type==3"></el-input>

              </el-form-item>

            </el-form-item>


          </div>

        </el-form>


        </div>
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
            bandId:"",//  品牌id
            productdecs:"",//  商品介绍
            price:0,//   价格
            stocks:0,//  库存
            sortNum:0,//  排许
          },
          ShopData:[],
          SkuData:[],
          noSkuData:[],
          aa:[],
          bb:[],
          cc:[],
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
          this.SkuData=[];
          this.noSkuData=[];
          this.$axios.get("http://localhost:8080/api/shopData/getDataByTypeId?typeId="+typeId).then(res=>{
            this.ShopData=res.data.data;
            for (let i = 0; i <this.ShopData.length ; i++) {
              if (this.ShopData[i].isSKU==0 ){
                if(this.ShopData[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$axios.get("http://localhost:8080/api/value/getDataByAttId?attId="+this.ShopData[i].id).then(res=>{
                    this.ShopData[i].values=res.data.data
                    this.SkuData.push(this.ShopData[i])
                  }).catch(err=>console.log(err))}else {
                  this.SkuData.push(this.ShopData[i])
                }
                }else {
                if(this.ShopData[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$axios.get("http://localhost:8080/api/value/getDataByAttId?attId="+this.ShopData[i].id).then(res=>{
                    this.ShopData[i].values=res.data.data
                    this.noSkuData.push(this.ShopData[i])
                  }).catch(err=>console.log(err))}else{
                  this.noSkuData.push(this.ShopData[i])
                }

              }
            }
          }).catch(err=>console.log(err))

        },


        /*属性值*/
        /*getDataValue:function(attId){
          this.DataValue=[];
          this.$axios.get("http://localhost:8080/api/value/getDataByAttId?attId="+attId).then(res=>{
            this.SkuData[i].values=res.data.data
            console.log(this.DataValue)
          }).catch(err=>console.log(err))
        },*/



      },created:function () {
        this.getTypeData()
        this.getBrandData()
      }

    }
</script>

<style scoped>

</style>
