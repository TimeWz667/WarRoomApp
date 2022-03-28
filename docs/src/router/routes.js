import Preview from "../Pages/Preview.vue";
import NoLayout from "../components/NoHelloWorld.vue";


const routes = [
    {
        path: "/",
        redirect: "/test",
        component: NoLayout,
    },
    {
        path: "/test",
        name: "test",
        component: Preview
    },
];

export default routes;
