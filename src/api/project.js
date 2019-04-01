import request from '@/utils/request'
export function projectList(data) {
  return request({
    url: '/project' + data,
    method: 'get'
  })
}
export function createProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data
  })
}
export function modifyProject(data) {
  return request({
    url: '/project',
    method: 'put',
    data
  })
}
export function deleteProject(data) {
  return request({
    url: '/project' + data,
    method: 'delete'
  })
}
export function projectOrder(data) {
  return request({
    url: '/project/order' + data,
    method: 'get'
  })
}
export function deleteOrder(data) {
  return request({
    url: '/project/order' + data,
    method: 'delete'
  })
}
