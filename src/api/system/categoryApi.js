import request from '@/utils/request'
import message from 'ant-design-vue/es/message'

const api = {
  List: '/sys/category/list',
  Add: '/sys/category/add',
  Edit: '/sys/category/edit',
  QueryById: '/sys/category/queryById',
  Delete: '/sys/category/delete',
  QueryRootList: '/sys/category/queryRootList',
  QueryChildrenList: '/sys/category/queryChildrenList'
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
 * 获得根列表
 * @param param 搜索参数
 * @returns {*}
 */
export function getRootList (param) {
  return request({
    url: api.QueryRootList,
    method: 'get',
    params: param
  })
}

/**
 * 获得子列表
 * @param param 搜索参数
 * @returns {*}
 */
export function getChildrenList (param) {
  return request({
    url: api.QueryChildrenList,
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
 * 根据字典编码获得树形下拉Option数据
 * @param code 编码
 * @returns {Promise<*[]>}
 */
export async function getTreeDataOptionByCode (code) {
  let rootId = null
  await getRootList({ code: code }).then(res => {
    if (res.code !== 200) {
      message.error(res.msg)
    } else {
        rootId = res.result[0].id
    }
  })
  return getTreeDataOptionById(rootId)
}

/**
 * 获得树形下拉Option数据
 * @param id
 * @returns {Promise<*[]>}
 */
export async function getTreeDataOptionById (pid) {
  let treeDataList = null
  await getChildrenList({ pid: pid }).then(res => {
    if (res.code !== 200) {
      this.message.error(res.msg)
    } else {
      treeDataList = res.result
    }
  })
  return optionHandler(treeDataList)
}

/**
 * 组装下拉option
 * @param list 数据列表
 * @returns {*[]}
 */
function optionHandler (list) {
  const resultList = []
  if (!list || list.length === 0) {
    return resultList
  }
  // 组装下拉option
  list.forEach(item => {
    resultList.push({
      value: item.id,
      label: item.name,
      isLeaf: item.hasChild !== '1'
    })
  })
  return resultList
}
