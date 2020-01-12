import * as service from '../services/depart';
export default {
  namespace: 'depart',
  state: {
    editDepartVisible: false,
    deteleDepartVisible: false,
    departDetail: {},
    selectedNodes: {},
    selectedKeys: [],
    parentDepartList: [],
    treeData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/depart') {
          dispatch({
            type: 'departListAll',
          });
        }
      });
    },
  },
  effects: {
    *departListAll({ payload }, { call, put }) {
      const data = yield call(service.departListAll, payload);
      const treeData = data.data;
      yield put({
        type: 'save',
        payload: {
          treeData,
        },
      });
    },
    *departList({ payload }, { call, put, select }) {
      const data = yield call(service.departList, payload);
      const departDetail = yield select(state => state.depart.departDetail);
      const parentDepartList = data.data;
      // let index;
      for (let i = 0; i < parentDepartList.length; i++) {
        if (parentDepartList[i].departId === departDetail.departId) {
          parentDepartList.splice(i, 1);
          break;
        }
      }
      yield put({
        type: 'save',
        payload: {
          parentDepartList,
        },
      });
    },
    *departSave({ payload }, { call, put }) {
      const data = yield call(service.departSave, payload);
      yield put({
        type: 'save',
        payload: {
          editDepartVisible: false,
          departDetail: {},
          parentDepartList: [],
          selectedNodes: {},
          selectedKeys: [],
        },
      });
      yield put({
        type: 'departListAll',
      });
    },
    *departUpdate({ payload }, { call, put }) {
      const data = yield call(service.departUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          editDepartVisible: false,
          departDetail: {},
          parentDepartList: [],
          selectedNodes: {},
          selectedKeys: [],
        },
      });
      yield put({
        type: 'departListAll',
      });
    },
    *departDetele({ payload }, { call, put }) {
      yield call(service.departDetele, payload);
      yield put({
        type: 'save',
        payload: {
          deteleDepartVisible: false,
          departDetail: {},
          selectedNodes: {},
          selectedKeys: [],
        },
      });
      yield put({
        type: 'departListAll',
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
