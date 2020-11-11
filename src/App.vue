<template>
  <div id="app">
    {{password}}
    <div>
      <input style="font-size: 14px;" v-model="password" type="password" v-keyBoard>
    </div>
    <div>
      <input style="font-size: 14px;" v-model="pa" type="password" v-keyBoard>
    </div>
    <!-- <key-board /> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: '123',
      pa: ''
    }
  },
  components: {
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
</style>
