import request from '@/utils/request';

export async function roleSave (params) {
  return request({
    url:  '/api/sys/role/save',
    method: 'post',
    data: params,
  })
}

export async function roleUpdate (params) {
  return request({
    url:  '/api/sys/role/update',
    method: 'post',
    data: params,
  })
}

export async function roleDetele (params) {
  return request({
    url:  '/api/sys/role/delete',
    method: 'post',
    data: params,
  })
}

export async function roleList (params) {
  return request({
    url:  '/api/sys/role/list',
    method: 'post',
    data: params,
  })
}

export async function roleListAll (params) {
  return request({
    url:  '/api/sys/role/listAll',
    method: 'post',
    data: params,
  })
}



