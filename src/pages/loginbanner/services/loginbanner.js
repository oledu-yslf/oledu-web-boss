import request from '@/utils/request';

export async function saveBanner (params) {
  return request({
    url:  '/api/sys/loginbanner/save',
    method: 'post',
    data: params,
  })
}

export async function queryBanner () {
  return request({
    url:  '/api/sys/loginbanner/query',
    method: 'post',
  })
}
