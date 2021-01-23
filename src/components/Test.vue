<template>
    <div>
      <h1>hello world</h1>
        <button @click="test">AAAAAAA</button>
    </div>
</template>

<script>
    export default {
        name: "Test",
        data(){
          return{
            aa:[],
            bb:[],
          }
        },methods: {
          test: async  function(){
            await this.test1();
            this.test2();
          },
         test1: async function() {
         let res= await this.$axios.get("http://localhost:8080/api/shopData/getData?limit=20&page=1")
          this.aa=res.data.data;
          //console.log("test1");
        },
        test2(){
          console.log(this.aa)
        }
      }
    }
</script>

<style scoped>

</style>
