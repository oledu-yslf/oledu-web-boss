import React from 'react';
import { connect } from 'dva';
import { Form, Tree, Row, Col, Checkbox, Divider, Button } from 'antd';
import { cloneDeep, difference, union } from 'lodash';
import styles from './index.less';

const { TreeNode } = Tree;

class AuthEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedTreeKeys: [],
      checkAll: false,
      checkedFunKeys: [],
    };
  }
  handleAuth = e => {
    e.preventDefault();
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';

    const { dispatch, roleId } = this.props;
    const { checkedTreeKeys, checkedFunKeys } = this.state;
    let payload = [];
    for (let i in checkedTreeKeys) {
      let obj = {};
      obj.roleId = roleId;
      obj.effDate = 1262313831000;
      obj.expDate = 4102329600000;
      obj.createStaffId = staffId;
      obj.funType = 1;
      obj.rightId = checkedTreeKeys[i];
      payload.push(obj);
    }
    for (let i in checkedFunKeys) {
      let obj = {};
      obj.roleId = roleId;
      obj.effDate = 1262313831000;
      obj.expDate = 4102329600000;
      obj.createStaffId = staffId;
      obj.funType = 2;
      obj.rightId = checkedFunKeys[i];
      payload.push(obj);
    }
    dispatch({
      type: 'authEdit/rolerightUpdate',
      payload: payload,
    });
  };

  onTreeSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    const { checkedFunKeys } = this.state;
    if (selectedKeys.length > 0) {
      let checkAll = true;
      let selectedNodes = info.selectedNodes[0].props.dataRef;
      const { menuFunVOList } = selectedNodes;

      for (let i in menuFunVOList) {
        if (checkedFunKeys.indexOf(menuFunVOList[i].menuFuncId) === -1) {
          checkAll = false;
          break;
        }
      }
      this.setState({
        checkAll,
      });
      dispatch({
        type: 'authEdit/save',
        payload: {
          selectedNodes,
          selectedKeys,
        },
      });
    } else {
      dispatch({
        type: 'authEdit/save',
        payload: {
          selectedNodes: {},
          selectedKeys: [],
        },
      });
    }
  };

  onTreeCheck = (checkedKeys, e) => {
    this.setState({
      checkedTreeKeys: checkedKeys.checked,
    });
  };

  onCheckAllChange = e => {
    const { selectedNodes } = this.props;
    const { menuFunVOList } = selectedNodes;
    const checkedFunKeys = [];
    for (let i in menuFunVOList) {
      checkedFunKeys.push(menuFunVOList[i].menuFuncId);
    }
    this.setState({
      checkAll: e.target.checked,
    });
    if (e.target.checked) {
      this.setState(state => ({
        checkedFunKeys: [...state.checkedFunKeys, ...checkedFunKeys],
      }));
    } else {
      this.setState(state => {
        let cloneCheckedFunKeys = cloneDeep(state.checkedFunKeys);
        return { checkedFunKeys: difference(cloneCheckedFunKeys, checkedFunKeys) };
      });
    }
  };

  checkboxChange = e => {
    const { selectedNodes } = this.props;
    const { menuFunVOList } = selectedNodes;
    let did = [];
    if (e.length === menuFunVOList.length) {
      this.setState({
        checkAll: true,
      });
    } else {
      this.setState({
        checkAll: false,
      });
      let checkedFunKeys = [];
      for (let i in menuFunVOList) {
        checkedFunKeys.push(menuFunVOList[i].menuFuncId);
      }
      did = difference(checkedFunKeys, e);
    }

    this.setState(state => {
      let cloneCheckedFunKeys = cloneDeep(state.checkedFunKeys);
      return { checkedFunKeys: difference(union(cloneCheckedFunKeys, e), did) };
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth2/save',
      payload: {},
    });
  }
  componentWillReceiveProps(nextProps) {
    let checkedTreeKeys = [];
    let checkedFunKeys = [];
    if (nextProps.roleFunList !== this.props.roleFunList) {
      for (let i in nextProps.roleFunList) {
        checkedFunKeys.push(nextProps.roleFunList[i].menuFuncId);
      }
    }
    if (nextProps.roleMenuVOList !== this.props.roleMenuVOList) {
      for (let j in nextProps.roleMenuVOList) {
        checkedTreeKeys.push(nextProps.roleMenuVOList[j].menuId);
      }
      this.setState({
        checkedFunKeys,checkedTreeKeys
      });
    }
  }
  render() {
    const {
      loading,
      menuList,
      selectedNodes,
      selectedKeys,
    } = this.props;
    const { menuFunVOList } = selectedNodes;
    const { checkedTreeKeys, checkAll, checkedFunKeys } = this.state;
    const renderTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childMenuVOList) {
            return (
              <TreeNode title={item.menuName} key={item.menuId} dataRef={item}>
                {renderTreeNodes(item.childMenuVOList)}
              </TreeNode>
            );
          }
          return <TreeNode title={item.menuName} key={item.menuId} dataRef={item} />;
        });
      }
    };
    return (
      <div className={styles.normal}>
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ fontSize: '16px' }}>菜单权限</div>
            <Divider type="horizontal" />

            {menuList.length && (
              <Tree
                onSelect={this.onTreeSelect}
                selectedKeys={selectedKeys}
                checkedKeys={checkedTreeKeys}
                defaultExpandAll={true}
                checkable={true}
                checkStrictly={true}
                onCheck={this.onTreeCheck}
              >
                {renderTreeNodes(menuList)}
              </Tree>
            )}
          </Col>
          <Col span={16}>
            <div style={{ fontSize: '16px' }}>按钮权限</div>
            <Divider type="horizontal" />
            <Row>
              {menuFunVOList && (
                <Col span={4}>
                  <Checkbox onChange={this.onCheckAllChange} checked={checkAll}>
                    全选按钮
                  </Checkbox>
                </Col>
              )}
              <Col span={20}>
                <Checkbox.Group
                  style={{ width: '100%' }}
                  value={checkedFunKeys}
                  onChange={this.checkboxChange}
                >
                  {menuFunVOList &&
                    menuFunVOList.map(item => (
                      <Checkbox key={item.menuFuncId} value={item.menuFuncId}>
                        {item.funcName}
                      </Checkbox>
                    ))}
                </Checkbox.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col spna={24}>
            <Button type="primary" onClick={this.handleAuth} disabled={loading} style={{margin:'30px'}}>
              提交
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
const AuthEditForm = Form.create({ name: 'AuthEditForm' })(AuthEdit);
export default connect(state => ({ ...state.authEdit, loading: state.loading.models.authEdit }))(
  AuthEditForm,
);
