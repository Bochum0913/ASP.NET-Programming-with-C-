import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import BrandList from "./components/BrandList.vue";
import Cart from "./components/Cart.vue";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Logout from "./components/Logout.vue";
import OrderList from "./components/OrderList.vue";
import Branches from "./components/Branches.vue";
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    }, 
    {
        path: "/brands",
        name: "Brands",
        component: BrandList,
    },
    {
        path: "/tray",
        name: "tray",
        component: Cart
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },   
    { 
        path: "/login", 
        name: "login", 
        component: Login 
    },
    { 
        path: "/logout", 
        name: "logout", 
        component: Logout 
    },
    { 
        path: "/orderlist", 
        name: "orderlist", 
        component: OrderList 
    },
    { 
        path: "/map", 
        name: "map", 
        component: Branches 
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    const publicPages = ["/login", "/register", "/logout","/map",];
    const authRequired = !publicPages.includes(to.path);
    if (authRequired && !sessionStorage.getItem("user")) {
    next({
    name: "login",
    params: { nextUrl: to.name }
    });
    } else {
    next();
    }
});
export default router;