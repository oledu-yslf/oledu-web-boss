import { message } from 'antd';
import * as service from '../services/logo';

export default {
  namespace: 'logo',
  state: {
    logoFileInfo:null,
  },

  effects: {
    *saveLogo({ payload }, { call, put }) {
      const { data } = yield call(service.saveLogo, payload);
      const { result, count } = data;
      yield put({
        type: 'save',
        payload: {
          userList: result,
          total: count,
        },
      });
    },
    *queryLogo({ payload }, { call, put ,select}){
      const {data} = yield call(service.queryLogo);

      yield put({
        type: 'save',
        payload: {
          logoFileInfo: data,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
