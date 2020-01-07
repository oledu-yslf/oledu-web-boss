import { message } from 'antd';
import * as service from '../services/user';
const pageSize = 10;

export default {
  namespace: 'user',
  state: {
    userList: [],
    total:'',
    staffName:'',staffType:'',state:'',deteleUserVisible:false,staffDetail:{}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/user') {
          dispatch({
            type: 'staffList',
            payload: {
              staffId: '',
              departId: '',
              staffNo: '',
              staffName: '',
              sex: '',
              staffType: '',
              state: '',
              page: {
                pageSize,
                pageNum: 1,
              },
            },
          });
        }
      });
    },
  },
  effects: {
    *staffList({ payload }, { call, put }) {
      const { data } = yield call(service.staffList, payload);
      const { result, count } = data;
      yield put({
        type: 'save',
        payload: {
          userList: result,
          total: count,
        },
      });
    },
    *staffDelete({ payload }, { call, put ,select}){
      const data = yield call(service.staffDelete,payload)
      if (data.successed) {
        message.success('删除成功')
      }
      yield put({
        type: 'save',
        payload: {
          deteleUserVisible:false,
          staffDetail:{},
        },
      }); 
      const {staffName,staffType,state} = yield select(state => state.user)
      yield put({
        type: 'staffList',
        payload: {
          staffId: '',
          departId: '',
          staffNo: '',
          staffName,
          sex: '',
          staffType,
          state,
          page: {
            pageSize,
            pageNum: 1,
          },
        },
      }); 
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};