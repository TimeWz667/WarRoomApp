import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";


// configure router
const router = createRouter({
    history: createWebHistory(),
    routes, // short for routes: routes
});

export default router;
