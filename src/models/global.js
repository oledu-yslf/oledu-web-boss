import * as service from '@/services/index';

const userRouter ='/user,/userEdit'
const userRouterName = '用户管理';

const departRouter ='/depart'
const departRouterName = '部门管理';

const roletRouter ='/role,/authEdit'
const roleRouterName = '角色管理';

const logoRouter ='/logo'
const logoRouterName = 'Logo管理';

const loginBannerRouter ='/loginbanner'
const loginBannerRouterName = '背景图设置';

export default {
  namespace: 'global',
  state: {
    preRouter: '',
    currentRouter:'',
    logoFileInfo:null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        let currentRouter,currentRouterName;
        if(userRouter.indexOf(pathname)!==-1){
          currentRouter = '/user';
          currentRouterName = '用户管理'
        }else if(departRouter.indexOf(pathname)!==-1){
          currentRouter = '/depart';
          currentRouterName = '部门管理'
        }else if(roletRouter.indexOf(pathname)!==-1){
          currentRouter = '/role';
          currentRouterName = '角色管理'
        } else if (logoRouter.indexOf(pathname) !== -1) {
          currentRouter = '/logo';
          currentRouterName = 'Logo管理'
        }
        else if (loginBannerRouter.indexOf(pathname) !== -1) {
          currentRouter = '/loginbanner';
          currentRouterName = '背景图设置'
        }

        dispatch({
          type:'save',
          payload:{
            currentRouter,
            currentRouterName
          }
        })
      });
    },
  },
  effects: {
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
      return { ...state, ...action.payload};
    },
  },
};
