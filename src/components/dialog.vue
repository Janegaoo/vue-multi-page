<template>
  <el-dialog :visible.sync="$store.state.show"></el-dialog>
</template>

<script>
  import {mapState} from 'vuex';
export default {
  //props:['show'],
  computed:{
    //这里的三点叫做 : 扩展运算符
    ...mapState({
      show:state=>state.dialog.show
    })
  }
}
</script>