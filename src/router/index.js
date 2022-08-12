import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../components/dashboard/container.vue')
    },
    {
      path: '/clients',
      name: 'Clients',
      component: () => import('../components/clients/table.vue')
    },
    {
      path: '/catalogs',
      name: 'Catalogs',
      component: () => import('../components/catalogs/container.vue')
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../components/activities/calendar.vue')
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
