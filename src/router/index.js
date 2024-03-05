import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
import storage from 'store'
import { ACCESS_TOKEN, ROLE_CODE_STR } from '@/store/mutation-types'
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
      // 存在 token，检查角色权限
      const roleCodeStr = storage.get(ROLE_CODE_STR)
      // 不存在角色权限，返回登录页
      if (roleCodeStr === undefined || roleCodeStr === null) {
        notification.error({
          message: '无法访问',
          description: '该账号无任何角色权限，已返回登录页'
        })
        next({
          name: 'login',
          query: { redirect: to.fullPath }
        })
      }
      // 角色为管理页角色，则所有路由都开放
      if (roleCodeStr.indexOf('admin') !== -1) {
        next()
      } else {
        // 对比路由配置中的角色以及用户角色
        if (to.meta && to.meta.permission) {
          // 如果路由配置中的角色有一个是 public 或者用户角色中包含路由配置中的角色，则放行
          if (to.meta.permission.some(role => role === 'public' || roleCodeStr.indexOf(role) !== -1)) {
            next()
          } else {
            notification.error({
              message: '无法访问',
              description: '该账号无访问权限'
            })
          }
        }
      }
    }
  } else {
    next()
  }
})

export default router
