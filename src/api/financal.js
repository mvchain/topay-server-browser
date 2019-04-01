import request from '@/utils/request'
export function getFinancal(data) {
  return request({
    url: '/financial' + data,
    method: 'get'
  })
}
export function postFinancal(data) {
  return request({
    url: '/financial',
    method: 'post',
    data
  })
}
export function putFinancal(data) {
  return request({
    url: '/financial',
    method: 'put',
    data
  })
}
export function financalOrder(opt) {
  return request({
    url: `/financial/${opt.id}/order${opt.data}`,
    method: 'get',
  })
}
