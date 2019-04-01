import request from '@/utils/request'
export function userList(data) {
  return request({
    url: '/user' + data,
    method: 'get'
  })
}
export function userBalance(data) {
  return request({
    url: `/user/${data}/balance`,
    method: 'get'
  })
}
export function userLog(data) {
  return request({
    url: `/user/${data.id}/log${data.str}`,
    method: 'get'
  })
}
export function userStatus(data) {
  return request({
    url: `/user/${data.id}/status?status=${data.status}`,
    method: 'put'
  })
}
export function versionDetail() {
  return request({
    url: '/app',
    method: 'get'
  })
}
export function uploadApp(data) {
  return request({
    url: '/app' + '?httpUrl=' + data,
    method: 'put'
  })
}
export function userType(data) {
  return request({
    url: `/user/${data.userId}/userType`,
    method: 'put',
    data
  })
}
