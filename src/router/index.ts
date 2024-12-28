import type { RouteRecordRaw } from 'vue-router';  // Use `import type` for types
import { createRouter, createWebHistory, } from 'vue-router';
import Home from '../views/Home.vue';
import Movies from '../views/Movies.vue';  // Import Movies View
import VideoGames from '../views/VideoGames.vue'; // Import VideoGames View
import MovieDetail from '../views/MovieDetail.vue';
import WeaponDetail from '../views/WeaponDetail.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/weapon/:id', component: WeaponDetail },
  { path: '/movies', name: 'Movies', component: Movies },
  { path: '/video-games', name: 'VideoGames', component: VideoGames },
  { path: '/movie/:id', name: 'MovieDetail', component: MovieDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
