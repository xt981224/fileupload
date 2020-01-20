<template>
<keep-alive include="upload">
<router-view></router-view>
</keep-alive>
</template>

<script>
import upload from './components/upload'
export default {
  name: 'app',
  components: {
    upload
  }
}
</script>

<style>

</style>
