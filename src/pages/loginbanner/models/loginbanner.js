import { message } from 'antd';
import * as service from '../services/loginbanner';

export default {
  namespace: 'loginbanner',
  state: {
    fileInfo:null,
  },

  effects: {
    *saveBanner({ payload }, { call, put }) {
      const { data } = yield call(service.saveBanner, payload);
      const { result, count } = data;
      yield put({
        type: 'save',
        payload: {
          userList: result,
          total: count,
        },
      });
    },
    *queryBanner({ payload }, { call, put ,select}){
      const {data} = yield call(service.queryBanner);

      yield put({
        type: 'save',
        payload: {
          fileInfo: data,
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
