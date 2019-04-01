import request from '@/utils/request'

export function getadminList(data) {
  return request({
    url: '/admin' + data,
    method: 'get'
  })
}
export function createAdmin(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}
export function modifyAdmin(opt) {
  return request({
    url: '/admin/' + opt.id,
    method: 'put',
    data: opt
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/admin/' + data,
    method: 'delete'
  })
}
export function adminPwd(opt) {
  return request({
    url: `/admin/${opt.userId}/password`,
    method: 'put',
    data: opt
  })
}
export function ossObjHandler() {
  return request({
    url: '/admin/signature?dir=cryptovalut',
    method: 'get'
  })
}
export function sign() {
  return request({
    url: '/admin/export/sign',
    method: 'get'
  })
}
