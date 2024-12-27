import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Category from "../views/Category.vue";
import Gun from "../views/Gun.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/category/:id", name: "Category", component: Category },
  { path: "/gun/:id", name: "Gun", component: Gun },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
