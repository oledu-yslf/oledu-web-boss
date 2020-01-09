import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, message ,Tree} from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import styles from './index.less';

const {TreeNode} = Tree;

class AuthEdit extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selectedKeys:[]
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';

    const { dispatch, list, form, roleId } = this.props;
    const { resetFields } = form;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { rangeTime, rightBtn } = values;
        const effTime = rangeTime[0].valueOf();
        const expTime = rangeTime[1].valueOf();

        let isDiff = true;
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].menuId === JSON.parse(rightBtn).rightId) {
              isDiff = false;
              break;
            }
          }
        }

        if (!isDiff) {
          message.warn('权限按钮选择重复');
          return;
        }
        resetFields();
        dispatch({
          type: 'auth2/rolerightSave',
          payload: [
            {
              roleId,
              effDate: effTime,
              expDate: expTime,
              createStaffId: staffId,
              funType: 2,
              rightId: JSON.parse(rightBtn).rightId,
            },
          ],
        });
      }
    });
  };
  
  handleRightMenuChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth2/menufunList',
      payload: {
        menuId: JSON.parse(e).rightId,
      },
    });
  };


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth2/save',
      payload: {
        list: [],
        menuList: [],
        roleId: '',
        funList: [],
      },
    });
  }

  render() {
    const { roleFunList, form, roleMenuVOList, menuList,loading } = this.props;
    const {selectedKeys} = this.state;
    const { getFieldDecorator } = form;
    const renderTreeNodes = data => {
      if (data){
        return data.map(item => {
          if (item.childMenuVOList) {
            return (
              <TreeNode title={item.menuName} key={item.menuId} dataRef={item}>
                {renderTreeNodes(item.childMenuVOList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              title={item.menuName}
              key={item.menuId}
              dataRef={item}
            />
          );
        });
      }
    };
    return (
      <div className={styles.normal}>
        {menuList.length && (
          <Tree
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
            // defaultExpandAll = {true}
            checkable={true}
            checkStrictly={true}
          >
            {renderTreeNodes(menuList)}
          </Tree>
        )}
      </div>
    );
  }
}
const AuthEditForm = Form.create({ name: 'AuthEditForm' })(AuthEdit);
export default connect(state => ({ ...state.authEdit, loading: state.loading.models.authEdit }))(
  AuthEditForm,
);
