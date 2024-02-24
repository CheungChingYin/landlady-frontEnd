import request from '@/utils/request'

const api = {
  List: '/maindata/roomReadingRecord/list',
  UnionList: '/maindata/roomReadingRecord/unionList',
  Add: '/maindata/roomReadingRecord/add',
  Edit: '/maindata/roomReadingRecord/edit',
  QueryById: '/maindata/roomReadingRecord/queryById',
  Delete: '/maindata/roomReadingRecord/delete',
  SaveOrUpdateComplex: '/maindata/roomReadingRecord/saveOrUpdateComplexData',
  downloadRoomReadingRecordExcelTemplate: '/maindata/roomReadingRecord/downloadRoomReadingRecordExcelTemplate',
  importRoomReadingRecordExcel: '/maindata/roomReadingRecord/importRoomReadingRecordExcel'
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
 * 获得列表信息
 * @param pageNo 当前页
 * @param pageSize 显示条数
 * @param param 搜索参数
 * @returns {*}
 */
export function getUnionList (pageNo, pageSize, param) {
  param.pageNo = pageNo
  param.pageSize = pageSize
  param.column = 'createTime'
  param.order = 'desc'
  return request({
    url: api.UnionList,
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

export function downloadRoomReadingRecordExcelTemplate () {
  return request({
    url: api.downloadRoomReadingRecordExcelTemplate,
    method: 'get',
    responseType: 'blob'
  })
}
