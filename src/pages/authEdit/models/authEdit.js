import * as service from '../services/authEdit';
export default {
  namespace: 'authEdit',
  state: {
    roleFunList: [],
    roleMenuVOList: [],
    menuList:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/authEdit') {
          dispatch({
            type: 'save',
            payload: {
              roleId: query.roleId,
            },
          });
          dispatch({
            type: 'init',
            payload: {
              roleId: query.roleId,
            },
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }){
      const [roleDetail,menuList] = yield [
        call(service.getRoleDetail,payload),
        call(service.menuListMenu)
      ];
      let roleFunList = [];
      const roleMenuVOList = roleDetail.data.menuVOList || [];
      for(let i in roleMenuVOList){
        if(roleMenuVOList[i].menuFunVOList && roleMenuVOList[i].menuFunVOList.length>0){
          for(let j in roleMenuVOList[i].menuFunVOList){
            roleFunList.push(roleMenuVOList[i].menuFunVOList[j]);
          }
        }
      }
      yield put({
        type: 'save',
        payload: {
          roleMenuVOList,
          roleFunList,
          menuList: menuList.data,
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
