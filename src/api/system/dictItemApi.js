import request from '@/utils/request'
import notification from 'ant-design-vue/es/notification'

const api = {
  queryDictItemByDictCode: '/sys/dictItem/queryDictItemByDictCode',
  List: '/sys/dictItem/list',
  Add: '/sys/dictItem/add',
  Edit: '/sys/dictItem/edit',
  QueryById: '/sys/dictItem/queryById',
  Delete: '/sys/dictItem/delete'
}

/**
 * 根据字典编码获得字典项
 * @param dictCode 字典编码
 * @returns {*}
 */
export function getDictItemByDiceCode (dictCode) {
  return request({
    url: api.queryDictItemByDictCode + '/' + dictCode,
    method: 'get'
  })
}

/**
 * 根据字典编码获得字典项option
 * @param dictCode 字典编码
 * @returns {Promise<null|*[]>}
 */
export async function getDictOption (dictCode) {
  // 字典项列表
  let dictItemList = null
  // 请求接口
  await getDictItemByDiceCode(dictCode).then((res) => {
    if (res.code === 200) {
      dictItemList = res.result
    } else {
      notification.error({
        message: '错误',
        description: '字典请求错误'
      })
    }
  })
  // 组装字典option
  const result = []
  if (dictItemList != null) {
    for (const index in dictItemList) {
      const item = dictItemList[index]
      const obj = {}
      obj.label = item.itemText
      // 如果值为数字则转换为数字类型
      if (item.itemValue.match(/^\d+$/)) {
        obj.value = Number.parseInt(item.itemValue)
      } else {
        obj.value = item.itemValue
      }
      result.push(obj)
    }
  }
  return result
}

/**
 * 根据字典编码获得字典Map
 * @param dictCode 字典编码
 * @returns {Promise<{}>}
 */
export async function getDictItemMap (dictCode) {
  // 字典项列表
  let dictItemList = null
  // 请求接口
  await getDictItemByDiceCode(dictCode).then((res) => {
    if (res.code === 200) {
      dictItemList = res.result
    } else {
      notification.error({
        message: '错误',
        description: '字典请求错误'
      })
    }
  })
  // 组装字典map
  const resultMap = {}
  if (dictItemList != null) {
    for (const index in dictItemList) {
      const item = dictItemList[index]
      resultMap[item.itemValue] = item.itemText
    }
  }
  return resultMap
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
