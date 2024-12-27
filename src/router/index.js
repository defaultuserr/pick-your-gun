import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Category from "../views/Category.vue";
import Gun from "../views/Gun.vue";
import Movies from "../views/Movies.vue";        // Import Movies View
import VideoGames from "../views/VideoGames.vue"; // Import VideoGames View

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/category/:id", name: "Category", component: Category },
  { path: "/gun/:id", name: "Gun", component: Gun },
  { path: "/movies", name: "Movies", component: Movies },        // New route for Movies
  { path: "/video-games", name: "VideoGames", component: VideoGames }, // New route for Video Games
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
