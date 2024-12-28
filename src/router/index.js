import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Category from "../views/Category.vue";

import Movies from "../views/Movies.vue";        // Import Movies View
import VideoGames from "../views/VideoGames.vue"; // Import VideoGames View
import MovieDetail from "../views/MovieDetail.vue";
import WeaponDetail from '../views/WeaponDetail.vue';
const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/category/:id", name: "Category", component: Category },
  {
    path: '/weapon/:id',
    component: WeaponDetail, // The new component for weapon details
  },
  { path: "/movies", name: "Movies", component: Movies },        // New route for Movies
  { path: "/video-games", name: "VideoGames", component: VideoGames }, // New route for Video Games
  { path: '/movie/:id', name: 'MovieDetail', component: MovieDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
