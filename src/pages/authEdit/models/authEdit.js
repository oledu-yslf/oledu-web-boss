import * as service from '../services/authEdit';
import {message} from 'antd';
import router from 'umi/router';

export default {
  namespace: 'authEdit',
  state: {
    selectedNodes:{},
    selectedKeys:[],
    roleFunList: [],
    roleMenuVOList: [],
    menuList:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/authEdit') {
          dispatch({
            type: 'save',
            payload: {
              roleId: query.roleId,
              roleName: query.roleName,

            },
          });
          dispatch({
            type: 'init',
            payload: {
              roleId: query.roleId,
            },
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }){
      const [roleDetail,menuList] = yield [
        call(service.getRoleDetail,payload),
        call(service.menuListMenu)
      ];
      let roleFunList = [];
      const roleMenuVOList = roleDetail.data.menuVOList || [];
      for(let i in roleMenuVOList){
        if(roleMenuVOList[i].menuFunVOList && roleMenuVOList[i].menuFunVOList.length>0){
          for(let j in roleMenuVOList[i].menuFunVOList){
            roleFunList.push(roleMenuVOList[i].menuFunVOList[j]);
          }
        }
      }
      yield put({
        type: 'save',
        payload: {
          roleMenuVOList,
          roleFunList,
          menuList: menuList.data,
        },
      });
    },
    *rolerightUpdate({ payload }, { call, put }) {
      const {code} = yield call(service.rolerightUpdate,payload);
      if(code ===200){
        message.success('权限更新成功').then(()=>{
          router.goBack();
        })
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
