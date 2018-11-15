<template>
  <div>
    <el-tabs type="border-card" @tab-click="onTabClick" v-model="activeName">
      <el-tab-pane label="用户管理" name="tab1">
        <component-a></component-a>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="tab2">
        <component-b></component-b>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="tab3">
        <component-c></component-c>
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="tab4">
        <component-d></component-d>
      </el-tab-pane>
    </el-tabs>

    <h4 ref="hello">{{name}}</h4>
    <input type="text" ref="name" v-model="name">
    <button @click="getEl">获得el选项的DOM元素</button>
    <div id="mount"></div>
  </div>
</template>

<script>
  // import componentA from '@/components/componentA'
  // import componentB from '@/components/componentB'
  // import componentC from '@/components/componentC'
  // import componentD from '@/components/componentD'
  const componentA = () => import('@/components/componentA')//import懒加载比require好
  const componentB = () => import('@/components/componentB')
  const componentC = () => import('@/components/componentC')
  const componentD = () => import('@/components/componentD')

export default {
  name: 'page1',
  components: {
    componentA,
    componentB,
    componentC,
    componentD
  },
  data() {
    return {
      activeName: 'tab1',
      name: 'oldname'
    }
  },
  beforeRouteEnter(to, from, next) {
    //console.log(123)
    next(vm => {
      if (to.name === 'first' || to.name === 'second'){
        vm.activeName = 'tab2'
      }else{
        vm.activeName = to.name || 'tab1'
      }
    })


  },
  watch: {
    '$route'(to){
      //console.log(to.name)
      if (to.name != 'first' && to.name != 'second') {
        this.activeName = to.name
      }
    },

    /*name: function (n, o) {
      console.log(n)

    }*/
  },
  show () {
    console.log('show options')
  },
  user: {
    name: 'options'
  },
  methods: {
    onTabClick: function (tab) {
      this.activeName = tab.name
      this.$router.push({
        name: tab.name,
        params: {id: 123},
        query: {t: 1}
      })
    },
    getEl: function () {
      this.name = 'newName'
      /*this.$nextTick(function(){
        console.log(this.$refs.hello.textContent)
      })*/
      //console.log(this.$refs.hello.textContent)
      //this.$el.style.color = 'red'
      //console.log(this.$options.show())
      //this.$options.show()
      //console.log(this.$options.user.name)
      //console.log(this.$refs.hello)
      //console.log(this.$refs.name.value)
      //this.$refs.name.value = '我改变了'
      //console.log(this.$root)

      /*var unwatch = this.$watch('name', function (n, o) {
        console.log(n, o)

        if (n === '123'){
          unwatch()
        }
      })*/

      /*var vm = new Vue({
          data:{
              msg:'小小陈先森',
              name:'tom'
          }
      }).$mount('#mount');*/

      //vm.$mount('#mount')

    }
  }
  
}
</script>

<style>

</style>
