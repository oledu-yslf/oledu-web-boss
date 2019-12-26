import * as service from '../services/depart';
export default {
  namespace: 'depart',
  state: {
    editDepartVisible: false,
    deteleDepartVisible:false,
    departDetail: {},
    selectedNodes:{},
    selectedKeys:[],
    parentDepartList:[],
    treeData:[],

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
      const data = yield call(service.departListAll,payload)
      const treeData = data.data;
      yield put({
        type: 'save',
        payload: {
          treeData,
        },
      }); 
    },
    *departList({ payload }, { call, put }) {
      const data = yield call(service.departList,payload)
      const parentDepartList = data.data;
      yield put({
        type: 'save',
        payload: {
          parentDepartList,
        },
      }); 
    },
    *departSave({ payload }, { call, put }){
      const data = yield call(service.departSave,payload)
      yield put({
        type: 'save',
        payload: {
          editDepartVisible:false,
          departDetail:{},
          parentDepartList:[]
        },
      }); 
      yield put({
        type: 'departListAll'
      }); 
      

    },
    *departUpdate({ payload }, { call, put }){
      const data = yield call(service.departUpdate,payload)
      yield put({
        type: 'save',
        payload: {
          editDepartVisible:false,
          departDetail:{},
          parentDepartList:[]
        },
      }); 
      yield put({
        type: 'departListAll'
      }); 
    },
    *departDetele({ payload }, { call, put }){
      yield call(service.departDetele,payload)
      yield put({
        type: 'save',
        payload: {
          deteleDepartVisible:false,
          departDetail:{},
        },
      }); 
      yield put({
        type: 'departListAll'
      }); 
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
