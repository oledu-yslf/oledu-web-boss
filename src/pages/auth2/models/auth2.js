import router from 'umi/router';
import { message } from 'antd';

import * as service from '../services/auth2';
export default {
  namespace: 'auth2',
  state: {
    list: [],
    menuList:[],roleId:'',funList:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // debugger;
        if (pathname === '/auth2' && query.roleId) {
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
      const roleId = yield select(state=>state.auth2.roleId);
      const [roleDetail,menuList] = yield [
        call(service.getRoleDetail,{roleId}),
        call(service.menuListMenu,payload)
      ];
      let list = [];
      const menuVOList = roleDetail.data.menuVOList || [];
      for(let i in menuVOList){
        if(menuVOList[i].menuFunVOList && menuVOList[i].menuFunVOList.length>0){
          list = [...menuVOList[i].menuFunVOList];
        }
      }
      
      yield put({
        type: 'save',
        payload: {
          list2:roleDetail.data.menuVOList,
          list,
          menuList: menuList.data,
        },
      });
    },
    *getRoleDetail({ payload }, { call, put,select }) {
      const roleId = yield select(state=>state.auth2.roleId);

      const data = yield call(service.getRoleDetail,{roleId});
      let list = [];
      const menuVOList = data.data.menuVOList || [];
      for(let i in menuVOList){
        if(menuVOList[i].menuFunVOList && menuVOList[i].menuFunVOList.length>0){
          list = [...menuVOList[i].menuFunVOList];
        }
      }
      yield put({
        type: 'save',
        payload: {
          list,
        },
      });
    },
    *rolerightSave({ payload }, { call, put }) {
      yield call(service.rolerightSave,payload);
      yield put({
        type: 'getRoleDetail'
      });
    },
    *rolerightUpdate({ payload }, { call, put }) {
      const data = yield call(service.rolerightUpdate,payload);
      yield put({
        type: 'getRoleDetail'
      });
    },
    *rolerightDelete({ payload }, { call, put }) {
      const data = yield call(service.rolerightDelete,payload);
      if (data.successed) {
        message.success('删除成功')
      }
      yield put({
        type: 'getRoleDetail'
      });
    },
    *menufunList({ payload }, { call, put }) {
      const {data} = yield call(service.menufunList,payload);
      console.log(data);
      yield put({
        type: 'save',
        payload:{
          funList:data || []
        }
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
