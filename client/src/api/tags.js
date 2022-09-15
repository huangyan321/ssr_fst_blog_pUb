import { request,requestInstance } from '../utils/request'
// 为了让服务端渲染正确请求数据
if (typeof window === 'undefined') {
  requestInstance.defaults.baseURL = 'http://127.0.0.1:9000/bp/api/';
}
export function queryAllTags() {
  return request({
    url: 'tags/queryAll',
    method: 'get'
  })
}
