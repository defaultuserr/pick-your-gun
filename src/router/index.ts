import type { RouteRecordRaw } from 'vue-router';  // Use `import type` for types
import { createRouter, createWebHistory, } from 'vue-router';
import Home from '../views/Home.vue';
import Movies from '../views/Media.vue';  // Import Movies View
import CharacterDetail from '../views/CharacterDetail.vue'; // Import Character Details View
import MediaDetail from '../views/MediaDetail.vue';


const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'Movies', component: Movies },
  { path: '/media/:id', name: 'MediaDetail', component: MediaDetail },
  {
    path: '/character/:id',
    name: 'CharacterDetail',
    component: CharacterDetail, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
