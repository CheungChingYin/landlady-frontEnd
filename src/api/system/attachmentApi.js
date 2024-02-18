import request from '@/utils/request'
import { Base64 } from 'js-base64'
const api = {
  List: '/sys/file/list',
  Add: '/sys/file/add',
  Edit: '/sys/file/edit',
  QueryById: '/sys/file/queryById',
  Delete: '/sys/file/delete',
  download: '/sys/file/download',
  downloadByUrl: '/sys/file/downloadByUrl'
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
 * 通过id获取预览文件地址
 * @param attachment 附件对象
 * @returns {string}
 */
export function getPreviewFileUrl (attachment) {
  const downloadUrl = process.env.VUE_APP_BACKEND_API_BASE_URL + api.download + '/' + attachment.id + '?fullfilename=' + attachment.attachmentName
  const encodeUrl = encodeURIComponent(Base64.encode(downloadUrl))
  return process.env.VUE_APP_KKFILEVIEW_URL + '/onlinePreview?url=' + encodeUrl + '&officePreviewType=pdf'
}

/**
 * 通过url获取预览文件地址
 * @param attachment 附件对象
 * @returns {string}
 */
export function getPreviewFileUrlByUrl (attachment) {
  // 需要对url进行base64编码
  const downloadUrl = process.env.VUE_APP_BACKEND_API_BASE_URL + api.downloadByUrl + '/' + Base64.encode(attachment.attachmentUrl) + '?fullfilename=' + attachment.attachmentName
  const encodeUrl = encodeURIComponent(Base64.encode(downloadUrl))
  return process.env.VUE_APP_KKFILEVIEW_URL + '/onlinePreview?url=' + encodeUrl + '&officePreviewType=pdf'
}

export function download (id) {
  return request({
    url: api.download + '/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
