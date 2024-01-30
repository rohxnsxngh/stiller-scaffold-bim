import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import SignInPage from "../views/SignInPage.vue";
import ModelPage from "../views/ModelPage.vue";
import ProjectsPage from "../views/ProjectsPage.vue";
import { useNavbarStore } from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignInPage,
  },
  {
    path: "/model",
    name: "ModelPage",
    component: ModelPage,
  },
  {
    path: "/projects",
    name: "ProjectsPage",
    component: ProjectsPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.path === '/model') {
     useNavbarStore().toggleNavbar();
  }
  next();
 })

export default router;
