import request from '@/utils/request'
export function tokenList(data) {
  return request({
    url: '/token' + data,
    method: 'get'
  })
}
export function createToken(data) {
  return request({
    url: '/token',
    method: 'post',
    data
  })
}
export function modifyToken(data) {
  return request({
    url: '/token/' + data.tokenId,
    method: 'put',
    data
  })
}
export function tokenPair() {
  return request({
    url: '/token/pair',
    method: 'get'
  })
}
export function modifyTokenPair(data) {
  return request({
    url: '/token/pair',
    method: 'put',
    data
  })
}
export function deleteTokenPair(data) {
  return request({
    url: '/token/pair' + data,
    method: 'delete'
  })
}
export function tokenSetting(data) {
  return request({
    url: '/token/setting' + data,
    method: 'get'
  })
}
export function modifyTokenSetting(data) {
  return request({
    url: '/token/setting/' + data.id,
    method: 'put',
    data
  })
}
export function modifyTokenTx(data) {
  return request({
    url: '/token/transaction',
    method: 'put',
    data
  })
}
export function tokenTx(data) {
  return request({
    url: '/token/transaction' + data,
    method: 'get',
  })
}

