const userRouter ='/user,/userEdit'
const userRouterName = '用户管理';

const departRouter ='/depart'
const departRouterName = '部门管理';

const roletRouter ='/role,/authEdit'
const roleRouterName = '角色管理';


export default {
  namespace: 'global',
  state: {
    preRouter: '',
    currentRouter:''
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
    
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },
};
