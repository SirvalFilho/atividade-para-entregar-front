import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import StartPageView from "../views/StartPageView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileDetailsView from "../views/ProfileDetailsView.vue";
import InterestsView from "../views/InterestsView.vue";
import HomeSwipeView from "../views/HomeSwipeView.vue";
import MatchesView from "../views/MatchesView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "start",
    component: StartPageView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/profile-details",
    name: "profile-details",
    component: ProfileDetailsView,
  },
  {
    path: "/interests",
    name: "interests",
    component: InterestsView,
  },
  {
    path: "/swipe",
    name: "swipe",
    component: HomeSwipeView,
  },
  {
    path: "/matches",
    name: "matches",
    component: MatchesView,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
