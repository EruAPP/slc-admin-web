import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Import router yang sudah kita buat
import "./assets/style.css"; // Import global CSS
// import "./assets/login.css"; // Import login CSS

const app = createApp(App);

// Daftarkan router ke instance Vue
app.use(router);

// Mount aplikasi ke div #app di index.html
app.mount("#app");
