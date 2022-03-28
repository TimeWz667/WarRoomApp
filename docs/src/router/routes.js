import Layout from "../components/HelloWorld.vue";
import NoLayout from "../components/NoHelloWorld.vue";


const routes = [
    {
        path: "/",
        component: NoLayout,
    },
    {
        path: "/test",
        name: "test",
        component: Layout
    },
];

export default routes;
