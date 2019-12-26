import request from '@/utils/request';

export async function roleListAll (params) {
  return request({
    url:  '/api/sys/role/listAll',
    method: 'post',
    data: params,
  })
}

export async function departListAll (params) {
  return request({
    url:  '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  })
}

export async function staffSave (params) {
  return request({
    url:  '/api/sys/staff/save',
    method: 'post',
    data: params,
  })
}

export async function staffUpdate (params) {
  return request({
    url:  '/api/sys/staff/update',
    method: 'post',
    data: params,
  })
}

export async function staffDetail (params) {
  return request({
    url:  '/api/sys/staff/detail',
    method: 'post',
    data: params,
  })
}
