import request from '@/utils/request';

export async function menuListMenu (params) {
  return request({
    url:  '/api/sys/menu/listMenu',
    method: 'post',
    data: params,
  })
}
export async function menufunList (params) {
  return request({
    url:  '/api/sys/menufun/list',
    method: 'post',
    data: params,
  })
}

export async function rolerightSave (params) {
  return request({
    url:  '/api/sys/roleright/save',
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

export async function rolerightDelete (params) {
  return request({
    url:  '/api/sys/roleright/delete',
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


