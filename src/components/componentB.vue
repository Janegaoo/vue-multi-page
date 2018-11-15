<template>
  <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    beforeRouteEnter(to, from, next){
      //console.log(to.name)
      next(vm => {
        vm.acitveName = to.name || 'first'
      })

    },
    watch: {
      '$route'(to){
        console.log(to.name)
        if (to.name === 'tab2'){
          this.activeName = 'first'
        }else{
          this.activeName = to.name
        }
        
      }
    },
    methods: {
      handleClick: function (tab, event) {
        this.activeName = tab.name
        this.$router.push({
          name: tab.name,
          param: {id: 456},
          query: {t: 2}
        })
      }
    },
    mounted: function () {
      console.log(this.$route.name)
      if (this.$route.name != 'tab2'){
        this.activeName = this.$route.name
      }
      //this.activeName = this.$route.name

    }
  }
</script>