import * as service from '../services/role';
export default {
  namespace: 'role',
  state: {
    editRoleVisible: false,
    deteleRoleVisible:false,
    roleDetail: {},
    selectedNodes:{},
    selectedKeys:[],
    parentRoleList:[],
    treeData:[],

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/role') {
          dispatch({
            type: 'roleListAll',
          });
        }
      });
    },
  },
  effects: {
    *roleListAll({ payload }, { call, put }) {
      const data = yield call(service.roleListAll,payload)
      const treeData = data.data;
      yield put({
        type: 'save',
        payload: {
          treeData,
        },
      }); 
    },
    *roleList({ payload }, { call, put }) {
      const data = yield call(service.roleList,payload)
      const parentRoleList = data.data;
      yield put({
        type: 'save',
        payload: {
          parentRoleList,
        },
      }); 
    },
    *roleSave({ payload }, { call, put }){
      const data = yield call(service.roleSave,payload)
      yield put({
        type: 'save',
        payload: {
          editRoleVisible:false,
          roleDetail:{},
          parentRoleList:[]
        },
      }); 
      yield put({
        type: 'roleListAll'
      }); 
      

    },
    *roleUpdate({ payload }, { call, put }){
      const data = yield call(service.roleUpdate,payload)
      yield put({
        type: 'save',
        payload: {
          editRoleVisible:false,
          roleDetail:{},
          parentRoleList:[]
        },
      }); 
      yield put({
        type: 'roleListAll'
      }); 
    },
    *roleDetele({ payload }, { call, put }){
      yield call(service.roleDetele,payload)
      yield put({
        type: 'save',
        payload: {
          deteleRoleVisible:false,
          roleDetail:{},
        },
      }); 
      yield put({
        type: 'roleListAll'
      }); 
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
