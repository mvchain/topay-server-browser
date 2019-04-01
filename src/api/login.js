import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
export function refreshToken(data) {
  return request({
    url: '/admin/refresh',
    method: 'post'
  })
}
