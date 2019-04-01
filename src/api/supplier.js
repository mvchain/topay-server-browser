import request from '@/utils/request'

export function getBatch(opt) {
  return request({
    url: `/supplier/${opt.id}/tx` + opt.condition,
    method: 'get'
  })
}
