import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, ROLE_CODE_STR, ROLE_LIST, USER_INFO } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { notification } from 'ant-design-vue'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code !== 200) {
            notification.error({
              message: '登陆失败',
              description: response.message
            })
          }
          const result = response.result
          // 配置token
          storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          // 设置用户信息
          storage.set(USER_INFO, result.userInfo)
          const roleList = result.userInfo.roleList
          storage.set(ROLE_LIST, roleList)
          if (roleList) {
            let roleCodeStr = ''
            roleList.forEach(role => {
              roleCodeStr += role.roleCode + ','
            })
            // 去掉最后一个逗号
            if (roleCodeStr.length > 0) {
              roleCodeStr = roleCodeStr.substring(0, roleCodeStr.length - 1)
            }
            storage.set(ROLE_CODE_STR, roleCodeStr)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getInfo().then(response => {
          const { result } = response
          if (result.role && result.role.permissions.length > 0) {
            const role = { ...result.role }
            role.permissions = result.role.permissions.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionEntitySet || {}).map(item => item.action)
               }
              return per
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // 覆盖响应体的 role, 供下游使用
            result.role = role

            commit('SET_ROLES', role)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            // 下游
            resolve(result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * 登出
     * @param commit
     * @param state
     * @returns {Promise<unknown>}
     * @constructor
     */
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          storage.remove(ACCESS_TOKEN)
          storage.remove(USER_INFO)
          storage.remove(ROLE_LIST)
          storage.remove(ROLE_CODE_STR)
          resolve()
        })
      })
    }

  }
}

export default user
