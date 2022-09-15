<template>
  <div id="app">
    <div class="wrap">
      <Top></Top>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
    <footer class="footer" v-if="isInList">
      <a href="http://beian.miit.gov.cn/"
        ><center>闽ICP备2021008516号-1</center></a
      >
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35012102000346"
        style="display: inline-block; height: 20px; line-height: 20px"
        ><img src="./assets/beian.png" style="float: left" />
        <p class="beian">闽公网安备 35012102000346号</p></a
      >
    </footer>
    <footer class="footer" v-else></footer>
  </div>
</template>
<script>
import Top from "./components/common/Top";
import Side from "./components/common/Side";
import { mapGetters } from "vuex";
export default {
  name: "app",
  components: {
    Top,
    Side,
  },
  computed: {
    ...mapGetters(["isInList"]),
  },
};
</script>
<style>
@import "assets/iconfont/iconfont.css";
</style>
<style lang="stylus">
@import 'assets/stylus/main.styl'
@import 'assets/stylus/markdown.styl'
$footer-height = 60px
#app
  width 100%
  height 100%
.fade-enter-active, .fade-leave-active
  transition all 0.2s ease
.fade-enter, .fade-leave-active
  opacity 0
.side
  padding 10px
  max-width 1000px
  margin 0 auto
  padding-top 85px
.wrap
  min-height 100%
  margin-bottom -($footer-height)
.wrap:after
  content ''
  display block
  height $footer-height
.footer
  height $footer-height
  font-size 13px
  text-align center
  color $grey
  text-align center
  line-height 20px
  a
    text-decoration none
    color $blue-link
    &:hover
      text-decoration underline
@media screen and (max-width 850px)
  .fade-enter
    transform translate(30px, 0px)
  .fade-leave-active
    transform translate(-30px, 0px)
  .side {
    padding-top: 55px
    }
</style>
<style lang="stylus" scoped>
#app
  #disqus_thread
    display none
</style>

<style lang="scss">
@import "assets/scss/github.scss";

.beian {
  float: left;
  height: 20px;
  text-decoration: underline;
  line-height: 20px;
  margin: 0px 0px 0px 5px;
}
</style>
