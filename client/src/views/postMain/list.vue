<template>
  <div class="list">
    <div class="list__loading" v-if="showLoading">
      <Loading :text="loadingMsg"></Loading>
    </div>
    <ul class="list__article">
      <transition name="slide-fade">
        <li class="list__article__filter" v-if="selectTags.length !== 0">
          筛选
          <span>{{ filterMsg }}</span>
          分类
        </li>
      </transition>
      <template v-if="blogs.length !== 0 && showLoading == false">
        <li
          class="list__article__item"
          v-for="blog in blogs"
          :key="blog.blog_id"
        >
          <section>
            <h3 class="list__article__item__title">
              <router-link :to="'/main/post/' + blog.blog_id"
                ><span>{{ blog.title }}</span>
                <span
                  class="list__article__item__sticky-icon"
                  v-if="blog.is_top == '1'"
                  >{{ postStatus.up }}</span
                >
              </router-link>
            </h3>
            <div class="list__article__item__info">
              <p class="list__article__item__time">{{ blog.create_time }}</p>
              <div
                class="list__article__item__abstract markdown-body"
                v-html="compiledMarkdown(blog.brief)"
                @click="showImg($event)"
              ></div>
              <p>
                <router-link
                  :to="'/main/post/' + blog.blog_id"
                  class="continue-reading"
                  >继续阅读...</router-link
                >
              </p>
            </div>
          </section>
        </li>
      </template>
      <h3 class="msg-box" v-if="blogs.length === 0 && showLoading == false">
        暂时没有相关内容
      </h3>
      <image-viewer
        v-if="imgPreview.show"
        :on-close="closeViewer"
        :url="imgPreview.src"
      />
      <Pagination
        :small="true"
        v-show="total > 0"
        :limit="pageSize"
        :total="total"
        @pagination="getAllBlogs"
        :page="pageNum"
      ></Pagination>
    </ul>
  </div>
</template>
<script>
import Loading from "../../components/Loading";
import ImageViewer from "@/components/utils/image-viewer.vue";
import Pagination from "../../components/common/Pagination";
import { mapGetters, mapActions, mapMutations } from "vuex";
import mark from "../../utils/marked";
let prevOverflow = "";
export default {
  preFetch(store) {
    return store.dispatch("list/getAllBlogs");
  },
  components: {
    Loading,
    Pagination,
    ImageViewer,
  },
  data() {
    return {
      loadingMsg: "疯狂加载中！奥里给干了！！",
      showLoading: false,
      imgPreview: {
        show: false,
        src: "",
      },
      postStatus: {
        up: "UP",
        new: "NEW",
      },
    };
  },
  watch: {
    selectTags: {
      handler(n, o) {
        this.resetPageNum();
        this.getBlogsBySelectTags();
      },
    },
  },
  computed: {
    ...mapGetters(["selectTags", "blogs", "total", "pageSize", "pageNum"]),
    filterMsg() {
      let msg = "";
      this.selectTags.forEach((item, index) => {
        msg += item.name + "、";
      });
      return msg.replace(/、$/, "");
    },
  },
  beforeMount() {
    let that = this;
    this.showLoading = true;
    let res = this.getAllBlogs();
    this.showLoading = false;
  },
  mounted() {},
  methods: {
    compiledMarkdown(value) {
      return mark(value);
    },
    ...mapActions("list", {
      getAllBlogs: "getAllBlogs",
      getBlogsByLikeWords: "getBlogsByLikeWords",
      getBlogsBySelectTags: "getBlogsBySelectTags",
    }),
    ...mapMutations("list", {
      triggerPage: "TRIGGER_PAGE",
      resetPageNum: "RESET_PAGE_NUM",
    }),
    showImg(e) {
      if (e.target.tagName === "IMG") {
        //阻止正文滚动
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        this.imgPreview.show = true;
        this.imgPreview.src = e.target.src;
        console.log(this.imgPreview);
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
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.list
  padding 5px
  max-width 1000px
  margin 0 auto
  .continue-reading {
    text-decoration none
    color #0366d6
  }
  &__article
    list-style none
    margin-left 260px
    &__item
      margin 0 auto
      padding 0 10px 10px 10px
      margin-bottom 15px
      &__abstract
        margin-bottom 5px
      &__sticky-icon
         padding 0 3px
         background #ff5e52
         color #fff
         font-size 12px
         line-height 24px
         font-weight 500
         margin-left 10px
         text-align center
      &__title
        a
          text-decoration none
          color black
      &__time
        color #7f8c8d
        font-weight 400
        margin-bottom 10px
        margin-top 2px
    &__filter
      font-size 20px
      text-align center
      margin-bottom 20px
  &__loading
    position fixed
    top 50%
    left 50%
    width 300px
    height 200px
    margin-left -(@width / 2) + 125
    margin-top -(@height / 2) + 60
@media screen and (max-width 850px)
  .list
    position relative
    &__article
      list-style none
      margin-left 0
      &__item
        margin 0 auto
        padding 0 10px 10px 10px
        margin-bottom 15px
      &__abstract
        margin-bottom 5px
      &__title
        font-size 24px
      &__time
        color #7f8c8d
        font-weight 400
        margin-bottom 10px
        margin-top 2px
    &__filter
      font-size 20px
      text-align center
      margin-bottom 20px
    &__loading
      position absolute
      top 250px
      left 50%
      z-index 0
      width 300px
      margin-left -(@width / 2)
</style>
