import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("./pages/Landing.vue"),
  },
  {
    path: "/authentication",
    name: "Authentication",
    component: () => import("./pages/Authentication.vue"),
  },
  {
    path: "/preflight",
    name: "Preflight",
    component: () => import("./pages/Preflight/Index.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("./pages/Home.vue"),
  },
  {
    path: "/account",
    name: "Account",
    component: () => import("./pages/Account.vue"),
  },
  {
    path: "/wire/:type/:id",
    name: "WireRoom",
    component: () => import("./pages/Wire.vue"),
  },
  {
    path: "/wire",
    name: "Wire",
    component: () => import("./pages/Wire.vue"),
  },
  {
    path: "/broadcast",
    name: "Broadcast",
    component: () => import("./pages/Broadcast/Index.vue"),
    children: [
      { path: "new", component: () => import("./pages/Broadcast/New.vue") },
      { path: "feed", component: () => import("./pages/Broadcast/Feed.vue") },
      { path: "find", component: () => import("./pages/Broadcast/Find.vue") },
      {
        path: "profile/:username",
        component: () => import("./pages/Broadcast/Profile.vue"),
      },
    ],
  },
  {
    path: "/drawer",
    name: "Drawer",
    component: () => import("./pages/Drawer.vue"),
  },
  // {
  //   path: "/satellite",
  //   name: "Satellite",
  //   component: () => import("./pages/Satellite.vue"),
  // },
  // {
  //   path: "/paradox",
  //   name: "Paradox",
  //   component: () => import("./pages/Paradox.vue"),
  // },
  // {
  //   path: "/media",
  //   name: "Media",
  //   component: () => import("./pages/Media.vue"),
  // },
  {
    path: "/forum",
    name: "Forum",
    component: () => import("./pages/Forum.vue"),
  },
  {
    path: "/forum/:id",
    name: "ForumPost",
    component: () => import("./pages/Forum.vue"),
  },
  {
    path: "/downloads",
    name: "Downloads",
    component: () => import("./pages/Downloads.vue"),
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("./pages/Privacy.vue"),
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("./pages/Terms.vue"),
  },
  {
    path: "/support",
    name: "Support",
    component: () => import("./pages/Support.vue"),
  },
  {
    path: "/developer",
    name: "Developer",
    component: () => import("./pages/Developer.vue"),
  },
  {
    path: "/terminal",
    name: "Terminal",
    component: () => import("./pages/Terminal.vue"),
  },
  // {
  //   path: "/transmission",
  //   name: "Transmission",
  //   component: () => import("./pages/Transmission.vue"),
  // },

  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
