<template>
  <div>
    <header class="top-header" ref="header">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAADlJREFUWMPt08ERACAIBDEomvqxBh18EQogn9us+HsJAAAAt0BPfQU8A2YKULKSdQAQmpIBAMBm4AAtdCIhmRB8RAAAAABJRU5ErkJggg=="
        alt=""
        class="top-header__menu-button"
        @click="toggleSidebox"
      />
      <div class="title">
        <router-link to="/" class="top-header__main-icon"
          ><img src="~@/assets/title.png" alt=""
        /></router-link>
      </div>
      <el-autocomplete
        class="input-bar"
        v-model="searchKey"
        :fetch-suggestions="querySearch"
        placeholder="搜索文章"
        :trigger-on-focus="false"
        @select="handleSelect"
        valueKey="title"
        :debounce="800"
        clearable
      ></el-autocomplete>
      <ul class="top-header__menu">
        <li
          class="top-header__menu__item"
          v-for="link in topLink"
          :key="link.id"
        >
          <router-link
            :class="{
              'top-header__menu__item--click':
                $route.path.indexOf(link.route) !== -1,
            }"
            :to="link.route"
            >{{ link.name }}</router-link
          >
        </li>
      </ul>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <!-- <img src="../../assets/login/cat.jpg" class="user-avatar" /> -->
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link
              :to="link.route"
              v-for="link in topLink"
              :key="link.id"
            >
              <el-dropdown-item
                :class="{
                  'top-header__menu__item--click':
                    $route.path.indexOf(link.route) !== -1,
                }"
              >
                {{ link.name }}
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>
<script>
import { mapMutations, mapActions } from "vuex";
import { throttle, IsPC } from "@/utils/usual";
export default {
  data() {
    return {
      topLink: [
        {
          id: 1,
          name: "文章",
          route: "/main",
        },
        {
          id: 2,
          name: "归档",
          route: "/postfile",
        },
        {
          id: 3,
          name: "读书",
          route: "/read",
        },
        {
          id: 4,
          name: "关于",
          route: "/about",
        },
        {
          id: 5,
          name: "实践",
          route: "/demo",
        },
      ],
      TOP_BAR_SHOW_HEIGHT: "60px",
      TOP_BAR_HIDDEN_HEIGHT: "0px",
      searchKey: "",
      throttleFun: () => {},
    };
  },
  computed: {},
  mounted() {
    this.throttleFun = throttle(this.handleScroll, 150);
    window.addEventListener("scroll", this.throttleFun, false);
  },
  beforeDestroy() {
    window.removeEventListener(this.throttleFun, false);
  },
  methods: {
    //将模块的空间名称字符串作为第一个参数传递
    ...mapMutations("side", {
      toggleSidebox: "TOGGLE_SIDE_BOX",
    }),
    ...mapActions("list", {
      getBlogsByLikeWords: "getBlogsByLikeWords",
    }),
    handleScroll(e) {
      if (this.searchKey) this.searchKey = "";
      let toTop = document.documentElement.scrollTop || document.body.scrollTop;
      let isTop = toTop === 0;
      if (IsPC()) {
        isTop
          ? (this.$refs.header.style.height = this.TOP_BAR_SHOW_HEIGHT)
          : (this.$refs.header.style.height = this.TOP_BAR_HIDDEN_HEIGHT);
      }
    },
    handleSelect(item) {
      if (this.searchKey) this.searchKey = "";
      this.$router.push("/main/post/" + item.blog_id);
    },
    querySearch(queryString, cb) {
      this.getBlogsByLikeWords({
        type: 2,
        words: queryString,
      }).then((res) => {
        cb(res);
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '../../assets/stylus/_settings.styl';

.top-header
  display: flex
  align-items: center
  justify-content: space-around
  position: fixed;
  top: 0;
  height: 60px;
  line-height: @height;
  overflow: hidden
  width: 100%;
  transition: height .2s ease-in-out
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  padding: 0 40px;
  background: white;
  z-index: 3;
  & >>> .el-input
    margin: 5px 15px 0 0 !important
  & >>> .el-input__inner
    border-radius: 25px !important
    height 36px !important
  .title
    flex: 1
    height: 100%;
  &__main-icon
    text-decoration: none;
    color $grey-dark;
    font-weight: 600;
    font-size: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    img
      height: 40%;
      object-fit: contain;
  &__menu-button
    width: 32px;
    height: 32px;
    display: none;

  &__menu
    float right
    list-style none
    margin-right: 30px
    &__item
      display: inline-block
      line-height: 0
      &--click
        color: #000000 !important
        opacity: 1  !important
      a
        text-decoration none
        opacity: 0.7
        color: #0d122b
        padding: 20px
        &:hover
          color: #000000
          opacity: 1
          text-decoration: none
.right-menu
  float: right
  height: 100%
  line-height: 50px
  display: none
  &:focus
    outline: none
  .right-menu-item
    display: inline-block
    padding: 0 8px
    height: 100%
    font-size: 18px
    color: #5a5e66
    vertical-align: text-bottom
    text-decoration: none
    &__hover-effect
      cursor: pointer
      transition: background .3s
      &:hover
        background: rgba(0, 0, 0, .025)
  .avatar-container
    margin-right: 30px
    .avatar-wrapper
      margin-top: 5px
      position: relative
      .user-avatar
        cursor: pointer
        width: 40px
        height: 40px
        border-radius: 10px
      .el-icon-caret-bottom
        cursor: pointer
        position: absolute
        right: -20px
        top: -7px
        font-size: 12px
        &::before
          font-size 20px
a
  text-decoration: none !important

// 屏幕宽度小于850px时 字体居中
@media screen and (max-width: 850px)
  .input-bar
    display: none
  .top-header
    text-align: center;
    padding: 0;
    &__menu
      display: none
    &__menu-button
      display: block;
    &__main-icon
      justify-content: center
  .right-menu
    display: block
</style>
