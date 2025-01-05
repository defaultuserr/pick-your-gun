import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// Ensure you are using css-loader
import { Amplify } from "aws-amplify";

import outputs from "../amplify_outputs.json";
import AmplifyVue from '@aws-amplify/ui-vue';

import 'vuetify/styles'; 
import { createVuetify } from 'vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css'; // Import Material Design Icons

import { aliases, mdi } from 'vuetify/lib/iconsets/mdi';
const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi', 
      aliases,
      sets: {
        mdi,
      },
    },
  });
Amplify.configure(outputs);
const app = createApp(App);
app.use(AmplifyVue)
app.use(vuetify)
app.use(router).mount("#app");
