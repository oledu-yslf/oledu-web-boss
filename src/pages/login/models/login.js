import * as service from '../services/login';
export default {
  namespace: 'login',
  state: {
    prerouter: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/login') {
          dispatch({
            type: 'save',
            prerouter: query,
          });
        }
      });
    },
  },
  effects: {
    *token({ payload }, { call, put }) {
      return yield call(service.token, payload);
    },
    *loadUserByUserName({ payload }, { call, put }) {
      return yield call(service.loadUserByUserName, payload);
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },
};
