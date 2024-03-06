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
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['admin', 'public'], requiresAuth: true },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            hidden: true,
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['admin', 'public'], requiresAuth: true }
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
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['admin', 'public'], requiresAuth: true }
          }
        ]
      },
      // 主数据管理
      {
        path: '/maindata',
        name: 'maindata',
        component: RouteView,
        redirect: '/maindata/apartmentList',
        meta: { title: 'menu.maindata', icon: 'container', permission: ['admin'], requiresAuth: true },
        children: [
          {
            path: '/maindata/apartmentList',
            name: 'apartmentList',
            component: () => import('@/views/maindata/apartment/ApartmentTableList'),
            meta: { title: 'menu.maindata.apartmentList', icon: 'home', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/ApartmentAdvancedForm',
            name: 'apartmentAdvancedForm',
            component: () => import('@/views/maindata/apartment/form/ApartmentAdvancedForm'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/ApartmentFormDetail',
            name: 'apartmentFormDetail',
            component: () => import('@/views/maindata/apartment/ApartmentFormDetail'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/roomList',
            name: 'roomList',
            component: () => import('@/views/maindata/room/RoomTableList'),
            meta: { title: 'menu.maindata.roomList', icon: 'container', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RoomAdvancedForm',
            name: 'roomAdvancedForm',
            component: () => import('@/views/maindata/room/form/RoomAdvancedForm'),
            hidden: true,
            meta: { title: 'menu.maindata.roomList', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RoomDetail',
            name: 'roomDetail',
            component: () => import('@/views/maindata/room/RoomDetail'),
            hidden: true,
            meta: { title: 'menu.maindata.roomDetail', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/roomReadingRecordList',
            name: 'roomReadingRecordList',
            component: () => import('@/views/maindata/roomReadingRecord/RoomReadingRecondTableList.vue'),
            meta: { title: 'menu.maindata.roomReadingRecordList', icon: 'snippets', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RoomReadingRecordAdvancedForm',
            name: 'roomReadingRecordAdvancedForm',
            component: () => import('@/views/maindata/roomReadingRecord/form/RoomReadingRecordAdvancedForm'),
            hidden: true,
            meta: { title: 'menu.maindata.roomReadingRecordAdvancedForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RoomReadingRecordDetail',
            name: 'roomReadingRecordDetail',
            component: () => import('@/views/maindata/roomReadingRecord/RoomReadingRecordDetail.vue'),
            hidden: true,
            meta: { title: 'menu.maindata.roomReadingRecordDetail', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/AssetList',
            name: 'assetList',
            component: () => import('@/views/maindata/assets/AssetsTableList.vue'),
            meta: { title: 'menu.maindata.assetList', icon: 'home', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/AssetAdvancedForm',
            name: 'assetAdvancedForm',
            component: () => import('@/views/maindata/assets/form/AssetsAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/AssetsMainDataDetail',
            name: 'assetsMainDataDetail',
            component: () => import('@/views/maindata/assets/AssetsMainDataDetail'),
            hidden: true,
            meta: { title: 'menu.maindata.assetsDetail', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RenterList',
            name: 'renterList',
            component: () => import('@/views/maindata/renter/RenterTableList.vue'),
            meta: { title: 'menu.maindata.renterList', icon: 'idcard', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RenterAdvancedForm',
            name: 'renterAdvancedForm',
            component: () => import('@/views/maindata/renter/form/RenterAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/maindata/RenterDataDetail',
            name: 'renterDataDetail',
            component: () => import('@/views/maindata/renter/RenterDataDetail.vue'),
            hidden: true,
            meta: { title: 'menu.maindata.renterDetail', icon: 'idcard', keepAlive: true, permission: ['admin'], requiresAuth: true }
          }
        ]
      },
      // 合同
      {
        path: '/contract',
        name: 'contract',
        component: RouteView,
        redirect: '/contract/contractList',
        meta: { title: 'menu.contract', icon: 'file-text', permission: ['admin'], requiresAuth: true },
        children: [
          {
            path: '/contract/contractList',
            name: 'contractList',
            component: () => import('@/views/contract/ContractTableList'),
            meta: { title: 'menu.contract.contractHead', icon: 'contacts', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/contract/renterContractTableList',
            name: 'renterContractTableList',
            component: () => import('@/views/contract/RenterContractTableList.vue'),
            meta: { title: 'menu.contract.renterContractHead', icon: 'contacts', keepAlive: true, permission: ['admin', 'renter'], requiresAuth: true }
          },
          {
            path: '/contract/contractAdvancedForm',
            name: 'contractAdvancedForm',
            component: () => import('@/views/contract/form/ContractAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.contract.contractList', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/contract/ContractDetail',
            name: 'contractDetail',
            component: () => import('@/views/contract/ContractDetail.vue'),
            hidden: true,
            meta: { title: 'menu.contract.contractDetail', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/contract/RenterContractDetail',
            name: 'renterContractDetail',
            component: () => import('@/views/contract/RenterContractDetail.vue'),
            hidden: true,
            meta: { title: 'menu.contract.contractDetail', keepAlive: true, permission: ['admin', 'renter'], requiresAuth: true }
          }
        ]
      },
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/orderList',
        meta: { title: 'menu.order', icon: 'file-search', permission: ['admin'], requiresAuth: true },
        children: [
          {
            path: '/order/orderList',
            name: 'orderList',
            component: () => import('@/views/order/OrderTableList'),
            meta: { title: 'menu.order.orderHead', icon: 'profile', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/order/orderAdvancedForm',
            name: 'orderAdvancedForm',
            component: () => import('@/views/order/form/OrderAdvancedForm.vue'),
            hidden: true,
            meta: { title: 'menu.order.orderList', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/order/OrderDetail',
            name: 'orderDetail',
            component: () => import('@/views/order/OrderDetail.vue'),
            hidden: true,
            meta: { title: 'menu.order.orderDetail', keepAlive: true, permission: ['admin'], requiresAuth: true }
          }
        ]
      },
      // 系统管理
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        redirect: '/system/userList',
        meta: { title: 'menu.system', icon: 'setting', permission: ['admin'], requiresAuth: true },
        children: [
          {
            path: '/system/userList',
            name: 'userList',
            component: () => import('@/views/system/user/UserTableList'),
            meta: { title: 'menu.system.userList', icon: 'user', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/system/userForm',
            name: 'userForm',
            component: () => import('@/views/system/user/UserForm'),
            hidden: true,
            meta: { title: 'menu.system.userForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/system/userFormDetail',
            name: 'userFormDetail',
            component: () => import('@/views/system/user/UserFormDetail'),
            hidden: true,
            meta: { title: 'menu.system.userFormDetail', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/system/dictList',
            name: 'dictList',
            component: () => import('@/views/system/dict/DictTableList'),
            meta: { title: 'menu.system.dictList', icon: 'unordered-list', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/system/categoryList',
            name: 'categoryList',
            component: () => import('@/views/system/category/CategoryList'),
            meta: { title: 'menu.system.categoryList', icon: 'branches', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/system/roleList',
            name: 'roleList',
            component: () => import('@/views/system/role/RoleTableList'),
            meta: { title: 'menu.system.roleList', icon: 'cluster', keepAlive: true, permission: ['admin'], requiresAuth: true }
          },
          {
            path: '/system/attachmentTab',
            name: 'attachmentTabForm',
            component: () => import('@/views/system/attachment/AttachmentTabForm'),
            hidden: true,
            meta: { title: 'menu.system.attachmentTabForm', keepAlive: true, permission: ['admin'], requiresAuth: true }
          }
        ]
      }
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
