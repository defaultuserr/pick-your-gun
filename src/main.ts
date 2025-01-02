import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import AmplifyVue from '@aws-amplify/ui-vue';
Amplify.configure(outputs);
const app = createApp(App);
app.use(AmplifyVue)
app.use(router).mount("#app");
