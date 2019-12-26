import request from '@/utils/request';

export async function departSave (params) {
  return request({
    url:  '/api/sys/depart/save',
    method: 'post',
    data: params,
  })
}

export async function departUpdate (params) {
  return request({
    url:  '/api/sys/depart/update',
    method: 'post',
    data: params,
  })
}

export async function departDetele (params) {
  return request({
    url:  '/api/sys/depart/delete',
    method: 'post',
    data: params,
  })
}

export async function departList (params) {
  return request({
    url:  '/api/sys/depart/list',
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



