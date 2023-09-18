import request from '@/utils/request'
import notification from 'ant-design-vue/es/notification'

const api = {
  queryDictItemByDictCode: '/sys/dictItem/queryDictItemByDictCode'
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
      obj.value = item.itemValue
      result.push(obj)
    }
  }
  return result
}