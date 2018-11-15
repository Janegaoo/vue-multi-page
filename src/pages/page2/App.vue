<template>
  <div id="app">
      <!-- <el-row>
        <el-button @click="enter">enter</el-button>
      </el-row> -->
      <a href="/page1/index.html">跳转</a>
      <a href="javascript:;" @click="$store.dispatch('switch_dialog')">点击</a>
      <t-dialog></t-dialog>
      <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import dialog from '@/components/dialog.vue'

export default {
  name: 'App',
  components: {
    't-dialog': dialog
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    // ...mapGetters([
    //     'name',
    //     'age'
    // ])
  },
  methods: {
    // ...mapMutations({
    //     setName: 'SET_NAME',
    //     setAge: 'SET_AGE'
    // }),
    // ...mapActions([
    //     nameAsyn
    // ]), 
    enter : function () {
      this.$router.push({
        name: 'page',
        /*params: {id: 123456},
        query: {t: 1}*/
      })
    }
  },
  watch: {
    
  },
  created: function () {
    
  },
  mounted: function () {
    //console.log(this.$store)
  }
  
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
