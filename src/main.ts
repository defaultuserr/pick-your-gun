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

const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi', // Default icon set
    },
  });
Amplify.configure(outputs);
const app = createApp(App);
app.use(AmplifyVue)
app.use(vuetify)
app.use(router).mount("#app");
