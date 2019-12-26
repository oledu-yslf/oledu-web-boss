import router from 'umi/router';
import { message } from 'antd';

import * as service from '../services/auth';
export default {
  namespace: 'auth',
  state: {
    list: [],
    menuList:[],roleId:'',funList:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // debugger;
        if (pathname === '/auth' && query.roleId) {
          dispatch({
            type: 'save',
            payload:{
              roleId:query.roleId
            }
          });
          dispatch({
            type: 'init',
          });
          
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put ,select}){
      const roleId = yield select(state=>state.auth.roleId);
      const [roleDetail,list] = yield [
        call(service.getRoleDetail,{roleId}),
        call(service.menuListMenu,payload)
      ];
      let funList = [];
      const menuVOList = roleDetail.data.menuVOList || [];
      for(let i in menuVOList){
        if(menuVOList[i].menuFunVOList && menuVOList[i].menuFunVOList.length>0){
          funList = [...menuVOList[i].menuFunVOList];
        }
      }
      yield put({
        type: 'save',
        payload: {
          menuList:roleDetail.data.menuVOList,
          list: list.data,
          funList
        },
      });
    },
    *getRoleDetail({ payload }, { call, put,select }) {
      const roleId = yield select(state=>state.auth.roleId);

      const data = yield call(service.getRoleDetail,{roleId});
      yield put({
        type: 'save',
        payload: {
          menuList:data.data.menuVOList,
        },
      });
    },
    *rolerightSave({ payload }, { call, put }) {
      const data = yield call(service.rolerightSave,payload);
      yield put({
        type: 'getRoleDetail'
      });
    },
    *rolerightUpdate({ payload }, { call, put }) {
      const data = yield call(service.rolerightUpdate,payload);
      yield put({
        type: 'getRoleDetail'
      });
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
