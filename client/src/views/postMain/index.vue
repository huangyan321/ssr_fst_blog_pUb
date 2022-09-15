<template>
  <div>
    <div class="side">
      <Side></Side>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
import Side from "../../components/common/Side.vue";
export default {
  components: {
    Side,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="stylus" scoped>
.side
  padding 10px
  max-width 1000px
  margin 0 auto
  padding-top 85px
@media screen and (max-width 850px)
  .side {
  padding-top: 55px
  }
</style>
