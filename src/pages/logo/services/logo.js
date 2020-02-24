import request from '@/utils/request';

export async function saveLogo (params) {
  return request({
    url:  '/api/sys/logo/save',
    method: 'post',
    data: params,
  })
}

export async function queryLogo () {
  return request({
    url:  '/api/sys/logo/query',
    method: 'post',
  })
}
