import { message } from 'antd';
import * as service from '../services/user';
const pageSize = 10;

export default {
  namespace: 'user',
  state: {
    userList: [],
    total:'',
    staffName:'',staffType:'',state:'',deteleUserVisible:false,staffDetail:{},treeDepartData:[]
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
          dispatch({
            type:'departListAll'
          })
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
    *departListAll({ payload }, { call, put ,select}){
      const {data} = yield call(service.departListAll)
      console.log(data);
      yield put({
        type: 'save',
        payload: {
          treeDepartData: data,
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
    },
    *staffExport({ payload,callback}, { call}) {
      const response = yield call(service.staffExport, payload);
      console.log(response);
      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.warning('Some error messages...', 5);
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
