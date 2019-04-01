import request from '@/utils/request'
export function blockCount(data) {
  return request({
    url: '/block/account/count' + data,
    method: 'get'
  })
}
export function blockBalance(data) {
  return request({
    url: '/block/balance/' + data,
    method: 'get'
  })
}
export function blockExportCount() {
  return request({
    url: '/block/transaction/exportCount',
    method: 'get'
  })
}

export function blockStatus(data) {
  return request({
    url: '/block/status' + data,
    method: 'put',

  })
}
export function blockTx(data) {
  return request({
    url: '/block/transactions' + data,
    method: 'get',
  })
}
export function addrInfo(id) {
  return request({
    url: '/block/wallet/' + id,
    method: 'get',
  })
}
export function postBlockTx(data) {
  return request({
    url: '/block/transaction',
    method: 'post',
    data
  })
}
export function getBrowser() {
  return request({
    url: '/explorer',
    method: 'get'
  })
}
export function postBrowser(data) {
  return request({
    url: '/explorer',
    method: 'post',
    data
  })
}
