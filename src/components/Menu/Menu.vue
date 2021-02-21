<template>
  <div>
    <h1>用户权限管理</h1>







    <!--  弹框  -->
    <el-dialog
      title="新增信息"
      :visible.sync="addFromShowFlag"
    >

      <el-form ref="form"  style="width: 60%"label-width="80px" align="center">
        <el-form-item label="新增名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addForm">确定新增</el-button>
        </el-form-item>
      </el-form>


    </el-dialog>
    <!--  弹框  -->
    <el-dialog
      title="修改信息"
      :visible.sync="updateFromShowFlag"
    >

      <el-form ref="form"  style="width: 60%"label-width="80px" align="center">
        <el-form-item label="修改名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateForm">确定修改</el-button>
        </el-form-item>
      </el-form>


    </el-dialog>

    <div class="block">

      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
            <el-button type="text" icon="el-icon-circle-plus" circle  @click= "() => append(data)" >新增</el-button>
            <el-button type="text" icon="el-icon-edit" circle  @click= "() => toupdate(data)" >修改</el-button>
            <el-button type="text" icon="el-icon-remove" circle  @click= "() => remove(node,data)" >删除</el-button>

        </span>
      </span>
      </el-tree>
    </div>

  </div>
</template>

<script>
    export default {
        name: "Menu",
      data(){
        return{
          data:[],//tree 的数据
          ajaxData:[],// 远程请求的数据
          jsonStr:"", //递归拼接处理
          defaultProps:{},
          form:{
            id:"",
            name:"",
            pid:"",
            url:"",
          },
          addFromShowFlag:false,
          updateFromShowFlag:false
        }
      },methods:{
      chandleData:function(){ //ajaxData  处理成 data   //转换数据

        //找到顶层节点的数据
        for (let i = 0; i <this.ajaxData.length ; i++) {
          if(this.ajaxData[i].pid==0){
            this.diguiNode(this.ajaxData[i]);
            break;
          }
        }
        console.log(this.jsonStr);
        //将字符串 转为json对象
        this.data.push(JSON.parse(this.jsonStr));

      },  //  id  name  pid        id  name children []
      diguiNode:function (node) {
        // 判断是否为父节点
        var bf=this.isParent(node);
        if(bf==true){
          //{"id":1,"label":"分类",}
          //{"id":1,"label":"分类","children":[]}
          this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","pid":"'+node.pid+'","children":[';
          //拼接子节点
          //查找此节点的子节点
          let count=0
          for (let i = 0; i <this.ajaxData.length ; i++) {
            //判断是否为当前节点的子节点
            if(node.id==this.ajaxData[i].pid){
              count++;
              this.diguiNode(this.ajaxData[i]);
              this.jsonStr+=",";
            }
          }
          //处理多余的,号
          if(count!=0){
            this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
          }

          //拼完整
          this.jsonStr+=']}';
        }else{
          this.jsonStr+='{"id":'+node.id+',"pid":'+node.pid+',"label":"'+node.name+'"}';
        }

      }
    ,isParent:function(node){ // 判断是否为父节点  pid 有没有指向当前id

        for (let i = 0; i <this.ajaxData.length ; i++) {
          if(node.id==this.ajaxData[i].pid){
            return true;
          }
        }
        return false;
      },

      append(data) {
        this.addFromShowFlag=true;
        this.form.pid=data.id
        //alert(JSON.stringify(data))
      },
      toupdate(data){
        this.updateFromShowFlag=true;
        this.form.name=data.label
        this.form.id=data.id
        this.form.pid=data.pid
        //alert(JSON.stringify(this.form))

      },updateForm(){
        this.$axios.post("http://localhost:8080/api/menu/update",this.$qs.stringify(this.form)).then(res=>{
          this.updateFromShowFlag=false;
          location.reload()
        }).catch(err=>console.log(err))
      },

      remove(node, data) {

        if (node.childNodes.length=="") {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post("http://localhost:8080/api/menu/del?id="+data.id).then(res=>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              location.reload()
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
        }else{this.$message.error('父级节点不可删');}
      },addForm(){
        this.$axios.post("http://localhost:8080/api/menu/add",this.$qs.stringify(this.form)).then(res=>{
          this.addFromShowFlag=false;
          location.reload()
        }).catch(err=>console.log(err))

      },getData:function () {
        //远程请求数据
        this.$axios.get("http://localhost:8080/api/menu/getData").then(res=>{
          this.ajaxData=res.data.data;  // 把请求的数据  赋给全局
          this.chandleData();
        }).catch(err=>console.log(err));
      }

    }
    ,created:function(){
      this.getData()
    }
    }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
