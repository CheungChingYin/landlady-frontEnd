import request from '@/utils/request'

const api = {
  List: '/order/orderHead/list',
  Add: '/order/orderHead/add',
  Edit: '/order/orderHead/edit',
  QueryById: '/order/orderHead/queryById',
  Delete: '/order/orderHead/delete',
  SaveOrUpdateComplex: '/order/orderHead/saveOrUpdateComplexData',
  SendOrderToRenter: '/order/orderHead/sendOrderToRenter',
  RenterConfirmOrder: '/order/orderHead/renterConfirmOrder'
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
 * 新增或更新复合数据
 * @param data 新增数据
 * @returns {*}
 */
export function saveOrUpdateComplexData (data) {
  return request({
    url: api.SaveOrUpdateComplex,
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
 * 发送订单给租户
 * @param id 主键ID
 * @returns {*}
 */
export function sendOrderToRenter (data) {
  return request({
    url: api.SendOrderToRenter,
    method: 'post',
    data: data
  })
}

/**
 * 租户确认订单
 * @param id 主键ID
 * @returns {*}
 */
export function renterConfirmOrder (data) {
  return request({
    url: api.RenterConfirmOrder,
    method: 'post',
    data: data
  })
}
