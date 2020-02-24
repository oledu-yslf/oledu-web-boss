
import request from '@/utils/request';
import qs from 'qs'
/**
 * 课程列表
 * @param {*} params
 */
export async function refreshToken (params) {
  const jwToken = JSON.parse(sessionStorage.getItem('jwToken'));
  const refresh_token = jwToken.refresh_token;
  console.log("refresh_token = " + refresh_token);
  return request('/api/oauth/token',{
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
      "Authorization": ''
    },
    method: 'POST',
    data: qs.stringify({
      client_id:'client_2',
      client_secret:123,
      grant_type:'refresh_token',
      refresh_token
    }),
  })
}

export async function queryLogo () {
  return request({
    url:  '/api/sys/logo/query',
    method: 'post',
  })
}
