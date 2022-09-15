<template>
  <div class="article">
    <div class="article__loading" v-if="showLoading">
      <Loading :text="loadingMsg"></Loading>
    </div>
    <div class="article__main">
      <div class="article__title">{{ currentBlog.title }}</div>
      <div class="article__time">{{ currentBlog.create_time }}</div>
      <div
        ref="blog"
        class="article__content markdown-body"
        v-html="compiledMarkdown(currentBlog.content)"
        @click="showImg($event)"
      ></div>
      <image-viewer
        v-if="imgPreview.show"
        :on-close="closeViewer"
        :url="imgPreview.src"
      />
    </div>
    <div class="article__lastTime">最后更新：{{ currentBlog.update_time }}</div>
  </div>
</template>
<script>
import Loading from "../../components/Loading";
import ImageViewer from "../../components/utils/image-viewer.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import mark from "../../utils/marked";
let prevOverflow = "";
export default {
  preFetch(store) {
    return store.dispatch("list/getOneBlog", store.state.route.params.id);
  },
  components: {
    Loading,
    ImageViewer,
  },
  data() {
    return {
      loadingMsg: "疯狂加载中！奥里给干了！！",
      showLoading: true,
      imgPreview: {
        show: false,
        src: "",
      },
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["currentBlog", "currentlyCompiledBlog"]),
  },
  beforeMount() {
    this.getArticle();
  },
  mounted() {},
  methods: {
    async getArticle() {
      this.showLoading = true;
      await this.getOneBlog(this.$route.params.id);
      this.showLoading = false;
      this.generateDir();
    },
    generateDir() {
      let category = [];
      category = Array.from(
        this.$refs.blog.querySelectorAll("h1,h2,h3,h4,h5,h6")
      ).map((item, index) => {
        item.id = item.localName + "-" + index;
        return {
          tagName: item.localName,
          text: item.innerText,
          href: "#" + item.localName + "-" + index,
        };
      });
      this.triggerDir(category);
    },
    compiledMarkdown(value) {
      return mark(value);
    },
    ...mapActions("list", {
      getOneBlog: "getOneBlog",
    }),
    ...mapMutations("side", {
      triggerDir: "TRIGGER_DIR",
    }),
    showImg(e) {
      if (e.target.tagName === "IMG") {
        //阻止正文滚动
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        this.imgPreview.show = true;
        this.imgPreview.src = e.target.src;
        console.log(this.imgPreview);
      } else if (e.target.tagName === "A") {
        e.target.target = "_blank";
      }
    },
    closeViewer() {
      document.body.style.overflow = prevOverflow;
      this.imgPreview.show = false;
    },
  },
};
</script>
<style lang="stylus" scoped>
.article
  padding 10px
  max-width 1000px
  margin 0 auto
  &__content {
  }
  &__loading
    position fixed
    top 50%
    left 50%
    width 300px
    height 200px
    margin-left -(@width / 2) + 125
    margin-top -(@height / 2) + 60
  &__main
      margin-left 260px
      min-height 100%
  &__title
      font-size 24px
      word-break break-all
  &__time
      color #7f8c8d
      font-weight 400
      margin-bottom 10px
  &__lastTime
      color: #7f8c8d
      font-weight: 200
      margin-top: 10px
      font-size: 12px
      text-align: right
@media screen and (max-width: 850px)
  .article
    position relative
    &__main
      margin-left 0
    &__loading
      position absolute
      top 200px
      left 50%
      width 300px
      margin-left -(@width/2)
</style>
