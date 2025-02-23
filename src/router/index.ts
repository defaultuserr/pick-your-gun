import type { RouteRecordRaw } from 'vue-router';  // Use `import type` for types
import { createRouter, createWebHistory, } from 'vue-router';
import Home from '../views/Home.vue';
import Movies from '../views/Media.vue';  // Import Movies View
import CharacterDetail from '../views/CharacterDetail.vue'; // Import Character Details View
import MediaDetail from '../views/MediaDetail.vue';
import SignIn from "../views/signin/signin.vue"
import cosplaysubmitform from "../views/submitCosplay/cosplaysubmissionform.vue"
import ai from '../views/ai/ai.vue'
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'Movies', component: Movies },
  { path: '/media/:id', name: 'MediaDetail', component: MediaDetail },
  {
    path: '/character/:id',
    name: 'CharacterDetail',
    component: CharacterDetail, 
  },
  { path: '/sign-in', component: SignIn },
  {path: '/submit', component: cosplaysubmitform},
  {path: '/ai', component: ai}

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
