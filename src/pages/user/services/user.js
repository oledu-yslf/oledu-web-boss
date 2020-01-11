import request from '@/utils/request';

export async function staffList (params) {
  return request({
    url:  '/api/sys/staff/list',
    method: 'post',
    data: params,
  })
}

export async function staffDelete (params) {
  return request({
    url:  '/api/sys/staff/delete',
    method: 'post',
    data: params,
  })
}

export async function departListAll(params) {
  return request({
    url: '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  });
}
