import request from '@/utils/request'

const api = {
  List: '/sys/role/list',
  Add: '/sys/role/add',
  Edit: '/sys/role/edit',
  QueryById: '/sys/role/queryById',
  Delete: '/sys/role/delete',
  GetUserListByRoleId: '/sys/role/getUserListByRoleId',
  GetUnAuthorizedUserListByRoleId: '/sys/role/getUnAuthorizedUserListByRoleId',
  DeleteRoleUserRelation: '/sys/role/deleteRoleUserRelation',
  AddRoleUserRelation: '/sys/role/addRoleUserRelation'
}

/**
 * 获得列表信息
 * @param pageNo 当前页
 * @param pageSize 显示条数
 * @param param 搜索参数
 * @returns {*}
 */
export function getList (pageNo, pageSize, param) {
  param.pageNo = pageNo
  param.pageSize = pageSize
  param.column = 'createTime'
  param.order = 'desc'
  return request({
    url: api.List,
    method: 'get',
    params: param
  })
}

/**
 * 新增数据接口
 * @param data 新增数据
 * @returns {*}
 */
export function addData (data) {
  return request({
    url: api.Add,
    method: 'post',
    data: data
  })
}

/**
 * 根据id查询信息
 * @param id 主键ID
 * @returns {*}
 */
export function queryById (id) {
  return request({
    url: api.QueryById,
    method: 'get',
    params: { 'id': id }
  })
}

/**
 * 编辑保存信息信息
 * @param id 主键ID
 * @returns {*}
 */
export function editData (data) {
  return request({
    url: api.Edit,
    method: 'post',
    data: data
  })
}

/**
 * 删除信息
 * @param id 主键ID
 * @returns {*}
 */
export function deleteData (id) {
  return request({
    url: api.Delete,
    method: 'delete',
    params: { 'id': id }
  })
}

/**
 * 根据 roleId 获取用户列表
 * @param pageNo 当前页
 * @param pageSize 显示条数
 * @param param 搜索参数
 * @returns {*}
 */
export function getUserListByRoleId (pageNo, pageSize, param) {
  param.pageNo = pageNo
  param.pageSize = pageSize
  param.column = 'createTime'
  param.order = 'desc'
  return request({
    url: api.GetUserListByRoleId,
    method: 'get',
    params: param
  })
}

/**
 * 根据 roleId 获取未授权用户列表
 * @param pageNo 当前页
 * @param pageSize 显示条数
 * @param param 搜索参数
 * @returns {*}
 * @constructor
 */
export function getUnAuthorizedUserListByRoleId (pageNo, pageSize, param) {
  param.pageNo = pageNo
  param.pageSize = pageSize
  param.column = 'createTime'
  param.order = 'desc'
  return request({
    url: api.GetUnAuthorizedUserListByRoleId,
    method: 'get',
    params: param
  })
}

/**
 * 删除角色用户关系
 * @param userRoleId 用户角色关系ID
 * @returns {*}
 */
export function deleteRoleUserRelation (userRoleId) {
  return request({
    url: api.DeleteRoleUserRelation,
    method: 'delete',
    params: { 'userRoleId': userRoleId }
  })
}

/**
 * 删除角色用户关系
 * @param dataList 用户角色关系列表
 * @returns {*}
 */
export function addRoleUserRelation (dataList) {
  return request({
    url: api.AddRoleUserRelation,
    method: 'post',
    data: dataList
  })
}
