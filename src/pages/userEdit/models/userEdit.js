import router from 'umi/router';
import { message } from 'antd';
import * as service from '../services/userEdit';


export default {
  namespace: 'userEdit',
  state: {
    staffDetail: {},
    treeDepartData: [],
    treeRoleData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/userEdit') {
          dispatch({
            type: 'init',
          });
          if (query.staffId) {
            dispatch({
              type: 'staffDetail',
              payload: {
                staffId: query.staffId,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [roleData, departData] = yield [call(service.roleListAll), call(service.departListAll)];
      yield put({
        type: 'save',
        payload: {
          treeDepartData: departData.data,
          treeRoleData: roleData.data,
        },
      });
    },
    *staffSave({ payload }, { call, put }) {
      const data = yield call(service.staffSave, payload);
      if (data.successed) {
        message.success('添加成功', 3, () => {
          router.push('/user');
        });
      }

      return data;
      //router.push('/user');
    },
    *staffUpdate({ payload }, { call, put }) {
      const data = yield call(service.staffUpdate, payload);
      if (data.successed) {
        message.success('更新成功', 3, () => {
          router.push('/user');
        });
      }

      return data;
    },
    *staffDetail({ payload }, { call, put }) {
      const { data } = yield call(service.staffDetail, payload);
      yield put({
        type: 'save',
        payload: {
          staffDetail: data,
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
