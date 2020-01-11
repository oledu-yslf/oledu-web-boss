import request from '@/utils/request';

export async function menuListMenu (params) {
  return request({
    url:  '/api//sys/menu/listAll',
    method: 'post',
    data: params,
  })
}

export async function getRoleDetail (params) {
  return request({
    url:  '/api/sys/role/getRoleDetail',
    method: 'post',
    data: params,
  })
}

export async function rolerightUpdate (params) {
  return request({
    url:  '/api/sys/roleright/update',
    method: 'post',
    data: params,
  })
}
