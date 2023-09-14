import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import notification from 'ant-design-vue/lib/notification'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: constantRouterMap.concat(asyncRouterMap)
})

/**
 * 前哨路由，检查访问的路由是否需要用户登录才能访问
 */
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.meta && to.matched.some(record => record.meta.requiresAuth)) {
    // 不存在 token，返回登录页
    if (!storage.get(ACCESS_TOKEN)) {
      notification.error({
        message: '无法访问',
        description: '尚未登陆，已返回登录页'
      })
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
