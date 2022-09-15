<template>
  <div class="about"><div class="notice">读书</div></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="stylus" scoped>
.about
  padding 10px
  max-width 1000px
  margin 0 auto
  padding-top 85px
.notice
  text-decoration: none;
  color: gray;
  font-weight: 600;
  font-size: 30px;

@media screen and (max-width 850px)
  .about {
  padding-top: 55px
  }
</style>
