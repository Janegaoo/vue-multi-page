<template>
  <!-- <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
      {{value}}
    </label> -->
    <div>
    	<!-- <div>孙-子title{{}}</div> -->
      <div>这是个grandh1标题---{{gtitle}}</div>
      <div>grandmessage---{{$attrs.gmessage}}</div>    
    </div>
</template>

<script>
export default {
  name: 'grandChildComponent',
  inheritAttrs: false,
  data() {
    return {
      msg: '111'
    }
  },
  props: ['gtitle'],
  created: function() {
    console.log(this.$attrs)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
