<template>
  <div
    class="loading"
    v-loading="loading"
    :element-loading-text="text"
    element-loading-spinner="el-icon-loading"
  ></div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      loading: true,
    };
  },
};
</script>

<style lang="stylus" scoped>
.loading >>> .el-icon-loading:before
  content '\e6cf'
  color grey !important
  font-size 40px !important
.loading >>> .el-loading-text
  color grey !important
</style>