<template>
  <div class="sideBox">
    <div
      class="sideBox__mask"
      :class="{ 'sideBox__mask--show': sideBoxOpen }"
      @click="closeSideBox"
    ></div>
    <div class="sideBox__main" :class="{ 'sideBox__main--open': sideBoxOpen }">
      <div class="sideBox__img">
        <img src="~@/assets/avatar.png" alt="" @click="picClick" />
      </div>
      <p class="sideBox__name"></p>
      <p class="sideBox__autograph">just want something simpler...</p>
      <ul class="sideBox__iconList">
        <li
          v-for="(icon, idx) in iconList"
          :key="idx"
          class="sideBox__iconItem"
        >
          <a :href="icon.href"
            ><i class="iconfont" :class="'icon-' + icon.name"></i
          ></a>
        </li>
      </ul>
      <ul class="sideBox__tagList" v-if="isInList">
        <li
          v-for="(tag, idx) in tags"
          :key="idx"
          class="sideBox__tagItem"
          :class="{
            'sideBox__tagItem--active': selectTags.find(
              (e) => tag[1].tag_id === e.tag_id
            ),
          }"
          @click="triggerSelectTags(tag)"
        >
          <span>{{ tag[0] }}</span> <i>({{ tag[1].count }})</i>
        </li>
      </ul>
      <div
        v-else-if="!isInList"
        class="dirBox"
        :class="{ 'dirBox--fix': scrollTop > 177 }"
      >
        <p class="dir__title">目录</p>
        <ul class="dirBox__body">
          <li
            v-for="(item, idx) in articleDir"
            :key="idx"
            :class="'dirBox__' + item.tagName"
          >
            <el-tooltip  effect="dark" :content="item.text" placement="left" transition="none">
              <a
              :href="item.href"
              :class="[
                { activeAnc: $route && $route.hash == item.href },
                'anchor',
              ]"
              >{{ item.text }}</a
            >
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { throttle, IsPC } from "@/utils/usual";
export default {
  data() {
    return {
      iconList: [
        {
          name: "github",
          href: "https://github.com/huangyan321",
        },
      ],
      scrollTop: 0,
    };
  },
  watch: {
    sideBoxOpen: {
      handler(v) {
        console.log(v);
      },
    },
    $route: {
      handler(v) {
        v.params.id ? this.triggerIsInList(false) : this.triggerIsInList(true);
      },
    },
  },
  computed: {
    ...mapGetters([
      "sideBoxOpen",
      "tags",
      "selectTags",
      "isInList",
      "articleDir",
    ]),
  },
  created() {
    if (typeof window === "undefined") {
      return;
    }
    this.$route.params.id
      ? this.triggerIsInList(false)
      : this.triggerIsInList(true);
    this.getAllTags();
    if (!this.isInList) {
      window.onscroll = throttle(this.getScrollTop, 50);
    }
  },
  mounted() {},
  beforeDestroy() {
    console.log("side beforeDestroy");
    this.triggerIsInList(true);
    window.onscroll = null;
  },
  methods: {
    ...mapActions("side", {
      getAllTags: "getAllTags",
    }),
    ...mapMutations("side", {
      closeSideBox: "CLOSE_SIDE_BOX",
      triggerSelectTags: "TRIGGER_SELECT_TAGS",
      triggerIsInList: "TRIGGER_IS_IN_LIST",
    }),
    picClick() {
      this.closeSideBox();
      this.$router.push("/");
    },
    getScrollTop() {
      let bodyScrollTop = 0,
        bodyDocumentScrollTop = 0;
      if (document.body) {
        if (document.body.clientWidth < 850) {
          return;
        }
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        bodyDocumentScrollTop = document.documentElement.scrollTop;
      }
      this.scrollTop = bodyScrollTop + bodyDocumentScrollTop;
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '../../assets/stylus/_settings.styl'
.sideBox
  width 250px
  float left
  text-align center
  user-select none
  &__img
    width 80px
    height 80px
    border-radius 100%
    overflow hidden
    margin 20px auto
    text-align center
    box-shadow 0 0 2px black
    img
      object-fit contain
      transition 0.6s
      cursor pointer
      max-width 100%
      vertical-align middle
      text-align center
      margin 0 auto
  &__name
    color $grey-dark
    font-size 20px
    margin 5px 0
  &__autograph
    color $grey
    margin 8px 0
  &__iconList
    list-style none
    margin-bottom 8px
  &__iconItem
    display inline-block
    margin-bottom 8px
    a
      text-decoration none
      color $grey
      .iconfont
        font-size 28px
        &:hover
          color black
  &__tagList
    max-height 300px
    overflow-y auto
    list-style none
    margin-bottom 8px
  &__tagItem
    display inline-block
    box-sizing: border-box
    border-radius 3px
    margin 3px
    padding 5px
    color $grey
    cursor pointer
    &:hover
      color black
  &__tagItem--active
    color black
  .dirBox
    padding-left 10px
    padding-right 15px
    will-change transform
    &--fix
      position fixed
      top 100px
      overflow-y auto
      width 250px
    &__title
      margin-top 15px
      margin-bottom 10px
      font-weight 400
      color #808080
      font-size 18px
    &__body
      margin-top: 20px
      max-height: 400px
      overflow-y auto
    ul
      list-style none
    li
      text-align left
      // list-style-type: square;
      margin-bottom 5px
      padding-left 20px
      word-wrap break-word
      word-break all
      a
        color $grey
        text-decoration none
        margin-left -18px
        word-wrap break-word
        word-break break-all
        &:hover
          color #000000
          text-decoration none
      .activeAnc
          color #000000
          text-decoration none
      .anchor
          display: inline-block;
          padding: 3px;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
    &__h1
      margin-left 0
    &__h2
      margin-left 20px
    &__h3
      margin-left 40px
    &__h4
      margin-left 60px
    &__h5
      margin-left 80px
    &__h6
      margin-left 100px
  @media screen and (max-width 850px)
    .sideBox
      position absolute
      top 0
      left 0
      &__main
        position fixed
        left 0px
        top 60px
        z-index 1
        bottom 0
        width 250px
        transform translateX(-250px)
        transition transform 0.3s
        background-color white
        &--open
          box-shadow 0 0 10px rgba(0, 0, 0, 0.2)
          transform translateX(0px)
          transition transform 0.3s
      &__mask
        position fixed
        top 60px
        left 250px
        right 0
        bottom 0
        display block
        z-index 1
        display none
      &__mask--show
        display block
      &__tagItem:hover
        color $grey
      &__tagItem--active:hover
        color #000000
        text-decoration none
</style>
<style>
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 3px;
  height: 6px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #bfbfbf;
  border-radius: 10px;
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #bfbfbf;
  background-color: #aaa;
}
</style>
