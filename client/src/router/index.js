import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export function createRouter() {
  const router = new VueRouter({
    mode: "history",
    routes: [
      {
        path: "/",
        redirect: "/main",
      },
      {
        path: "/main",
        redirect: "/main/postlist",
        component: () =>
        import(/* webpackChunkName: "articlelist" */ "../views/postMain/index.vue"),
        children:[
          {
            path: "postlist",
            component: () =>
              import(/* webpackChunkName: "articlelist" */ "../views/postMain/list.vue"),
          },
          {
            path: "post/:id",
            component: () =>
              import(/* webpackChunkName: "article" */ "../views/postMain/article.vue"),
          },
        ]
      },
      {
        path: "/postfile",
        component: () =>
          import(/* webpackChunkName: "postfile" */ "../views/file.vue"),
      },
      {
        path: "/read",
        component: () =>
          import(/* webpackChunkName: "read" */ "../views/read.vue"),
      },
      {
        path: "/about",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/about.vue"),
      },
      {
        path: "/demo",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/demo.vue"),
      }
    ],
  });
  return router;
}
