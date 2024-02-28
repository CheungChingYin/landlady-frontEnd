// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home', requiresAuth: true },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'], requiresAuth: true },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'], requiresAuth: true }
          },
          // 外部链接
          // {
          //   path: 'https://www.baidu.com/',
          //   name: 'Monitor',
          //   meta: { title: 'menu.dashboard.monitor', target: '_blank' }
          // },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: RouteView,
        meta: { title: 'menu.form', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm'),
            meta: { title: 'menu.form.basic-form', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: 'menu.form.step-form', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: 'menu.form.advanced-form', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      // 主数据管理
      {
        path: '/maindata',
        name: 'maindata',
        component: RouteView,
        redirect: '/maindata/apartmentList',
        meta: { title: 'menu.maindata', icon: 'container', permission: ['system'] },
        children: [
          {
            path: '/maindata/apartmentList',
            name: 'apartmentList',
            component: () => import('@/views/maindata/apartment/ApartmentTableList'),
            meta: { title: 'menu.maindata.apartmentList', icon: 'home', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/ApartmentAdvancedForm',
            name: 'apartmentAdvancedForm',
            component: () => import('@/views/maindata/apartment/form/ApartmentAdvancedForm'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/ApartmentFormDetail',
            name: 'apartmentFormDetail',
            component: () => import('@/views/maindata/apartment/ApartmentFormDetail'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/roomList',
            name: 'roomList',
            component: () => import('@/views/maindata/room/RoomTableList'),
            meta: { title: 'menu.maindata.roomList', icon: 'container', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RoomAdvancedForm',
            name: 'roomAdvancedForm',
            component: () => import('@/views/maindata/room/form/RoomAdvancedForm'),
            hidden: true,
            meta: { title: 'menu.maindata.roomList', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RoomDetail',
            name: 'roomDetail',
            component: () => import('@/views/maindata/room/RoomDetail'),
            hidden: true,
            meta: { title: 'menu.maindata.roomDetail', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/roomReadingRecordList',
            name: 'roomReadingRecordList',
            component: () => import('@/views/maindata/roomReadingRecord/RoomReadingRecondTableList.vue'),
            meta: { title: 'menu.maindata.roomReadingRecordList', icon: 'snippets', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RoomReadingRecordAdvancedForm',
            name: 'roomReadingRecordAdvancedForm',
            component: () => import('@/views/maindata/roomReadingRecord/form/RoomReadingRecordAdvancedForm'),
            hidden: true,
            meta: { title: 'menu.maindata.roomReadingRecordAdvancedForm', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RoomReadingRecordDetail',
            name: 'roomReadingRecordDetail',
            component: () => import('@/views/maindata/roomReadingRecord/RoomReadingRecordDetail.vue'),
            hidden: true,
            meta: { title: 'menu.maindata.roomReadingRecordDetail', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/AssetList',
            name: 'assetList',
            component: () => import('@/views/maindata/assets/AssetsTableList.vue'),
            meta: { title: 'menu.maindata.assetList', icon: 'home', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/AssetAdvancedForm',
            name: 'assetAdvancedForm',
            component: () => import('@/views/maindata/assets/form/AssetsAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/AssetsMainDataDetail',
            name: 'assetsMainDataDetail',
            component: () => import('@/views/maindata/assets/AssetsMainDataDetail'),
            hidden: true,
            meta: { title: 'menu.maindata.assetsDetail', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RenterList',
            name: 'renterList',
            component: () => import('@/views/maindata/renter/RenterTableList.vue'),
            meta: { title: 'menu.maindata.renterList', icon: 'idcard', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RenterAdvancedForm',
            name: 'renterAdvancedForm',
            component: () => import('@/views/maindata/renter/form/RenterAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/maindata/RenterDataDetail',
            name: 'renterDataDetail',
            component: () => import('@/views/maindata/renter/RenterDataDetail.vue'),
            hidden: true,
            meta: { title: 'menu.maindata.renterDetail', icon: 'idcard', keepAlive: true, permission: ['system'] }
          }
        ]
      },
      // 合同
      {
        path: '/contract',
        name: 'contract',
        component: RouteView,
        redirect: '/contract/contractList',
        meta: { title: 'menu.contract', icon: 'file-text', permission: ['system'] },
        children: [
          {
            path: '/contract/contractList',
            name: 'contractList',
            component: () => import('@/views/contract/ContractTableList'),
            meta: { title: 'menu.contract.contractHead', icon: 'contacts', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/contract/contractAdvancedForm',
            name: 'contractAdvancedForm',
            component: () => import('@/views/contract/form/ContractAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.contract.contractList', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/contract/ContractDetail',
            name: 'contractDetail',
            component: () => import('@/views/contract/ContractDetail.vue'),
            hidden: true,
            meta: { title: 'menu.contract.contractDetail', keepAlive: true, permission: ['system'] }
          }
        ]
      },
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/orderList',
        meta: { title: 'menu.order', icon: 'file-search', permission: ['system'] },
        children: [
          {
            path: '/order/orderList',
            name: 'orderList',
            component: () => import('@/views/order/OrderTableList'),
            meta: { title: 'menu.order.orderHead', icon: 'profile', keepAlive: true, permission: ['system'] }
          }
          // {
          //   path: '/order/orderAdvancedForm',
          //   name: 'orderAdvancedForm',
          //   component: () => import('@/views/order/form/OrderAdvancedForm.vue'),
          //   hidden: true,
          //   meta: { title: 'menu.order.orderList', keepAlive: true, permission: ['system'] }
          // },
          // {
          //   path: '/order/OrderDetail',
          //   name: 'orderDetail',
          //   component: () => import('@/views/order/OrderDetail.vue'),
          //   hidden: true,
          //   meta: { title: 'menu.order.orderDetail', keepAlive: true, permission: ['system'] }
          // }
        ]
      },
      // 系统管理
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        redirect: '/system/userList',
        meta: { title: 'menu.system', icon: 'setting', permission: ['system'] },
        children: [
          {
            path: '/system/userList',
            name: 'userList',
            component: () => import('@/views/system/user/UserTableList'),
            meta: { title: 'menu.system.userList', icon: 'user', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/userForm',
            name: 'userForm',
            component: () => import('@/views/system/user/UserForm'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/userFormDetail',
            name: 'userFormDetail',
            component: () => import('@/views/system/user/UserFormDetail'),
            hidden: true,
            meta: { title: 'menu.system.userFormDetail', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/dictList',
            name: 'dictList',
            component: () => import('@/views/system/dict/DictTableList'),
            meta: { title: 'menu.system.dictList', icon: 'unordered-list', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/categoryList',
            name: 'categoryList',
            component: () => import('@/views/system/category/CategoryList'),
            meta: { title: 'menu.system.categoryList', icon: 'branches', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/roleList',
            name: 'roleList',
            component: () => import('@/views/system/role/RoleTableList'),
            meta: { title: 'menu.system.roleList', icon: 'cluster', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/attachmentTab',
            name: 'attachmentTabForm',
            component: () => import('@/views/system/attachment/AttachmentTabForm'),
            hidden: true,
            meta: { title: 'menu.system.attachmentTabForm', keepAlive: true, permission: ['system'] }
          }
        ]
      },
      {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: 'menu.list', icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.list.table-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: 'menu.list.basic-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: 'menu.list.card-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
              }
            ]
          }
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: 'menu.profile', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: 'menu.profile.basic', permission: ['profile'] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: 'menu.profile.advanced', permission: ['profile'] }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['user'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['user'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['user'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              }
            ]
          }
        ]
      }

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
